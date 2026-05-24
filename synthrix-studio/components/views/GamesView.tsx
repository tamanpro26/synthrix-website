"use client";
import Image from "next/image";
import Link from "next/link";
import { GAMES } from "@/lib/games";

export default function GamesView() {
  return (
    <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-xs tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--orange)", border: "1px solid rgba(255,107,53,0.32)" }}>
          <span style={{ color: "rgba(255,107,53,0.4)" }}>//</span> GAME LIBRARY
        </div>
        <h2 className="reveal" style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, letterSpacing: "4px" }}>
          THE <span style={{ color: "var(--orange)" }}>VAULT</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {GAMES.map((g) => (
          <Link
            key={g.slug}
            href={`/games/${g.slug}`}
            className="group relative overflow-hidden reveal"
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--bord)",
              borderRadius: "3px",
              display: "block",
              minHeight: g.isFeatured ? "380px" : "320px",
              transition: "border-color .3s, box-shadow .3s",
              cursor: "none",
              textDecoration: "none",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,166,35,0.65)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 36px rgba(245,166,35,0.22), 0 8px 40px rgba(0,0,0,0.45)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--bord)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            {/* Image */}
            <div className="absolute inset-0 overflow-hidden">
              {g.image ? (
                <Image
                  src={g.image}
                  alt={g.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ filter: "grayscale(0.4) brightness(0.55) saturate(1.2)" }}
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--bg3)" }}>
                  <span style={{ fontFamily: "var(--font-orbitron)", fontSize: "40px", color: "rgba(245,166,35,0.2)" }}>▲</span>
                </div>
              )}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(7,7,7,0.95) 0%,rgba(7,7,7,0.3) 60%,transparent 100%)" }} />
            </div>

            {/* Tags */}
            <div className="absolute top-3 left-3 z-10 flex gap-2">
              {g.isComingSoon && (
                <span className="px-2 py-1 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "2px", background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.30)", color: "var(--gold)" }}>
                  IN DEVELOPMENT
                </span>
              )}
              {g.isFeatured && (
                <span className="px-2 py-1 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "2px", background: "rgba(255,107,53,0.12)", border: "1px solid rgba(255,107,53,0.30)", color: "var(--orange)" }}>
                  FEATURED
                </span>
              )}
            </div>

            {/* Bottom info (hover reveal) */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "3px", color: "var(--orange)", marginBottom: "4px" }}>
                {g.genre} · {g.engine}
              </div>
              <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "18px", fontWeight: 700, letterSpacing: "2px", color: "var(--cream)", marginBottom: "4px" }}>
                {g.title}
              </div>
              <p style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "12px" }}>{g.description}</p>
              <span className="inline-block px-4 py-2 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "2px", background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.40)", color: "var(--orange)" }}>
                {g.type === "tool" ? "↓ VIEW TOOL" : "▶ VIEW GAME"}
              </span>
            </div>

            {/* Name bar (non-hover) */}
            <div className="absolute bottom-0 left-0 right-0 z-10 px-5 py-3 group-hover:opacity-0 transition-opacity" style={{ background: "linear-gradient(to top,rgba(7,7,7,0.88),transparent)", fontFamily: "var(--font-orbitron)", fontSize: "10px", fontWeight: 700, letterSpacing: "3px", color: "rgba(255,255,255,0.62)" }}>
              {g.title.toUpperCase()}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
