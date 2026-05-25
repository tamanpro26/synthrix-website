import { NextRequest, NextResponse } from "next/server";

const BASE    = "https://openrouter.ai/api/v1/chat/completions";
const REFERER = "https://synthrix-website.vercel.app";

/* Primary model + fallback per specialist — verified free on OpenRouter as of May 2026 */
const TEAM: Record<string, { id: string; fallback: string; role: string }> = {
  ORACLE:  { id: "google/gemma-4-31b-it:free",                        fallback: "deepseek/deepseek-v4-flash:free",               role: "Strategic Reasoning"       },
  SCOUT:   { id: "deepseek/deepseek-v4-flash:free",                   fallback: "google/gemma-4-26b-a4b-it:free",                role: "Research & Context"        },
  SAGE:    { id: "nvidia/nemotron-3-super-120b-a12b:free",            fallback: "google/gemma-4-31b-it:free",                    role: "Deep Reasoning"            },
  FORGE:   { id: "deepseek/deepseek-v4-flash:free",                   fallback: "google/gemma-4-31b-it:free",                    role: "Technical & Code"          },
  JUDGE:   { id: "arcee-ai/trinity-large-thinking:free",              fallback: "google/gemma-4-31b-it:free",                    role: "Critical Analysis"         },
  HERALD:  { id: "google/gemma-4-26b-a4b-it:free",                    fallback: "deepseek/deepseek-v4-flash:free",               role: "Writing & Comms"           },
  THINKER: { id: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",fallback: "arcee-ai/trinity-large-thinking:free",          role: "Logic & Problem Solving"   },
  SWIFT:   { id: "deepseek/deepseek-v4-flash:free",                   fallback: "google/gemma-4-26b-a4b-it:free",                role: "Quick Synthesis"           },
  WEAVER:  { id: "google/gemma-4-31b-it:free",                        fallback: "baidu/cobuddy:free",                            role: "Creative Synthesis"        },
  NEXUS:   { id: "deepseek/deepseek-v4-flash:free",                   fallback: "google/gemma-4-31b-it:free",                    role: "Code Review & Integration" },
};

const ROUTING: Record<string, string[]> = {
  code:     ["FORGE", "NEXUS", "SAGE"],
  creative: ["HERALD", "WEAVER", "SCOUT"],
  analysis: ["SAGE",  "JUDGE", "ORACLE"],
  general:  ["ORACLE","SCOUT", "SWIFT"],
};

function detectTask(prompt: string): string {
  const p = prompt.toLowerCase();
  if (/\b(code|function|class|bug|debug|script|implement|error|syntax|program)\b/.test(p)) return "code";
  if (/\b(write|essay|story|blog|post|creative|describe|lore|narrative|announcement)\b/.test(p)) return "creative";
  if (/\b(analyze|research|why|how does|explain|compare|difference|review|what is)\b/.test(p)) return "analysis";
  return "general";
}

async function callModel(
  name: string,
  modelId: string,
  role: string,
  systemPrompt: string,
  messages: { role: string; content: string }[],
  apiKey: string
): Promise<string> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": REFERER,
      "X-Title": "SYNTHRIX Mission Control",
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: "system", content: `You are ${name}, an AI specialist in ${role}. ${systemPrompt}` },
        ...messages,
      ],
      max_tokens: 800,
      temperature: 0.72,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(`${name}: ${err?.error?.message ?? res.status}`);
  }
  const data = await res.json() as { choices: { message: { content: string } }[] };
  return data.choices[0].message.content;
}

async function callWithFallback(
  name: string,
  systemPrompt: string,
  messages: { role: string; content: string }[],
  apiKey: string
): Promise<string> {
  const spec = TEAM[name];
  try {
    return await callModel(name, spec.id, spec.role, systemPrompt, messages, apiKey);
  } catch {
    return await callModel(name, spec.fallback, spec.role, systemPrompt, messages, apiKey);
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY not configured. Add it to Vercel Environment Variables." }, { status: 500 });
  }

  const body = await req.json() as { prompt?: string; history?: { role: string; content: string }[]; systemContext?: string };
  const { prompt, history = [], systemContext = "" } = body;
  if (!prompt?.trim()) return NextResponse.json({ error: "No prompt provided" }, { status: 400 });

  const taskType        = detectTask(prompt);
  const specialistNames = ROUTING[taskType];
  const messages        = [...history.slice(-8), { role: "user", content: prompt }];

  const results = await Promise.allSettled(
    specialistNames.map((name) => callWithFallback(name, systemContext, messages, apiKey))
  );

  const successes = results
    .map((r, i) => r.status === "fulfilled" ? { name: specialistNames[i], content: r.value } : null)
    .filter(Boolean) as { name: string; content: string }[];

  if (successes.length === 0) {
    const errors = results
      .map((r, i) => r.status === "rejected" ? `${specialistNames[i]}: ${(r as PromiseRejectedResult).reason?.message}` : null)
      .filter(Boolean).join(" | ");
    return NextResponse.json({ error: `All team members failed. ${errors}` }, { status: 502 });
  }

  if (successes.length === 1) {
    return NextResponse.json({
      result: successes[0].content,
      team: [{ name: successes[0].name, role: TEAM[successes[0].name].role }],
      taskType,
    });
  }

  const synthName  = specialistNames.includes("ORACLE") ? "THINKER" : "ORACLE";
  const synthInput = successes.map((s) => `[${s.name} — ${TEAM[s.name].role}]:\n${s.content}`).join("\n\n---\n\n");

  let finalResult: string;
  try {
    finalResult = await callWithFallback(
      synthName,
      "Synthesize the specialist responses below into one clear, complete answer. Remove redundancy, keep best insights. Maintain a sharp, futuristic tone fitting SYNTHRIX Studio.",
      [{ role: "user", content: `Question: ${prompt}\n\nSpecialist inputs:\n${synthInput}` }],
      apiKey
    );
  } catch {
    finalResult = successes.sort((a, b) => b.content.length - a.content.length)[0].content;
  }

  return NextResponse.json({
    result: finalResult,
    team: successes.map((s) => ({ name: s.name, role: TEAM[s.name].role })),
    synthesizer: synthName,
    taskType,
  });
}
