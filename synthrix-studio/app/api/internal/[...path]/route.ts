import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { isAuthed, verifyCredentials, signToken, authEnabled } from "@/lib/internal-auth";

export const runtime = "nodejs";

const STORE  = "internal_store";   // Redis hash — all panel localStorage keys
const ROSTER = "internal_roster";  // Redis hash — member id → member object

/* Keys the public site is allowed to read without a token */
const PUBLIC_READ_KEYS = new Set([
  "sx_posts", "sx_announcements", "sx_custom_games",
  "sx_custom_achievements", "sx_pages", "sx_nav_items", "sx_theme",
]);

const UNAUTH = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });

/* ── Types ──────────────────────────────────────────────────────────────── */
interface RosterMember {
  id: string; name: string; role: string; unit: string;
  rp: number; status: string; notes: string; joined: string;
}

/* ── JSON helpers (ioredis stores strings) ──────────────────────────────── */
function parse<T>(raw: string | null): T | null {
  if (raw === null) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

/* ── Generic key-value store ────────────────────────────────────────────── */
async function handleStore(req: NextRequest, method: string): Promise<NextResponse> {
  const redis = getRedis();
  if (!redis) return NextResponse.json({ error: "Redis not configured" }, { status: 503 });

  if (method === "GET") {
    const key = req.nextUrl.searchParams.get("key");
    if (key) {
      /* Public keys are open; everything else needs a token */
      if (!PUBLIC_READ_KEYS.has(key) && !isAuthed(req)) return UNAUTH();
      const val = await redis.hget(STORE, key);
      return val !== null
        ? NextResponse.json(parse(val))
        : NextResponse.json(null, { status: 404 });
    }
    /* Full dump (admin sync) is always protected */
    if (!isAuthed(req)) return UNAUTH();
    const all = await redis.hgetall(STORE);
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(all)) out[k] = parse(v);
    return NextResponse.json(out);
  }

  if (method === "POST") {
    if (!isAuthed(req)) return UNAUTH();
    const body = await req.json() as { key?: string; value?: unknown };
    if (!body.key) return NextResponse.json({ error: "key required" }, { status: 400 });
    await redis.hset(STORE, body.key, JSON.stringify(body.value ?? null));
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

/* ── Roster ─────────────────────────────────────────────────────────────── */
async function getAllMembers(): Promise<RosterMember[]> {
  const redis = getRedis();
  if (!redis) return [];
  const all = await redis.hgetall(ROSTER);
  return Object.values(all)
    .map((v) => parse<RosterMember>(v))
    .filter((m): m is RosterMember => m !== null)
    .sort((a, b) => (b.rp ?? 0) - (a.rp ?? 0));
}

async function handleRoster(req: NextRequest, method: string, id?: string): Promise<NextResponse> {
  const redis = getRedis();
  if (!redis) return NextResponse.json({ error: "Redis not configured" }, { status: 503 });
  if (!isAuthed(req)) return UNAUTH();

  if (method === "GET") return NextResponse.json(await getAllMembers());

  if (method === "POST" && !id) {
    const data = await req.json() as Partial<RosterMember>;
    if (!data.name) return NextResponse.json({ error: "name required" }, { status: 400 });
    const mid = Date.now().toString();
    const member: RosterMember = {
      id: mid, name: data.name, role: data.role ?? "", unit: data.unit ?? "",
      rp: 0, status: data.status ?? "active", notes: data.notes ?? "",
      joined: new Date().toISOString(),
    };
    await redis.hset(ROSTER, mid, JSON.stringify(member));
    return NextResponse.json(member, { status: 201 });
  }

  if (method === "PATCH" && id) {
    const existing = parse<RosterMember>(await redis.hget(ROSTER, id));
    if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
    const changes = await req.json() as Partial<RosterMember>;
    const updated = { ...existing, ...changes, id };
    await redis.hset(ROSTER, id, JSON.stringify(updated));
    return NextResponse.json({ ok: true });
  }

  if (method === "DELETE" && id) {
    await redis.hdel(ROSTER, id);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

async function handleRP(req: NextRequest, id: string): Promise<NextResponse> {
  const redis = getRedis();
  if (!redis) return NextResponse.json({ error: "Redis not configured" }, { status: 503 });
  if (!isAuthed(req)) return UNAUTH();
  const existing = parse<RosterMember>(await redis.hget(ROSTER, id));
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  const { delta = 0 } = await req.json() as { delta?: number };
  const newRp = Math.max(0, (existing.rp ?? 0) + delta);
  await redis.hset(ROSTER, id, JSON.stringify({ ...existing, rp: newRp }));
  return NextResponse.json({ rp: newRp });
}

/* ── Router ─────────────────────────────────────────────────────────────── */
type Ctx = { params: Promise<{ path: string[] }> };

/* POST /api/internal/auth — validate credentials, issue a write token */
async function handleAuth(req: NextRequest): Promise<NextResponse> {
  const { u, h } = await req.json() as { u?: string; h?: string };
  if (!u || !h) return NextResponse.json({ error: "missing credentials" }, { status: 400 });

  let dynamic: { u: string; passHash: string }[] = [];
  const redis = getRedis();
  if (redis) {
    const raw = parse<{ u: string; passHash: string }[]>(await redis.hget(STORE, "sx_admin_accounts"));
    if (Array.isArray(raw)) dynamic = raw;
  }
  if (!verifyCredentials(u, h, dynamic)) return UNAUTH();
  return NextResponse.json({ token: signToken(u.trim().toLowerCase()) });
}

async function route(req: NextRequest, ctx: Ctx): Promise<NextResponse> {
  const path = (await ctx.params).path;
  const [segment, id, sub] = path;

  try {
    if (segment === "ping")   return NextResponse.json({ ok: true, service: "ioredis", hasUrl: !!process.env.REDIS_URL, authEnabled: authEnabled() });
    if (segment === "auth" && req.method === "POST") return handleAuth(req);
    if (segment === "store")  return handleStore(req, req.method);
    if (segment === "roster") {
      if (sub === "rp")       return handleRP(req, id);
      return handleRoster(req, req.method, id);
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (e) {
    console.error("[internal API]", e);
    return NextResponse.json({ error: "Internal error", detail: String(e) }, { status: 500 });
  }
}

export const GET    = (req: NextRequest, ctx: Ctx) => route(req, ctx);
export const POST   = (req: NextRequest, ctx: Ctx) => route(req, ctx);
export const PATCH  = (req: NextRequest, ctx: Ctx) => route(req, ctx);
export const DELETE = (req: NextRequest, ctx: Ctx) => route(req, ctx);
