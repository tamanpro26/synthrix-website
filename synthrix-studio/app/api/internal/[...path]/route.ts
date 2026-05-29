import { NextRequest, NextResponse } from "next/server";

const PYTHON          = process.env.PYTHON_AI_URL;
const INTERNAL_SECRET = process.env.INTERNAL_SECRET ?? "";

async function proxy(req: NextRequest, path: string[]): Promise<NextResponse> {
  if (!PYTHON) return NextResponse.json({ error: "Backend not configured" }, { status: 503 });

  const subpath = path.join("/");
  const qs      = req.nextUrl.search;
  const url     = `${PYTHON}/api/internal/${subpath}${qs}`;
  const body    = req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (INTERNAL_SECRET) headers["X-Internal-Key"] = INTERNAL_SECRET;

  const res = await fetch(url, {
    method: req.method,
    headers,
    body,
    signal: AbortSignal.timeout(8000),
  }).catch(() => null);

  if (!res) return NextResponse.json({ error: "Backend unreachable" }, { status: 503 });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
