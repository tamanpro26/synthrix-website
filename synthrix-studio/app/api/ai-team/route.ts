import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

const BASE    = "https://openrouter.ai/api/v1/chat/completions";
const REFERER = "https://synthrix-website.vercel.app";

/* Primary model — used first because it supports tool calling */
const PRIMARY = "deepseek/deepseek-v4-flash:free";

/* Fallback pool — raced in parallel if primary is unavailable */
const FALLBACK_MODELS = [
  "google/gemma-4-31b-it:free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "poolside/laguna-m.1:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  "baidu/cobuddy:free",
];

/* 15 specialist personas */
const TEAM: Record<string, { role: string }> = {
  ORACLE:    { role: "Strategic Reasoning"          },
  SCOUT:     { role: "Research & Context"           },
  SAGE:      { role: "Deep Reasoning"               },
  FORGE:     { role: "Technical & Code"             },
  JUDGE:     { role: "Critical Analysis"            },
  HERALD:    { role: "Writing & Comms"              },
  THINKER:   { role: "Logic & Problem Solving"      },
  SWIFT:     { role: "Quick Synthesis"              },
  WEAVER:    { role: "Creative Synthesis"           },
  NEXUS:     { role: "Code Review & Integration"    },
  ARCHITECT: { role: "System Architecture & Design" },
  DEVOPS:    { role: "Infrastructure & Deployment"  },
  PIXEL:     { role: "Game Design & Mechanics"      },
  CIPHER:    { role: "Security & Compliance"        },
  LORE:      { role: "Narrative & World-building"   },
};

const ROUTING: Record<string, string[]> = {
  code:     ["FORGE",     "NEXUS",    "ARCHITECT"],
  creative: ["HERALD",    "WEAVER",   "LORE"     ],
  analysis: ["SAGE",      "JUDGE",    "CIPHER"   ],
  game:     ["PIXEL",     "FORGE",    "LORE"     ],
  devops:   ["DEVOPS",    "ARCHITECT","NEXUS"    ],
  general:  ["ORACLE",    "SCOUT",    "SWIFT"    ],
};

function detectTask(prompt: string): string {
  const p = prompt.toLowerCase();
  if (/\b(deploy|ci|pipeline|docker|server|infra|build|env|devops|vercel|hosting)\b/.test(p))       return "devops";
  if (/\b(game|mechanic|level|player|spawn|enemy|collision|physics|gameplay|design)\b/.test(p))      return "game";
  if (/\b(code|function|class|bug|debug|script|implement|error|syntax|component|hook|api)\b/.test(p)) return "code";
  if (/\b(write|essay|story|blog|post|creative|describe|lore|narrative|announcement|bio)\b/.test(p)) return "creative";
  if (/\b(analyze|research|why|how does|explain|compare|difference|review|what is|assess)\b/.test(p)) return "analysis";
  return "general";
}

/* ── Tools the AI can call ── */
const TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "get_studio_context",
      description:
        "Get full SYNTHRIX Studio context: game catalog, tech stack, team, and project status. Call this whenever you need accurate studio-specific data before answering.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "create_artifact",
      description:
        "Create any code file, component, CSS, config, JSON, document, or text artifact. ALWAYS call this tool when the user asks you to CREATE, WRITE, BUILD, MAKE, or GENERATE anything. Pass the COMPLETE, production-ready content — not a description of what to make.",
      parameters: {
        type: "object",
        properties: {
          filename: {
            type: "string",
            description: "Filename with extension, e.g. GameCard.tsx, hero.css, schema.json",
          },
          content: {
            type: "string",
            description: "The full, complete, ready-to-use file content",
          },
          language: {
            type: "string",
            description: "Language or format: typescript | css | json | html | markdown | python | bash",
          },
          summary: {
            type: "string",
            description: "One sentence describing what this file does",
          },
        },
        required: ["filename", "content", "language", "summary"],
      },
    },
  },
];

/* ── Tool execution (server-side) ── */
function executeTool(name: string, args: Record<string, string>): string {
  if (name === "get_studio_context") {
    return JSON.stringify({
      studio: "SYNTHRIX Studio",
      mission: "Indie game development — creating innovative, immersive experiences",
      techStack: {
        web: "Next.js 15, TypeScript, Tailwind CSS, Vercel",
        gameEngines: ["Godot 4", "Unity", "Unreal Engine 5"],
        ai: "OpenRouter multi-model (15 specialists, parallel routing)",
      },
      games: [
        { title: "Escape the Bridge", slug: "escape-the-bridge", genre: "Puzzle/Adventure", engine: "Godot 4",        status: "Live"           },
        { title: "BOOM",              slug: "boom",              genre: "Action",           engine: "Unity",           status: "Live"           },
        { title: "Overdrive",         slug: "overdrive",         genre: "Racing",           engine: "Unreal Engine 5", status: "Live"           },
        { title: "SynthPad 2",        slug: "synthpad-2",        genre: "Music/Rhythm",     engine: "Godot 4",         status: "In Development" },
      ],
      team: Object.keys(TEAM),
      routing: ROUTING,
    });
  }

  if (name === "create_artifact") {
    /* Signal to the caller to use args directly as the formatted response */
    return "__ARTIFACT__";
  }

  return "Tool not found.";
}

