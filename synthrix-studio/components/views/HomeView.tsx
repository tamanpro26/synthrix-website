"use client";
import { useEffect, useRef } from "react";
import type { Tab } from "@/app/page";

const STATS = [
  { to: 5,    from: 0,    suffix: "+", label: "GAMES SHIPPED" },
  { to: 2025, from: 2020, suffix: "",  label: "YEAR FOUNDED" },
  { to: 1,    from: 0,    prefix: "0", suffix: "", label: "FLAGSHIP IN DEV" },
  { fixed: "BD", label: "MADE IN BANGLADESH" },
] as const;

export default function HomeView({ active, onSwitch }: { active: boolean; onSwitch: (t: Tab) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statsRef  = useRef<HTMLDivElement>(null);
  const numRefs   = useRef<(HTMLDivElement | null)[]>([]);

  /* Particle canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = 0, H = 0, raf = 0;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const COLORS = ["rgba(245,166,35,","rgba(255,107,53,","rgba(0,201,184,"];
    type P = { x:number;y:number;size:number;speedY:number;speedX:number;life:number;maxLife:number;color:string;wobble:number;wobbleSpeed:number;reset():void };
    const particles: P[] = [];
    for (let i = 0; i < 40; i++) {
      const p = {} as P;
      p.reset = () => {
        p.x = Math.random()*W; p.y = H+10;
        p.size = Math.random()*2+0.4; p.speedY = -(Math.random()*1+0.3); p.speedX = (Math.random()-.5)*.5;
        p.life = 0; p.maxLife = Math.random()*160+80; p.color = COLORS[Math.floor(Math.random()*COLORS.length)];
        p.wobble = Math.random()*Math.PI*2; p.wobbleSpeed = (Math.random()-.5)*.05;
      };
      p.reset(); p.y = Math.random()*(H||600); p.life = Math.random()*p.maxLife;
      particles.push(p);
    }
    const loop = () => {
      ctx.clearRect(0,0,W,H);
      particles.forEach((p) => {
        p.life++; if (p.life>p.maxLife) p.reset();
        p.wobble+=p.wobbleSpeed; p.x+=p.speedX+Math.sin(p.wobble)*.35; p.y+=p.speedY;
        const a = Math.sin((p.life/p.maxLife)*Math.PI)*.65;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx.fillStyle=p.color+a+")"; ctx.fill();
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { window.removeEventListener("resize",resize); cancelAnimationFrame(raf); };
  }, []);

  /* Count-up animation for stats strip */
  useEffect(() => {
    if (!active) return;
    const strip = statsRef.current;
    if (!strip) return;
    let fired = false;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || fired) return;
      fired = true;
      STATS.forEach((stat, i) => {
        const el = numRefs.current[i];
        if (!el || "fixed" in stat) return;
        const { from, to, prefix = "", suffix = "" } = stat as { from:number; to:number; prefix?:string; suffix?:string };
        const dur = 1500;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + Math.round(from + (to - from) * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    obs.observe(strip);
    return () => obs.disconnect();
  }, [active]);

  if (!active) return null;

  return (
    <div>
      {/* HERO */}
      <section className="hero" id="home">
        <canvas ref={canvasRef} id="hero-canvas" />
        <div className="hero-glow" />
        <div className="hero-scan" />
        <div className="hero-rays" />

        {/* Gamepad controller rising animation */}
        <div className="hero-controller-wrap" aria-hidden="true">
          <svg className="ctrl-svg" viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 50 C20 50 10 75 15 100 L30 125 C36 135 50 138 60 130 L80 110 H140 L160 130 C170 138 184 135 190 125 L205 100 C210 75 200 50 180 50 L140 42 H80 Z" fill="rgba(245,166,35,0.08)" stroke="rgba(245,166,35,0.70)" strokeWidth="2"/>
            <path d="M40 50 C38 42 45 36 55 36 L80 36 L80 42" stroke="rgba(245,166,35,0.50)" strokeWidth="1.5" fill="none"/>
            <path d="M180 50 C182 42 175 36 165 36 L140 36 L140 42" stroke="rgba(245,166,35,0.50)" strokeWidth="1.5" fill="none"/>
            <rect x="52" y="68" width="8" height="24" rx="2" fill="rgba(245,166,35,0.30)" stroke="rgba(245,166,35,0.60)" strokeWidth="1"/>
            <rect x="44" y="76" width="24" height="8" rx="2" fill="rgba(245,166,35,0.30)" stroke="rgba(245,166,35,0.60)" strokeWidth="1"/>
            <circle cx="155" cy="72" r="6" fill="rgba(0,201,184,0.20)" stroke="rgba(0,201,184,0.80)" strokeWidth="1.5"/>
            <circle cx="171" cy="80" r="6" fill="rgba(255,107,53,0.20)" stroke="rgba(255,107,53,0.80)" strokeWidth="1.5"/>
            <circle cx="155" cy="88" r="6" fill="rgba(245,166,35,0.20)" stroke="rgba(245,166,35,0.80)" strokeWidth="1.5"/>
            <circle cx="139" cy="80" r="6" fill="rgba(139,92,246,0.20)" stroke="rgba(139,92,246,0.80)" strokeWidth="1.5"/>
            <circle cx="110" cy="78" r="10" fill="rgba(245,166,35,0.10)" stroke="rgba(245,166,35,0.55)" strokeWidth="1.5"/>
            <circle cx="110" cy="78" r="4" fill="rgba(245,166,35,0.40)"/>
            <circle cx="80" cy="95" r="12" fill="rgba(255,255,255,0.04)" stroke="rgba(245,166,35,0.35)" strokeWidth="1.5"/>
            <circle cx="80" cy="95" r="6" fill="rgba(245,166,35,0.15)"/>
            <circle cx="140" cy="95" r="12" fill="rgba(255,255,255,0.04)" stroke="rgba(245,166,35,0.35)" strokeWidth="1.5"/>
            <circle cx="140" cy="95" r="6" fill="rgba(245,166,35,0.15)"/>
            <circle cx="155" cy="72" r="2" fill="rgba(0,201,184,0.90)"/>
            <circle cx="171" cy="80" r="2" fill="rgba(255,107,53,0.90)"/>
            <circle cx="155" cy="88" r="2" fill="rgba(245,166,35,0.90)"/>
            <circle cx="139" cy="80" r="2" fill="rgba(139,92,246,0.90)"/>
          </svg>
        </div>

        {/* Side nav overlays */}
        <div className="hero-nav-left" aria-hidden="true">
          <a href="#home"      className="hn-link" onClick={(e)=>{e.preventDefault();onSwitch("home")}}>HOME</a>
          <a href="#about"     className="hn-link" onClick={(e)=>{e.preventDefault();onSwitch("about")}}>ABOUT</a>
          <a href="#games"     className="hn-link" onClick={(e)=>{e.preventDefault();onSwitch("games")}}>GAMES</a>
          <a href="#downloads" className="hn-link" onClick={(e)=>{e.preventDefault();onSwitch("downloads")}}>DOWNLOADS</a>
        </div>
        <div className="hero-nav-right" aria-hidden="true">
          <a href="#news"         className="hn-link" onClick={(e)=>{e.preventDefault();onSwitch("news")}}>NEWS</a>
          <a href="#blog"         className="hn-link" onClick={(e)=>{e.preventDefault();onSwitch("blog")}}>BLOG</a>
          <a href="#join"         className="hn-link" onClick={(e)=>{e.preventDefault();onSwitch("join")}}>JOIN TEAM</a>
          <a href="#achievements" className="hn-link" onClick={(e)=>{e.preventDefault();onSwitch("achievements")}}>ACHIEVEMENTS</a>
        </div>

        {/* Hero title */}
        <div className="hero-content">
          <div className="hero-eyebrow">BANGLADESHI INDIE STUDIO &nbsp;&middot;&nbsp; EST. 2025</div>
          <div className="hero-title-wrap">
            <span className="htn-line htn-synth">SYNTH</span>
            <span className="htn-line htn-rix">RIX</span>
            <span className="htn-line htn-studio">S &nbsp; T &nbsp; U &nbsp; D &nbsp; I &nbsp; O</span>
          </div>
          <div className="hero-line" />
          <p className="hero-sub">
            <strong>Born in Bangladesh.</strong> Building dark worlds,<br />
            relentless combat &amp; <em>stories worth playing.</em>
          </p>
          <div className="hero-btns">
            <a href="#games" className="btn-s solid" onClick={(e)=>{e.preventDefault();onSwitch("games")}}>⬡ EXPLORE GAMES</a>
            <a href="#join"  className="btn-s outline" onClick={(e)=>{e.preventDefault();onSwitch("join")}}>▶ JOIN THE TEAM</a>
          </div>
        </div>

        <div className="hero-scroll">↓ SCROLL ↓</div>
      </section>

      {/* STATS STRIP */}
      <div className="stats-strip" ref={statsRef}>
        {STATS.map((s, i) => (
          <div key={i} className="stat-item reveal">
            <div className="stat-num" ref={el => { numRefs.current[i] = el; }}>
              {"fixed" in s ? s.fixed : (("prefix" in s ? s.prefix : "") ?? "") + s.to + s.suffix}
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
