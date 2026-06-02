import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const STORE = "internal_store";   // Redis hash — all panel localStorage keys
const ROSTER = "internal_roster"; // Redis hash — member id → member object

/* ── Types ──────────────────────────────────────────────────────────────── */
interface RosterMember {
  id: string; name: string; role: string; unit: string;
  rp: number; status: string; notes: string; joined: string;
}

/* ── Generic key-value store ────────────────────────────────────────────── */
async function handleStore(req: NextRequest, method: string): Promise<NextResponse> {
  if (method === "GET") {
    const key = req.nextUrl.searchParams.get("key");
    if (key) {
      const val = await kv.hget<unknown>(STORE, key);
      return val !== null && val !== undefined
        ? NextResponse.json(val)
        : NextResponse.json(null, { status: 404 });
    }
    const all = await kv.hgetall<Record<string, unknown>>(STORE);
    return NextResponse.json(all ?? {});
  }
  if (method === "POST") {
    const body = await req.json() as { key?: string; value?: unknown };
    if (!body.key) return NextResponse.json({ error: "key required" }, { status: 400 });
    await kv.hset(STORE, { [body.key]: body.value ?? null });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

/* ── Roster ─────────────────────────────────────────────────────────────── */
async function getAllMembers(): Promise<RosterMember[]> {
  const all = await kv.hgetall<Record<string, RosterMember>>(ROSTER);
  if (!all) return [];
  return Object.values(all).sort((a, b) => (b.rp ?? 0) - (a.rp ?? 0));
}

async function handleRoster(req: NextRequest, method: string, id?: string): Promise<NextResponse> {
  /* GET all members */
  if (method === "GET") return NextResponse.json(await getAllMembers());

  /* POST — add new member */
  if (method === "POST" && !id) {
    const data = await req.json() as Partial<RosterMember>;
    if (!data.name) return NextResponse.json({ error: "name required" }, { status: 400 });
    const mid   = Date.now().toString();
    const member: RosterMember = {
      id: mid, name: data.name, role: data.role ?? "", unit: data.unit ?? "",
      rp: 0, status: data.status ?? "active", notes: data.notes ?? "",
      joined: new Date().toISOString(),
    };
    await kv.hset(ROSTER, { [mid]: member });
    return NextResponse.json(member, { status: 201 });
  }

  /* PATCH — update member fields */
  if (method === "PATCH" && id) {
    const existing = await kv.hget<RosterMember>(ROSTER, id);
    if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
    const changes = await req.json() as Partial<RosterMember>;
    const updated = { ...existing, ...changes, id }; // id is immutable
    await kv.hset(ROSTER, { [id]: updated });
    return NextResponse.json({ ok: true });
  }

  /* DELETE — remove member */
  if (method === "DELETE" && id) {
    await kv.hdel(ROSTER, id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

/* ── Roster RP adjust ───────────────────────────────────────────────────── */
async function handleRP(req: NextRequest, id: string): Promise<NextResponse> {
  const existing = await kv.hget<RosterMember>(ROSTER, id);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  const { delta = 0 } = await req.json() as { delta?: number };
  const newRp = Math.max(0, (existing.rp ?? 0) + delta);
  await kv.hset(ROSTER, { [id]: { ...existing, rp: newRp } });
  return NextResponse.json({ rp: newRp });
}

/* ── Router ─────────────────────────────────────────────────────────────── */
type Ctx = { params: Promise<{ path: string[] }> };

async function route(req: NextRequest, ctx: Ctx): Promise<NextResponse> {
  const path = (await ctx.params).path;
  const [segment, id, sub] = path;

  try {
    if (segment === "ping")   return NextResponse.json({ ok: true, service: "Vercel KV" });
    if (segment === "store")  return handleStore(req, req.method);
    if (segment === "roster") {
      if (sub === "rp")       return handleRP(req, id);
      return handleRoster(req, req.method, id);
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (e) {
    console.error("[internal API]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export const GET    = (req: NextRequest, ctx: Ctx) => route(req, ctx);
export const POST   = (req: NextRequest, ctx: Ctx) => route(req, ctx);
export const PATCH  = (req: NextRequest, ctx: Ctx) => route(req, ctx);
export const DELETE = (req: NextRequest, ctx: Ctx) => route(req, ctx);
