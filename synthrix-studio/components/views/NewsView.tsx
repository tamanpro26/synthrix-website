"use client";
import Image from "next/image";

export default function NewsView() {
  return (
    <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-4" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "5px", color: "var(--orange)", border: "1px solid rgba(255,107,53,0.32)" }}>
          // LATEST NEWS
        </div>
        <h2 className="reveal" style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, letterSpacing: "4px" }}>
          INTEL &amp; <span style={{ color: "var(--orange)" }}>UPDATES</span>
        </h2>
      </div>

      {/* Collaboration announcement */}
      <div className="reveal" style={{ background: "var(--bg2)", border: "1px solid var(--bordhi)", borderRadius: "3px", overflow: "hidden", position: "relative" }}>
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg,var(--orange),var(--gold),var(--teal))" }} />

        <div className="p-6 md:p-8">
          {/* Head */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--teal)" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "4px", color: "var(--teal)" }}>OFFICIAL ANNOUNCEMENT</span>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "var(--muted)" }}>16 MAY 2026 · STRATEGIC PARTNERSHIP</span>
          </div>

          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "3px", color: "var(--muted)", marginBottom: "8px" }}>// COLLABORATION ANNOUNCEMENT</div>
          <h3 className="mb-8" style={{ fontSize: "clamp(20px,3vw,32px)", fontWeight: 700, lineHeight: 1.3 }}>
            <em style={{ fontStyle: "normal", color: "var(--gold)" }}>DarkStarGames Studio</em> Announces<br />
            Strategic Collaboration with <em style={{ fontStyle: "normal", color: "var(--orange)" }}>SYNTHRIX Studios</em>
          </h3>

          {/* Studio logos */}
          <div className="flex items-center gap-6 mb-8 flex-wrap">
            <div className="flex flex-col items-center gap-2">
              <div className="h-14 flex items-center justify-center overflow-hidden">
                <Image src="https://www.darkstargames.org/web/image/586-10e83fa2/DarkStar%20TradeMark.webp" alt="DarkStarGames" width={120} height={56} className="object-contain" />
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", color: "var(--muted)" }}>DARKSTARGAMES STUDIO</span>
            </div>
            <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "24px", color: "var(--muted)" }}>×</div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-14 flex items-center justify-center px-4" style={{ border: "1px solid rgba(245,166,35,0.28)", background: "rgba(245,166,35,0.05)" }}>
                <span style={{ fontFamily: "var(--font-orbitron)", fontSize: "20px", fontWeight: 900, letterSpacing: "4px", color: "var(--gold)" }}>SYNTHRIX</span>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", color: "var(--muted)" }}>SYNTHRIX STUDIOS</span>
            </div>
          </div>

          {/* Body */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4" style={{ color: "var(--muted)", lineHeight: 1.8, fontSize: "14px" }}>
              <p>In a major move set to reshape the independent gaming landscape, <strong style={{ color: "var(--cream)" }}>SYNTHRIX Studios</strong> has officially announced a strategic collaboration with <strong style={{ color: "var(--cream)" }}>DarkStarGames Studio</strong>.</p>
              <p>The partnership combines creative talent, technical expertise, and operational resources for high-quality interactive entertainment across mobile, PC, and experimental gaming concepts.</p>
              <blockquote className="pl-4 italic" style={{ borderLeft: "3px solid var(--orange)", color: "var(--cream)", opacity: 0.8 }}>
                "This collaboration is an important milestone in our expansion journey."
                <cite className="block not-italic mt-2" style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "var(--muted)" }}>— SYNTHRIX Studios Spokesperson</cite>
              </blockquote>
            </div>
            <div className="space-y-4">
              <div className="p-4" style={{ background: "rgba(245,166,35,0.04)", border: "1px solid rgba(245,166,35,0.18)", borderRadius: "2px" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "3px", color: "var(--gold)", marginBottom: "10px" }}>// STRATEGIC GOALS</div>
                <div className="grid grid-cols-1 gap-2">
                  {["ADVANCED MOBILE GAME DEVELOPMENT","MULTIPLAYER & LIVE-SERVICE SYSTEMS","BRAND ECOSYSTEM GROWTH","CROSS-PLATFORM LAUNCHES","COMMUNITY EXPANSION","LONG-TERM PUBLISHING"].map(g => (
                    <div key={g} className="px-3 py-1.5 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "1px", background: "rgba(255,107,53,0.05)", border: "1px solid rgba(255,107,53,0.12)", color: "var(--muted)" }}>
                      {g}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "2px", color: "var(--muted)", background: "rgba(255,255,255,0.015)", borderTop: "1px solid var(--bord)" }}>
          16 MAY 2026 · OFFICIAL PARTNERSHIP ANNOUNCEMENT · SYNTHRIX STUDIOS · MORE ANNOUNCEMENTS EXPECTED SOON
        </div>
      </div>
    </section>
  );
}
