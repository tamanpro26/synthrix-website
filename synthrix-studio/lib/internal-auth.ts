import crypto from "crypto";

/* Server-side auth for the internal panel API.
   Security lives in INTERNAL_SECRET (server-only). The admin password
   hashes below are already public in the client bundle — duplicating
   them here leaks nothing new; they're only used to issue tokens. */

const SECRET       = process.env.INTERNAL_SECRET ?? "";
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const STATIC_HASHES: Record<string, string> = {
  suvom: "e4eb3a4797313b91b9b64bf843b10ec84c66d35ef7b1908f5f69560d8fc98146",
  taman: "73d4532c1929d708b10c924e0f0aff4ac60ea514987e8e93dcce3f1213a292ca",
};

export const authEnabled = () => SECRET.length > 0;

export function verifyCredentials(
  u: string,
  h: string,
  dynamic: { u: string; passHash: string }[],
): boolean {
  const user = u.trim().toLowerCase();
  if (STATIC_HASHES[user] && STATIC_HASHES[user] === h) return true;
  return dynamic.some((a) => a.u === user && a.passHash === h);
}

export function signToken(u: string): string {
  const payload = `${u}.${Date.now() + TOKEN_TTL_MS}`;
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64");
}

export function verifyToken(token: string | null): boolean {
  if (!token || !SECRET) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const lastDot = decoded.lastIndexOf(".");
    if (lastDot < 0) return false;
    const payload  = decoded.slice(0, lastDot);
    const sig      = decoded.slice(lastDot + 1);
    const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
    const expiry = Number(payload.split(".")[1]);
    return Number.isFinite(expiry) && Date.now() < expiry;
  } catch {
    return false;
  }
}

/* Bearer token from request header */
export function bearerFrom(req: Request): string | null {
  const h = req.headers.get("authorization") ?? "";
  return h.startsWith("Bearer ") ? h.slice(7) : null;
}

/* True if request may proceed: auth disabled (no secret yet) OR valid token */
export function isAuthed(req: Request): boolean {
  if (!authEnabled()) return true;
  return verifyToken(bearerFrom(req));
}
