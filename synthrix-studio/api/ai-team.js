const BASE = 'https://openrouter.ai/api/v1/chat/completions';
const REFERER = 'https://synthrix-website.vercel.app';

const TEAM = {
  ORACLE:  { id: 'meta-llama/llama-3.3-70b-instruct:free',     role: 'Strategic Reasoning'        },
  SCOUT:   { id: 'google/gemini-2.0-flash-exp:free',            role: 'Research & Context'         },
  SAGE:    { id: 'deepseek/deepseek-r1:free',                   role: 'Deep Reasoning'             },
  FORGE:   { id: 'qwen/qwen-2.5-72b-instruct:free',             role: 'Technical & Code'           },
  JUDGE:   { id: 'microsoft/phi-4:free',                        role: 'Critical Analysis'          },
  HERALD:  { id: 'mistralai/mistral-7b-instruct:free',          role: 'Writing & Comms'            },
  THINKER: { id: 'google/gemini-2.0-flash-thinking-exp:free',   role: 'Logic & Problem Solving'    },
  SWIFT:   { id: 'meta-llama/llama-3.1-8b-instruct:free',       role: 'Quick Synthesis'            },
  WEAVER:  { id: 'openchat/openchat-7b:free',                   role: 'Creative Synthesis'         },
  NEXUS:   { id: 'qwen/qwen-2.5-coder-32b-instruct:free',       role: 'Code Review & Integration'  },
};

const ROUTING = {
  code:     ['FORGE', 'NEXUS', 'SAGE'],
  creative: ['HERALD', 'WEAVER', 'SCOUT'],
  analysis: ['SAGE',  'JUDGE', 'ORACLE'],
  general:  ['ORACLE','SCOUT', 'SWIFT'],
};

function detectTask(prompt) {
  const p = prompt.toLowerCase();
  if (/\b(code|function|class|bug|debug|script|implement|error|syntax|program)\b/.test(p)) return 'code';
  if (/\b(write|essay|story|blog|post|creative|describe|lore|narrative|announcement)\b/.test(p)) return 'creative';
  if (/\b(analyze|research|why|how does|explain|compare|difference|review|what is)\b/.test(p)) return 'analysis';
  return 'general';
}

async function callModel(name, model, systemPrompt, messages, apiKey) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': REFERER,
      'X-Title': 'SYNTHRIX Mission Control'
    },
    body: JSON.stringify({
      model: model.id,
      messages: [
        { role: 'system', content: `You are ${name}, an AI specialist in ${model.role}. ${systemPrompt}` },
        ...messages
      ],
      max_tokens: 800,
      temperature: 0.72
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`${name}: ${err?.error?.message || res.status}`);
  }
  const data = await res.json();
  return data.choices[0].message.content;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured. Add it to Vercel Environment Variables.' });

  const { prompt, history = [], systemContext = '' } = req.body || {};
  if (!prompt || !prompt.trim()) return res.status(400).json({ error: 'No prompt provided' });

  const taskType = detectTask(prompt);
  const specialistNames = ROUTING[taskType];

  const messages = [
    ...history.slice(-8),
    { role: 'user', content: prompt }
  ];

  /* Run 3 specialists in parallel */
  const results = await Promise.allSettled(
    specialistNames.map(name =>
      callModel(name, TEAM[name], systemContext, messages, apiKey)
    )
  );

  const successes = results
    .map((r, i) => r.status === 'fulfilled'
      ? { name: specialistNames[i], content: r.value }
      : null)
    .filter(Boolean);

  if (successes.length === 0) {
    const errors = results.map((r, i) =>
      r.status === 'rejected' ? `${specialistNames[i]}: ${r.reason?.message}` : null
    ).filter(Boolean).join(' | ');
    return res.status(502).json({ error: `All team members failed. ${errors}` });
  }

  /* Single success — return directly without synthesis call */
  if (successes.length === 1) {
    return res.json({
      result: successes[0].content,
      team: [{ name: successes[0].name, role: TEAM[successes[0].name].role }],
      taskType
    });
  }

  /* Synthesize: pick a model NOT already used as specialist */
  const synthName = specialistNames.includes('ORACLE') ? 'THINKER' : 'ORACLE';
  const synthInput = successes
    .map(s => `[${s.name} — ${TEAM[s.name].role}]:\n${s.content}`)
    .join('\n\n---\n\n');

  let finalResult;
  try {
    finalResult = await callModel(
      synthName, TEAM[synthName],
      'You are the team coordinator synthesizing specialist responses. Merge the best insights, remove redundancy, and produce one concise, complete answer. Maintain a sharp, futuristic tone fitting SYNTHRIX Studio.',
      [{ role: 'user', content: `Question: ${prompt}\n\nSpecialist inputs:\n${synthInput}` }],
      apiKey
    );
  } catch (_) {
    /* Fallback: return longest specialist response */
    finalResult = successes.sort((a, b) => b.content.length - a.content.length)[0].content;
  }

  return res.json({
    result: finalResult,
    team: successes.map(s => ({ name: s.name, role: TEAM[s.name].role })),
    synthesizer: synthName,
    taskType
  });
};
