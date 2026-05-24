"use client";
import type { Tab } from "@/app/page";

const MARQUEE_TEXT = ["Enter The Void", "New Release", "Bangladesh Indie", "Dark Worlds", "Relentless Combat", "Stories Worth Playing", "Rhino's Last Protocol", "SYNTHRIX Studio"];

export default function HomeView({ onSwitch }: { onSwitch: (t: Tab) => void }) {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{ minHeight: "100vh", background: "linear-gradient(135deg, var(--bg) 0%, var(--bg2) 60%, var(--bg3) 100%)" }}
      >
        {/* BG image overlay */}
        <div className="absolute inset-0 z-0"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1800')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.08 }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 z-1" style={{ background: "linear-gradient(to right, rgba(7,7,7,0.97) 40%, transparent 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 z-1" style={{ height: "40%", background: "linear-gradient(to top, var(--bg), transparent)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 w-full">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "6px", color: "var(--gold)" }}>
            <span className="w-9 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--gold))" }} />
            BANGLADESH INDIE · EST. 2025
            <span className="w-9 h-px" style={{ background: "linear-gradient(90deg, var(--gold), transparent)" }} />
          </div>

          {/* Main heading */}
          <h1 className="glitch" style={{ fontFamily: "var(--font-orbitron)", fontWeight: 900, lineHeight: 1.05 }}>
            <span style={{ display: "block", fontSize: "clamp(52px,9vw,130px)", background: "linear-gradient(135deg,#fff 0%,var(--glt) 50%,var(--gold) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 28px rgba(245,166,35,0.48))" }}>
              SYNTHRIX
            </span>
            <span style={{ display: "block", fontSize: "clamp(22px,4vw,68px)", background: "linear-gradient(135deg,var(--orange) 0%,var(--red) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "18px", marginTop: "6px", filter: "drop-shadow(0 0 28px rgba(232,58,10,0.55))" }}>
              STUDIO
            </span>
          </h1>

          <div className="my-8 w-18 h-px" style={{ background: "linear-gradient(90deg,transparent,var(--orange),transparent)", width: "72px", opacity: 0.8 }} />

          <p className="mb-10 max-w-xl" style={{ fontSize: "clamp(15px,2vw,18px)", color: "var(--muted)", lineHeight: 1.7 }}>
            An independent game studio from <strong style={{ color: "var(--gold)" }}>Bangladesh</strong> forging dark, atmospheric worlds. Our team of <em style={{ color: "var(--teal)", fontStyle: "normal" }}>20+ developers</em> is building tomorrow's indie classics.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onSwitch("games")}
              className="group relative overflow-hidden px-8 py-3 text-white font-bold"
              style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "3px", background: "linear-gradient(135deg,var(--orange),var(--red))", border: "1px solid transparent", boxShadow: "0 0 30px rgba(232,58,10,0.42)", cursor: "none" }}
            >
              ⬡ EXPLORE GAMES
            </button>
            <button
              onClick={() => onSwitch("about")}
              className="px-8 py-3"
              style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "3px", color: "var(--cream)", border: "1px solid rgba(245,166,35,0.35)", cursor: "none" }}
            >
              MEET THE TEAM →
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px" style={{ border: "1px solid var(--bord)", borderRadius: "2px" }}>
            {[
              { num: "5+",  label: "GAMES SHIPPED" },
              { num: "20+", label: "TEAM MEMBERS" },
              { num: "1",   label: "FLAGSHIP IN DEV" },
              { num: "2025",label: "FOUNDED" },
            ].map(({ num, label }) => (
              <div key={label} className="py-8 text-center" style={{ background: "rgba(255,255,255,0.015)", borderRight: "1px solid var(--bord)" }}>
                <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, background: "linear-gradient(135deg,#fff,var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{num}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "4px", color: "var(--muted)", marginTop: "6px" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden py-4" style={{ background: "var(--bg2)", borderTop: "1px solid var(--bord)", borderBottom: "1px solid var(--bord)" }}>
        <div className="marquee-track" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "4px", color: "var(--muted)" }}>
          {[...MARQUEE_TEXT, ...MARQUEE_TEXT].map((t, i) => (
            <span key={i} className="mx-6">{t}<span className="mx-3" style={{ color: "var(--orange)" }}>◆</span></span>
          ))}
        </div>
      </div>

      {/* Manifesto */}
      <section className="py-32 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <div className="reveal">
          <div className="inline-block mb-8 px-4 py-2 text-xs tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--orange)", border: "1px solid rgba(255,107,53,0.32)" }}>
            // THE DOCTRINE
          </div>
          <h2 className="mb-8" style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(28px,5vw,56px)", fontWeight: 900, letterSpacing: "4px", color: "var(--cream)" }}>
            WE BUILD WORLDS,<br />
            <span style={{ color: "var(--orange)" }}>NOT PRODUCTS.</span>
          </h2>
          <p style={{ fontSize: "18px", color: "var(--muted)", lineHeight: 1.9, maxWidth: "600px", margin: "0 auto" }}>
            Every game we make is a statement. We don't chase trends — we carve our own path through the noise with dark themes, tight mechanics, and stories that hit different when you're from a place the world overlooked.
          </p>
        </div>
      </section>
    </div>
  );
}
