"use client";
import type { Tab } from "@/app/page";

const GAMES = [
  { id: "escape-the-bridge", title: "Escape the Bridge", genre: "ZOMBIE SURVIVAL", status: "LIVE", color: "green", desc: "Zombie survival — survive the night, escape the bridge, face the relentless undead.", img: "https://img.itch.zone/aW1nLzIyOTExMzU0LnBuZw==/347x500/EotLYN.png", href: "games/escape-the-bridge/index.html" },
  { id: "boom",              title: "BOOM",             genre: "FPS ACTION",     status: "LIVE", color: "green", desc: "Fast-paced action. Minimal design, maximum impact.",                           img: "https://img.itch.zone/aW1nLzIzNTU4NjkyLnBuZw==/347x500/ggCuYf.png",   href: "games/boom/index.html" },
  { id: "overdrive",         title: "OVERDRIVE",        genre: "ARCADE SPEED",   status: "LIVE", color: "green", desc: "High-energy arcade built for speed. Push your reflexes to the limit.",         img: "https://img.itch.zone/aW1nLzIzNDYxNTI3LmpwZw==/original/NLTnuO.jpg",   href: "games/overdrive/index.html" },
  { id: "synthpad",          title: "SYNTHPAD 2.0",     genre: "DEV TOOL",       status: "LIVE", color: "green", desc: "Lightweight notepad for game devs. Fast, distraction-free, low-end friendly.",  img: "https://img.itch.zone/aW1hZ2UvNDQwMjE5MC8yNjI0NjA1MS5wbmc=/794x1000/wMU1zn.png", href: "games/synthpad-2/index.html" },
];

