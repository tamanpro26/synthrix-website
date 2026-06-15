import Redis from "ioredis";

/* Singleton Redis client — reused across serverless invocations.
   Uses REDIS_URL (provided by the Vercel Redis / Upstash integration). */
declare global {
  // eslint-disable-next-line no-var
  var __redis: Redis | undefined;
}

function makeClient(): Redis | null {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  return new Redis(url, {
    maxRetriesPerRequest: 2,
    enableReadyCheck: false,
    lazyConnect: false,
    /* rediss:// connection strings enable TLS automatically */
  });
}

export function getRedis(): Redis | null {
  if (!global.__redis) {
    const client = makeClient();
    if (!client) return null;
    global.__redis = client;
  }
  return global.__redis;
}
