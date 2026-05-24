"use client";
import { TEAM, UNIT_COLORS, type Unit } from "@/lib/team";

const UNIT_LABELS: Record<Unit, string> = {
  SYNDICATE: "VANGUARD SYNDICATE",
  PROTOCOL:  "VANGUARD PROTOCOL",
  FRONTIER:  "VANGUARD FRONTIER",
  DIVISION:  "VANGUARD DIVISION",
  AXIS:      "VANGUARD AXIS",
  MENTOR:    "SENIOR ADVISOR",
};

export default function AboutView() {
  return (
    <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-xs tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--orange)", border: "1px solid rgba(255,107,53,0.32)" }}>
          <span style={{ color: "rgba(255,107,53,0.4)" }}>//</span> THE TEAM
        </div>
        <h2 className="reveal" style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, letterSpacing: "4px" }}>
          MEET THE <span style={{ color: "var(--orange)" }}>CREW</span>
        </h2>
      </div>

      {/* Founder bio */}
      <div className="reveal mb-16 p-8" style={{ background: "var(--bg2)", border: "1px solid var(--bordhi)", borderRadius: "3px", position: "relative", overflow: "hidden" }}>
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg,var(--orange),var(--gold),transparent)" }} />
        <div className="mb-2" style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "5px", color: "var(--orange)" }}>// FOUNDER & DIRECTOR</div>
        <div className="mb-4" style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(20px,2.8vw,36px)", fontWeight: 900, letterSpacing: "3px", background: "linear-gradient(120deg,#fff,var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          SUVOM KUNDU
        </div>
        <p className="mb-3" style={{ color: "var(--muted)", lineHeight: 1.8, maxWidth: "700px" }}>
          <strong style={{ color: "var(--cream)" }}>Suvom</strong> is a young, passionate game developer from <em style={{ fontStyle: "normal", color: "var(--gold)" }}>Bangladesh</em> with big dreams and unstoppable determination. Currently in Class 9, he balances his studies with a deep love for gaming and creating worlds of his own.
        </p>
        <p style={{ color: "var(--muted)", lineHeight: 1.8, maxWidth: "700px" }}>
          Despite often working solo, Suvom has also joined <strong style={{ color: "var(--cream)" }}>ObscureCore Studio</strong> to gain collaboration experience. His ultimate dream: a sci-fi universe where his best friend <strong style={{ color: "var(--teal)" }}>Synth (AI)</strong> controls starships and shapes the cosmos.
        </p>
      </div>

      {/* Roster grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {TEAM.map((m) => {
          const color = UNIT_COLORS[m.unit];
          return (
            <div
              key={m.id}
              className="reveal p-4 relative overflow-hidden group"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid rgba(${hexToRgb(color)},0.25)`,
                borderRadius: "3px",
                transition: "border-color .3s, background .3s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `rgba(${hexToRgb(color)},0.60)`;
                (e.currentTarget as HTMLElement).style.background = `rgba(${hexToRgb(color)},0.05)`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `rgba(${hexToRgb(color)},0.25)`;
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg,${color},transparent)`, transform: "scaleX(0)", transformOrigin: "left", transition: "transform .4s" }} />
              {m.rp && (
                <div className="mb-1" style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", color: "var(--gold)" }}>★ {m.rp} RP</div>
              )}
              <div className="mb-1" style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", color: "var(--muted)" }}>
                {m.id}
              </div>
              <div className="mb-1" style={{ fontFamily: "var(--font-orbitron)", fontSize: "12px", fontWeight: 700, letterSpacing: "2px", color: "var(--cream)" }}>
                {m.name}
              </div>
              <div className="mb-2" style={{ fontSize: "10px", color: "var(--muted)", letterSpacing: "1px" }}>
                {m.skill}
              </div>
              <div className="px-2 py-0.5 inline-block" style={{ fontFamily: "var(--font-mono)", fontSize: "7px", letterSpacing: "2px", background: `rgba(${hexToRgb(color)},0.10)`, border: `1px solid rgba(${hexToRgb(color)},0.30)`, color }}>
                {UNIT_LABELS[m.unit]}
              </div>
              {m.badge && (
                <div className="mt-2 px-2 py-0.5 inline-block" style={{ fontFamily: "var(--font-mono)", fontSize: "7px", letterSpacing: "2px", background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.25)", color: "var(--gold)", display: "block" }}>
                  {m.badge}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-10 flex flex-wrap gap-5">
        {Object.entries(UNIT_LABELS).map(([unit, label]) => (
          <div key={unit} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: UNIT_COLORS[unit as Unit] }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", color: "var(--muted)" }}>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
