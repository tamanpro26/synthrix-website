"use client";
import { useState, useEffect } from "react";

interface Post {
  id: string;
  title: string;
  category: string;
  content: string;
  author: string;
  date: string;
  status: "published" | "draft";
}

export default function BlogView() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selected, setSelected] = useState<Post | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("sx_posts");
    if (stored) setPosts(JSON.parse(stored));
  }, []);

  const published = posts.filter((p) => p.status === "published");

  if (selected) {
    return (
      <section className="py-20 px-6 md:px-12 max-w-3xl mx-auto">
        <button onClick={() => setSelected(null)} className="mb-8 flex items-center gap-2 text-xs cursor-none" style={{ fontFamily: "var(--font-mono)", letterSpacing: "3px", color: "var(--orange)" }}>
          ← BACK TO BLOG
        </button>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "4px", color: "var(--orange)", marginBottom: "8px" }}>{selected.category.toUpperCase()}</div>
        <h1 className="mb-4" style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(22px,4vw,40px)", fontWeight: 900, letterSpacing: "2px", color: "var(--cream)" }}>{selected.title}</h1>
        <div className="mb-8 flex gap-4" style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "var(--muted)" }}>
          <span>{selected.author}</span>
          <span>·</span>
          <span>{selected.date}</span>
        </div>
        <div className="prose prose-invert max-w-none" style={{ color: "var(--muted)", lineHeight: 1.9 }} dangerouslySetInnerHTML={{ __html: selected.content }} />
      </section>
    );
  }

  return (
    <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-4" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "5px", color: "var(--orange)", border: "1px solid rgba(255,107,53,0.32)" }}>
          // BLOG &amp; POSTS
        </div>
        <h2 className="reveal" style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, letterSpacing: "4px" }}>
          DISPATCH <span style={{ color: "var(--orange)" }}>LOG</span>
        </h2>
      </div>

      {published.length === 0 ? (
        <div className="py-24 text-center" style={{ border: "1px solid var(--bord)", background: "var(--bg2)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "4px", color: "var(--muted)" }}>NO POSTS PUBLISHED YET</div>
          <div style={{ fontSize: "12px", color: "rgba(237,232,223,0.2)", marginTop: "8px", fontFamily: "var(--font-mono)" }}>DISPATCHES INCOMING — STAY TUNED</div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {published.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="text-left group reveal cursor-none"
              style={{ background: "var(--bg2)", border: "1px solid var(--bord)", borderRadius: "2px", padding: "24px", transition: "border-color .3s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--bordhi)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--bord)")}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "3px", color: "var(--orange)", marginBottom: "8px" }}>{p.category.toUpperCase()}</div>
              <h3 className="mb-2" style={{ fontFamily: "var(--font-orbitron)", fontSize: "16px", fontWeight: 700, letterSpacing: "1px", color: "var(--cream)" }}>{p.title}</h3>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "var(--muted)" }}>{p.author} · {p.date}</div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
