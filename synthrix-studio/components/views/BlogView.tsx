"use client";
import { useEffect, useState } from "react";

interface Post {
  id: number; title: string; cat: string; thumb: string;
  content: string; status: string; author: string; date: string; createdAt: number;
}

const CAT_ICON: Record<string, string> = {
  News: "⬡", Update: "◼", Event: "▶", Release: "★",
  "Dev Log": "⬢", Announcement: "◆",
};

export default function BlogView({ active }: { active: boolean }) {
  const [posts, setPosts]   = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]     = useState<Post | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      let all: Post[] = [];
      /* 1) Try backend (shared across all devices) */
      try {
        const res = await fetch("/api/internal/store?key=sx_posts", { signal: AbortSignal.timeout(6000) });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) all = data as Post[];
        }
      } catch { /* fall through to localStorage */ }
      /* 2) Fallback to localStorage if backend empty/unreachable */
      if (all.length === 0) {
        try {
          const raw = localStorage.getItem("sx_posts");
          if (raw) all = JSON.parse(raw) as Post[];
        } catch { /* ignore */ }
      }
      if (cancelled) return;
      const published = all
        .filter((p) => p.status === "published")
        .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
      setPosts(published);
      setLoading(false);
    }
    if (active) load();
    return () => { cancelled = true; };
  }, [active]);

  if (!active) return null;

  return (
    <div>
      <section id="blog">
        <div className="sec-tag">STUDIO UPDATES</div>
        <h2 className="sec-h2 reveal">BLOG &amp; <span style={{ color: "var(--orange)" }}>POSTS</span></h2>

        {loading ? (
          <div className="blog-empty">◼ LOADING POSTS...</div>
        ) : posts.length === 0 ? (
          <div className="blog-empty">
            ◼ NO POSTS PUBLISHED YET<br />
            <span style={{ fontSize: "8px", letterSpacing: "2px" }}>CHECK BACK SOON — THE TEAM WILL POST UPDATES HERE</span>
          </div>
        ) : (
          <div className="blog-grid">
            {posts.map((p) => (
              <div key={p.id} className="blog-card reveal" onClick={() => setOpen(p)} style={{ cursor: "pointer" }}>
                {p.thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="blog-card-thumb" src={p.thumb} alt={p.title} loading="lazy"
                    style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                ) : (
                  <div className="blog-card-thumb-ph">{CAT_ICON[p.cat] ?? "⬡"}</div>
                )}
                <div className="blog-card-body">
                  <div className="blog-card-cat">{p.cat.toUpperCase()}</div>
                  <div className="blog-card-title">{p.title}</div>
                  <div className="blog-card-meta">SYNTHRIX STUDIO · {p.author} · {p.date}</div>
                  <div className="blog-card-excerpt">
                    {p.content.length > 140 ? p.content.slice(0, 140) + "…" : p.content}
                  </div>
                  <div style={{ marginTop: "12px", fontSize: "8px", letterSpacing: "2px", color: "var(--orange)" }}>
                    READ MORE →
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Article modal ── */}
      {open && (
        <div
          onClick={() => setOpen(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 9000, background: "rgba(5,5,5,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "720px", width: "100%", maxHeight: "86vh", overflowY: "auto",
              background: "#0b0b0d", border: "1px solid rgba(245,166,35,0.22)", borderRadius: "6px",
              padding: "0 0 32px",
            }}
          >
            {open.thumb && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={open.thumb} alt={open.title} style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "6px 6px 0 0" }} />
            )}
            <div style={{ padding: "28px 36px 0" }}>
              <div style={{ fontSize: "9px", letterSpacing: "3px", color: "var(--orange)", marginBottom: "10px" }}>
                {open.cat.toUpperCase()} · {open.date}
              </div>
              <h2 style={{ fontSize: "26px", lineHeight: 1.2, marginBottom: "8px", color: "var(--cream)" }}>{open.title}</h2>
              <div style={{ fontSize: "9px", letterSpacing: "2px", color: "var(--muted)", marginBottom: "22px" }}>
                BY {open.author} · SYNTHRIX STUDIO
              </div>
              <div style={{ fontSize: "14px", lineHeight: 1.9, color: "rgba(237,232,223,0.82)", whiteSpace: "pre-wrap" }}>
                {open.content}
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: "28px" }}>
              <button
                onClick={() => setOpen(null)}
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "3px",
                  padding: "10px 28px", background: "transparent", color: "var(--cream)",
                  border: "1px solid rgba(237,232,223,0.22)", cursor: "pointer",
                }}
              >
                ✕ CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