export default function GamesView({ onSwitch }: { onSwitch: (t: Tab) => void }) {
  return (
    <div>
      <section className="section-base">
        <div className="section-header reveal">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <div className="section-label">GAME LIBRARY</div>
            <a href="synthrix-studio/index.html" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "2.5px", color: "rgba(0,201,184,0.65)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(0,201,184,0.25)", paddingBottom: "2px" }}>
              SYNTHRIX STUDIO SITE →
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <div className="section-num">02</div>
            <h2>DATABASE: PROJECTS</h2>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "3px", padding: "5px 12px", border: "1px solid rgba(245,166,35,0.35)", color: "var(--gold)", background: "rgba(245,166,35,0.07)", borderRadius: "2px" }}>05 TITLES</span>
          </div>
        </div>

        {/* Game grid */}
        <div className="games-grid">
          {/* Featured: RLP */}
          <div className="game-card featured reveal">
            <div className="card-glow" />
            <div className="card-cover" style={{ background: "linear-gradient(135deg,#120800 0%,#0a1a14 60%,#1a0d00 100%)" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(245,166,35,0.06) 28px,rgba(245,166,35,0.06) 29px),repeating-linear-gradient(90deg,transparent,transparent 28px,rgba(0,201,184,0.05) 28px,rgba(0,201,184,0.05) 29px)" }} />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(ellipse,rgba(245,166,35,0.22) 0%,rgba(255,107,53,0.10) 45%,transparent 70%)" }} />
              <div className="card-cover-overlay" />
              <div className="card-cover-status" style={{ color: "var(--gold)" }}><div className="status-dot amber" />IN DEVELOPMENT</div>
              <div className="card-cover-tag">FLAGSHIP</div>
            </div>
            <div className="game-card-inner">
              <div className="card-tag" style={{ marginBottom: "12px" }}>FLAGSHIP PROJECT</div>
              <h3>Rhino&apos;s Last Protocol</h3>
              <p>A Sci-Fi Action Shooter set in a crumbling dystopian future. Experience high-octane combat, fluid movement mechanics, and a story about survival against impossible odds.</p>
              <p style={{ color: "var(--ink-muted)", fontFamily: "var(--font-mono)", fontSize: "11px", marginTop: "16px", letterSpacing: "2px" }}>GENRE: SCI-FI · ACTION · SHOOTER</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "auto", paddingTop: "16px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "3px", color: "var(--ink-muted)" }}>
                <span>→</span> COMING SOON
              </div>
            </div>
          </div>

          {/* Game cards */}
          {GAMES.map((g) => (
            <div key={g.id} className="game-card reveal">
              <a className="card-arrow" href={g.href} title="View Game">↗</a>
              <div className="card-glow" />
              <div className="card-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.img} alt={g.title} loading="lazy" />
                <div className="card-cover-overlay" />
                <div className="card-cover-status" style={{ color: "#16a34a" }}><div className="status-dot green" />LIVE</div>
                <div className="card-name-bar">{g.title.toUpperCase()}</div>
                <div className="card-hover-reveal">
                  <div className="card-hover-title">{g.title.toUpperCase()}</div>
                  <div className="card-hover-desc">{g.desc}</div>
                  <a className="card-hover-cta dl" href={g.href}>⬇ DOWNLOAD</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GAME WALL ── */}
      <div className="game-wall" aria-label="Game library">
        {GAMES.map((g) => (
          <div key={g.id} className="gw-panel" tabIndex={0} role="link" onClick={() => location.href = g.href}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.img} alt={g.title} loading="lazy" />
            <div className="gw-overlay" />
            <div className="gw-info">
              <div className="gw-genre">{g.genre}</div>
              <div className="gw-name">{g.title.toUpperCase()}</div>
              <a className="gw-cta" href={g.href}>VIEW GAME →</a>
            </div>
          </div>
        ))}
        <div className="gw-panel rlp-panel" tabIndex={0}>
          <div className="rlp-grid" />
          <div className="rlp-rings"><div className="rlp-ring" /><div className="rlp-ring" /></div>
          <div className="rlp-core" />
          <div className="rlp-classified">// CLASSIFIED · IN DEVELOPMENT</div>
          <div className="gw-overlay" />
          <div className="gw-info">
            <div className="gw-genre">SCI-FI SHOOTER</div>
            <div className="gw-name">RHINO&apos;S LAST PROTOCOL</div>
            <span className="gw-cta" style={{ color: "var(--gold)", borderColor: "rgba(245,166,35,0.32)" }}>COMING SOON</span>
          </div>
        </div>
      </div>

      {/* ── STUDIO CTA ── */}
      <div style={{ background: "linear-gradient(160deg,#080300 0%,#0a1a14 55%,#080600 100%)", padding: "90px 100px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 36px,rgba(245,166,35,0.04) 36px,rgba(245,166,35,0.04) 37px),repeating-linear-gradient(90deg,transparent,transparent 36px,rgba(0,201,184,0.03) 36px,rgba(0,201,184,0.03) 37px)", pointerEvents: "none" }} />
        <div className="reveal" style={{ position: "relative", zIndex: 4 }}>
          <div className="section-label light" style={{ margin: "0 auto 18px" }}>EXPLORE THE UNIVERSE</div>
          <h2 style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(28px,4.5vw,56px)", fontWeight: 900, letterSpacing: "4px", lineHeight: "1.1", color: "#fff" }}>
            Enter The<br />
            <span style={{ display: "inline-block", border: "2px solid rgba(245,166,35,0.65)", padding: "2px 16px", borderRadius: "3px", background: "rgba(245,166,35,0.09)", color: "var(--gold)" }}>SYNTHRIX</span> World
          </h2>
          <p style={{ marginTop: "18px", fontSize: "17px", color: "rgba(255,255,255,0.42)", letterSpacing: "1px", maxWidth: "520px", lineHeight: "1.75", margin: "18px auto 0" }}>
            Five games shipped. One flagship in development.<br />A studio built on passion, built in Bangladesh.
          </p>
          <button className="btn-primary" style={{ marginTop: "36px", display: "inline-flex" }} onClick={() => onSwitch("lore")}>
            ⬡ DISCOVER THE LORE
          </button>
        </div>
      </div>
    </div>
  );
}
