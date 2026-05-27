import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

const BASE    = "https://openrouter.ai/api/v1/chat/completions";
const REFERER = "https://synthrix-website.vercel.app";

/* Ordered by reliability — first success wins */
const FREE_MODELS = [
  "deepseek/deepseek-r1:free",
  "deepseek/deepseek-v3:free",
  "google/gemma-2-9b-it:free",
  "meta-llama/llama-3.2-3b-instruct:free",
];

/* Specialist personas — shown in UI, all routed to best available model */
const TEAM: Record<string, { role: string }> = {
  ORACLE:  { role: "Strategic Reasoning"       },
  SCOUT:   { role: "Research & Context"        },
  SAGE:    { role: "Deep Reasoning"            },
  FORGE:   { role: "Technical & Code"          },
  JUDGE:   { role: "Critical Analysis"         },
  HERALD:  { role: "Writing & Comms"           },
  THINKER: { role: "Logic & Problem Solving"   },
  SWIFT:   { role: "Quick Synthesis"           },
  WEAVER:  { role: "Creative Synthesis"        },
  NEXUS:   { role: "Code Review & Integration" },
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

async function tryModel(
  modelId: string,
  messages: { role: string; content: string }[],
  apiKey: string,
  timeoutMs = 25000
): Promise<string> {
  const res = await fetch(BASE, {
    method: "POST",
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": REFERER,
      "X-Title": "SYNTHRIX Mission Control",
    },
    body: JSON.stringify({
      model: modelId,
      messages,
      max_tokens: 600,
      temperature: 0.72,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(`[${modelId}] ${err?.error?.message ?? res.status}`);
  }
  const data = await res.json() as { choices: { message: { content: string } }[] };
  return data.choices[0].message.content;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY not set in Vercel Environment Variables." },
      { status: 500 }
    );
  }

  const body = await req.json() as {
    prompt?: string;
    history?: { role: string; content: string }[];
    systemContext?: string;
  };
  const { prompt, history = [], systemContext = "" } = body;
  if (!prompt?.trim()) return NextResponse.json({ error: "No prompt provided" }, { status: 400 });

  const taskType        = detectTask(prompt);
  const specialistNames = ROUTING[taskType];
  const lead            = specialistNames[0];
  const leadRole        = TEAM[lead].role;

  const messages = [
    {
      role: "system",
      content: `You are ${lead}, an AI specialist in ${leadRole} for SYNTHRIX Studio — an indie game development studio. ${systemContext} Answer concisely and with a sharp, professional tone.`,
    },
    ...history.slice(-6),
    { role: "user", content: prompt },
  ];

  const errors: string[] = [];
  for (const modelId of FREE_MODELS) {
    try {
      const result = await tryModel(modelId, messages, apiKey);
      return NextResponse.json({
        result,
        team: specialistNames.map((n) => ({ name: n, role: TEAM[n].role })),
        synthesizer: lead,
        taskType,
        model: modelId,
      });
    } catch (e) {
      errors.push(e instanceof Error ? e.message : String(e));
    }
  }

  return NextResponse.json(
    { error: `All models failed. ${errors.join(" | ")}` },
    { status: 502 }
  );
}
