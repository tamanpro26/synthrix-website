"use client";
import { useEffect, useRef } from "react";
import type { Tab } from "@/app/page";

const TICKER_ITEMS = ["ESCAPE THE BRIDGE","BOOM","OVERDRIVE","SYNTHPAD 2.0","RHINO'S LAST PROTOCOL","MADE IN BANGLADESH","INDIE STUDIO","EST. 2025"];

export default function HomeView({ onSwitch }: { onSwitch: (t: Tab) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* Particle embers canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = 0, H = 0, raf = 0;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const COLORS = ["rgba(245,166,35,","rgba(255,107,53,","rgba(0,201,184,","rgba(255,213,128,"];
    type P = { x:number; y:number; size:number; speedY:number; speedX:number; life:number; maxLife:number; color:string; wobble:number; wobbleSpeed:number; reset():void; };
    const particles: P[] = [];
    for (let i = 0; i < 45; i++) {
      const p = {} as P;
      p.reset = () => {
        p.x = Math.random() * W; p.y = H + 10;
        p.size = Math.random() * 2.5 + 0.5;
        p.speedY = -(Math.random() * 1.2 + 0.4); p.speedX = (Math.random() - 0.5) * 0.6;
        p.life = 0; p.maxLife = Math.random() * 180 + 80;
        p.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        p.wobble = Math.random() * Math.PI * 2; p.wobbleSpeed = (Math.random() - 0.5) * 0.06;
      };
      p.reset(); p.y = Math.random() * (H || 600); p.life = Math.random() * p.maxLife;
      particles.push(p);
    }
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.life++; if (p.life > p.maxLife) p.reset();
        p.wobble += p.wobbleSpeed; p.x += p.speedX + Math.sin(p.wobble) * 0.4; p.y += p.speedY;
        const a = Math.sin((p.life / p.maxLife) * Math.PI) * 0.75;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + a + ")"; ctx.fill();
        if (p.size > 1.2) {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color + (a * 0.15) + ")"; ctx.fill();
        }
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);

  /* Skill bars */
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) (e.target as HTMLElement).style.width = (e.target as HTMLElement).dataset.w || "0%";
      });
    }, { threshold: 0.3 });
    document.querySelectorAll(".skill-fill").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div>
      {/* ── HERO ── */}
      <div className="hero">
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", width: "100%", height: "100%" }} />

        <div className="hero-bg-mosaic" aria-hidden="true">
          {[
            "https://img.itch.zone/aW1nLzIyOTExMzU0LnBuZw==/347x500/EotLYN.png",
            "https://img.itch.zone/aW1nLzIzNTU4NjkyLnBuZw==/347x500/ggCuYf.png",
            "https://img.itch.zone/aW1nLzIzNDYxNTI3LmpwZw==/original/NLTnuO.jpg",
            "https://img.itch.zone/aW1hZ2UvNDQwMjE5MC8yNjI0NjA1MS5wbmc=/794x1000/wMU1zn.png",
          ].map((src, i) => (
            <div key={i} className="hbm-col">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="eager" />
            </div>
          ))}
        </div>
        <div className="hero-bg-tint" />
        <div className="hero-flare" />
        <div className="hero-teal-orb" />
        <div className="hero-scan" />
        <div className="hero-horizon" />

        <div className="hero-content">
          <div className="hero-eyebrow">BANGLADESHI INDIE STUDIO &nbsp;·&nbsp; EST. 2025</div>
          <h1 className="glitch" style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(58px,9vw,112px)", fontWeight: 900, letterSpacing: "5px", lineHeight: ".88", opacity: 0, animation: "slidein .9s .5s forwards" }}>
            <span className="h1-main">SYNTH<span className="h1-boxed">RIX</span></span>
            <span className="h1-sub">STUDIO</span>
          </h1>
          <p className="hero-tagline">UNLOCKING THE <em>NEXT LEVEL</em> OF GAMING</p>
          <div className="hero-divider" />
          <p className="hero-desc">Independent game development from Bangladesh — crafting immersive worlds, relentless combat, and stories worth playing.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => onSwitch("games")}>⬡ ENTER THE PROTOCOL</button>
            <button className="btn-secondary" onClick={() => onSwitch("lore")}>◆ DISCOVER THE WORLD</button>
          </div>
        </div>

        {/* HUD */}
        <div className="hero-hud" aria-hidden="true">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px", paddingBottom: "14px", borderBottom: "1px solid rgba(245,166,35,0.18)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "3px", color: "var(--teal)", textShadow: "0 0 10px rgba(0,201,184,0.60)" }}>// MISSION CONTROL</span>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 10px #22c55e", animation: "pulse 2s ease-in-out infinite" }} />
          </div>
          {([["STUDIO STATUS","OPERATIONAL","green"],["ACTIVE PROJECT","RLP-2026",""],["LOCATION","BANGLADESH",""],["PROJECTS SHIPPED","5+","green"]] as [string,string,string][]).map(([label, val, cls]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "11px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "rgba(255,255,255,0.38)", flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "2px", textAlign: "right", color: cls === "green" ? "#22c55e" : "rgba(255,255,255,0.78)", textShadow: cls === "green" ? "0 0 8px rgba(34,197,94,0.60)" : "none" }}>{val}</span>
            </div>
          ))}
          <div style={{ height: "1px", background: "rgba(245,166,35,0.14)", margin: "14px 0" }} />
          <div style={{ display: "flex", alignItems: "center", marginBottom: "11px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "rgba(255,255,255,0.38)", flexShrink: 0 }}>PROGRESS</span>
            <div style={{ flex: 1, height: "3px", background: "rgba(255,255,255,0.10)", borderRadius: "2px", overflow: "hidden", margin: "0 10px" }}>
              <div style={{ height: "100%", width: "42%", background: "linear-gradient(90deg,var(--teal),var(--gold))" }} />
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "2px", color: "var(--gold)" }}>42%</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "rgba(255,255,255,0.38)" }}>SIGNAL</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "2px", color: "#22c55e", textShadow: "0 0 8px rgba(34,197,94,0.60)" }}>STRONG</span>
          </div>
          <div className="hud-scan" />
        </div>

        <div className="hero-stats">
          {[["5+","PROJECTS"],["2025","FOUNDED"],["01","FLAGSHIP"]].map(([num, lbl]) => (
            <div key={lbl} className="hero-stat"><div className="num">{num}</div><div className="lbl">{lbl}</div></div>
          ))}
        </div>

        <div className="hero-reticle" aria-hidden="true">
          <div className="ret-ring r1" /><div className="ret-ring r2" />
          <div className="ret-corner tl" /><div className="ret-corner tr" />
          <div className="ret-corner bl" /><div className="ret-corner br" />
          <div className="ret-ch h" /><div className="ret-ch v" />
          <div className="ret-dot" />
          <div className="ret-label">SYN-001 · TARGET LOCKED</div>
        </div>
        <div className="scroll-hint">SCROLL</div>
      </div>

      {/* ── TICKER ── */}
      <div className="ticker-wrap" aria-hidden="true">
        <div className="ticker-inner">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <div key={i} className="ticker-item">
              <span className="t-accent">✦</span> {t} <span className="ticker-dot" />
            </div>
          ))}
        </div>
      </div>

      {/* ── PROOF STRIP ── */}
      <div className="proof-strip">
        {[["5+","GAMES SHIPPED"],["2025","YEAR FOUNDED"],["01","FLAGSHIP IN DEV"],["BD","MADE IN BANGLADESH"]].map(([num, lbl]) => (
          <div key={lbl} className="proof-item reveal">
            <div className="proof-num">{num}</div>
            <div className="proof-divider" />
            <div className="proof-label">{lbl}</div>
          </div>
        ))}
      </div>

      {/* ── ABOUT ── */}
      <section className="section-base" id="about" style={{ position: "relative" }}>
        <div style={{ position: "absolute", top: "40px", right: "100px", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "4px", color: "rgba(245,166,35,0.25)", pointerEvents: "none" }}>
          // 01 — ABOUT
        </div>
        <div className="section-header reveal">
          <div className="section-label">ABOUT THE STUDIO</div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div className="section-num">01</div>
            <h2>ABOUT SYNTHRIX</h2>
          </div>
        </div>
        <div className="about-inner">
          <div className="about-text reveal-left">
            <p><strong>SYNTHRIX Studio</strong> is an independent game development studio based in Bangladesh. We craft immersive worlds, emotionally resonant stories, and gameplay experiences built for the gamers of tomorrow.</p>
            <p>From action-packed shooters to survival horror — every project is defined by atmosphere, tight mechanics, and a relentless commitment to quality.</p>
            <div className="about-quote"><p>Your Next Adventure Starts Here — with SYNTHRIX.</p></div>
          </div>
          <div className="reveal-right">
            <div className="about-box">
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "3px", color: "var(--teal-deep)", marginBottom: "12px" }}>// FOUNDER &amp; LEAD DEVELOPER</div>
              <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "26px", fontWeight: 700, letterSpacing: "3px", color: "var(--ink)" }}>SUVOM KUNDU</div>
              <div style={{ color: "var(--ink-soft)", fontSize: "15px", letterSpacing: "2px", marginTop: "4px" }}>Game Designer · Developer · Storyteller</div>
              <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid rgba(245,166,35,0.22)", fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--ink-muted)", letterSpacing: "2px" }}>
                FOUNDED <span style={{ color: "var(--orange)" }}>2025</span> · BANGLADESH · INDIE STUDIO
              </div>
              <div style={{ marginTop: "28px" }}>
                {([["GAME DESIGN","90%"],["LEVEL DESIGN","80%"],["PROGRAMMING","75%"],["STORYTELLING","95%"]] as [string,string][]).map(([label, pct]) => (
                  <div key={label} style={{ marginBottom: "15px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", letterSpacing: "2px", color: "var(--ink-soft)", marginBottom: "6px" }}>
                      <span>{label}</span><span style={{ color: "var(--orange)" }}>{pct}</span>
                    </div>
                    <div style={{ height: "4px", background: "rgba(245,166,35,0.15)", borderRadius: "2px", overflow: "hidden" }}>
                      <div className="skill-fill" data-w={pct} style={{ height: "100%", width: "0", background: "linear-gradient(90deg,var(--teal),var(--gold),var(--orange))", borderRadius: "2px", transition: "width 1.5s cubic-bezier(.4,0,.2,1)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