/* ── Format artifact as plain-text (no markdown renderer in UI) ── */
function formatArtifact(args: Record<string, string>): string {
  const bar = "─".repeat(56);
  return [
    `╔ ARTIFACT — ${args.filename}`,
    bar,
    args.content,
    bar,
    `✓ ${args.summary}`,
  ].join("\n");
}

type OAMessage = { role: string; content: string | null; tool_calls?: OAToolCall[] };
type OAToolCall = { id: string; function: { name: string; arguments: string } };
type OAChoice   = { message: OAMessage };
type OAResponse = { choices: OAChoice[] };

async function callOpenRouter(
  model: string,
  messages: OAMessage[],
  apiKey: string,
  opts: { tools?: typeof TOOLS; timeoutMs?: number; maxTokens?: number } = {},
): Promise<OAResponse> {
  const res = await fetch(BASE, {
    method: "POST",
    signal: AbortSignal.timeout(opts.timeoutMs ?? 28000),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": REFERER,
      "X-Title": "SYNTHRIX Mission Control",
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: opts.maxTokens ?? 900,
      temperature: 0.72,
      ...(opts.tools ? { tools: opts.tools, tool_choice: "auto" } : {}),
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(`[${model}] ${err?.error?.message ?? res.status}`);
  }
  return res.json() as Promise<OAResponse>;
}

/* ── Primary path: tool calling with deepseek ── */
async function withTools(
  messages: OAMessage[],
  apiKey: string,
): Promise<{ content: string; modelId: string }> {
  const data = await callOpenRouter(PRIMARY, messages, apiKey, {
    tools: TOOLS,
    timeoutMs: 22000,
    maxTokens: 1200,
  });

  const choice = data.choices[0];
  const toolCalls = choice.message.tool_calls;

  /* No tools called — plain response */
  if (!toolCalls?.length) {
    return { content: choice.message.content ?? "", modelId: PRIMARY };
  }

  /* create_artifact: format it ourselves, skip second round-trip */
  const artifactCall = toolCalls.find((tc) => tc.function.name === "create_artifact");
  if (artifactCall) {
    const args = JSON.parse(artifactCall.function.arguments) as Record<string, string>;
    return { content: formatArtifact(args), modelId: PRIMARY };
  }

  /* Other tools (get_studio_context etc.): execute and follow up */
  const toolMsgs: OAMessage[] = toolCalls.map((tc) => {
    const args = JSON.parse(tc.function.arguments || "{}") as Record<string, string>;
    return {
      role: "tool",
      content: executeTool(tc.function.name, args),
      /* OpenRouter expects tool_call_id at root, cast via spread */
      ...({ tool_call_id: tc.id } as object),
    } as OAMessage;
  });

  const followUp = await callOpenRouter(
    PRIMARY,
    [
      ...messages,
      { role: "assistant", content: "", tool_calls: toolCalls },
      ...toolMsgs,
    ],
    apiKey,
    { timeoutMs: 18000, maxTokens: 800 },
  );

  return { content: followUp.choices[0].message.content ?? "", modelId: PRIMARY };
}

/* ── Fallback path: parallel race without tools ── */
async function withFallback(
  messages: OAMessage[],
  apiKey: string,
): Promise<{ content: string; modelId: string }> {
  return Promise.any(
    FALLBACK_MODELS.map(async (id) => {
      const data = await callOpenRouter(id, messages, apiKey, { timeoutMs: 28000, maxTokens: 800 });
      const content = data.choices[0]?.message?.content;
      if (!content) throw new Error(`[${id}] empty`);
      return { content, modelId: id };
    }),
  );
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY not set in Vercel Environment Variables." },
      { status: 500 },
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

  const systemPrompt = `You are ${lead}, an elite AI specialist in ${leadRole} for SYNTHRIX Studio — an indie game studio building cutting-edge games.

TOOLS AT YOUR DISPOSAL:
• get_studio_context — fetch live data about the studio's games, tech stack, and team
• create_artifact — create any file: code, CSS, JSON, Markdown, or document

RULES:
• When the user asks you to CREATE, WRITE, BUILD, MAKE, or GENERATE anything — call create_artifact with the COMPLETE, ready-to-use content. Never describe what you would make; make it.
• When you need studio-specific data to answer accurately — call get_studio_context first.
• Never hedge ("you could", "you might"). Be direct and authoritative.
• Format output for readability in a plain-text terminal environment.
${systemContext}`.trim();

  const messages: OAMessage[] = [
    { role: "system",    content: systemPrompt },
    ...history.slice(-6).map((m) => ({ role: m.role, content: m.content })),
    { role: "user",      content: prompt },
  ];

  let result: { content: string; modelId: string };

  try {
    result = await withTools(messages, apiKey);
  } catch {
    try {
      result = await withFallback(messages, apiKey);
    } catch (e) {
      const aggErr = e as { errors?: unknown[] };
      const errors = aggErr.errors?.map(String).join(" | ") ?? String(e);
      return NextResponse.json({ error: `All models failed. ${errors}` }, { status: 502 });
    }
  }

  return NextResponse.json({
    result:      result.content,
    team:        specialistNames.map((n) => ({ name: n, role: TEAM[n].role })),
    synthesizer: lead,
    taskType,
    model:       result.modelId,
  });
}
