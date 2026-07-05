"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import dynamic from "next/dynamic";
import type { Tab } from "@/app/page";

const ThreeHero = dynamic(() => import("@/components/hero/ThreeHero"), { ssr: false });

const STATS = [
  { to: 5,    from: 0,    suffix: "+", label: "GAMES SHIPPED" },
  { to: 2025, from: 2020, suffix: "",  label: "YEAR FOUNDED" },
  { to: 1,    from: 0,    prefix: "0", suffix: "", label: "FLAGSHIP IN DEV" },
  { fixed: "BD", label: "MADE IN BANGLADESH" },
] as const;

const SECTIONS: {
  tab: Tab;
  label: string;
  sub: string;
  desc: string;
  icon: string;
  accent: string;
  bg: string;
}[] = [
  {
    tab: "games",
    label: "GAMES",
    sub: "EXPLORE OUR WORLDS",
    desc: "Dark combat, atmospheric horror and stories worth playing. See every title the team is crafting.",
    icon: "⬡",
    accent: "#FF6B35",
    bg: "linear-gradient(135deg,rgba(255,107,53,0.22) 0%,rgba(5,5,7,0) 100%)",
  },
  {
    tab: "about",
    label: "ABOUT",
    sub: "WHO WE ARE",
    desc: "Born in Bangladesh on pure passion. Learn our origin story, the people behind it, and where we're headed.",
    icon: "◼",
    accent: "#00C9B8",
    bg: "linear-gradient(135deg,rgba(0,201,184,0.18) 0%,rgba(5,5,7,0) 100%)",
  },
  {
    tab: "news",
    label: "NEWS",
    sub: "LATEST UPDATES",
    desc: "Announcements, milestones, and studio news — stay in the loop as Synthrix grows.",
    icon: "▶",
    accent: "#F5A623",
    bg: "linear-gradient(135deg,rgba(245,166,35,0.18) 0%,rgba(5,5,7,0) 100%)",
  },
  {
    tab: "downloads",
    label: "DOWNLOADS",
    sub: "GET THE BUILDS",
    desc: "Playable demos, beta clients, and special releases straight from our workshop.",
    icon: "↓",
    accent: "#8B5CF6",
    bg: "linear-gradient(135deg,rgba(139,92,246,0.20) 0%,rgba(5,5,7,0) 100%)",
  },
  {
    tab: "join",
    label: "JOIN TEAM",
    sub: "BUILD WITH US",
    desc: "Developers, artists, writers, composers — if you have the drive, there's a seat at the table.",
    icon: "★",
    accent: "#E83A0A",
    bg: "linear-gradient(135deg,rgba(232,58,10,0.20) 0%,rgba(5,5,7,0) 100%)",
  },
  {
    tab: "blog",
    label: "BLOG",
    sub: "DEV LOGS & POSTS",
    desc: "Behind the scenes: design decisions, technical deep-dives and candid updates from the team.",
    icon: "⬢",
    accent: "#FFD580",
    bg: "linear-gradient(135deg,rgba(255,213,128,0.15) 0%,rgba(5,5,7,0) 100%)",
  },
  {
    tab: "achievements",
    label: "ACHIEVEMENTS",
    sub: "HALL OF FAME",
    desc: "Unlock challenges, earn badges, and track your place in the Synthrix community.",
    icon: "◆",
    accent: "#F5A623",
    bg: "linear-gradient(135deg,rgba(245,166,35,0.18) 0%,rgba(5,5,7,0) 100%)",
  },
];

export default function HomeView({ active, onSwitch }: { active: boolean; onSwitch: (t: Tab) => void }) {
  const statsRef = useRef<HTMLDivElement>(null);
  const numRefs  = useRef<(HTMLDivElement | null)[]>([]);

  /* GSAP hero letter slam */
  useEffect(() => {
    if (!active) return;
    const tl = gsap.timeline({ delay: 0.85 });
    tl.set(".htn-synth",  { opacity: 1, y: 0 })
      .from(".htn-synth .hero-char", {
        y: 110, opacity: 0, duration: 0.72, stagger: 0.055, ease: "expo.out",
      }, "<")
      .set(".htn-rix",    { opacity: 1, y: 0 }, "-=0.48")
      .from(".htn-rix .hero-char", {
        y: 110, opacity: 0, duration: 0.72, stagger: 0.06, ease: "expo.out",
      }, "<");
    return () => { tl.kill(); };
  }, [active]);

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
        <ThreeHero />
        <div className="hero-glow" />
        <div className="hero-scan" />
        <div className="hero-rays" />

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
            <span className="htn-line htn-synth">
              {"SYNTH".split("").map((c, i) => <span key={i} className="hero-char">{c}</span>)}
            </span>
            <span className="htn-line htn-rix">
              {"RIX".split("").map((c, i) => <span key={i} className="hero-char">{c}</span>)}
            </span>
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

      {/* SECTION TEASERS */}
      <div className="sec-teasers">
        <div className="sec-teasers-header">
          <div className="sec-tag">NAVIGATE THE STUDIO</div>
          <h2 className="sec-h2 reveal">EXPLORE <span style={{ color: "var(--orange)" }}>EVERYTHING</span></h2>
        </div>
        <div className="sec-teasers-grid">
          {SECTIONS.map((s) => (
            <div
              key={s.tab}
              className="stc-card reveal"
              onClick={() => onSwitch(s.tab)}
              style={{ "--stc-accent": s.accent } as React.CSSProperties}
            >
              <div className="stc-header" style={{ background: s.bg }}>
                <div className="stc-icon">{s.icon}</div>
                <div className="stc-lbl">{s.label}</div>
              </div>
              <div className="stc-body">
                <div className="stc-sub">{s.sub}</div>
                <p className="stc-desc">{s.desc}</p>
                <div className="stc-cta">
                  EXPLORE <span style={{ color: s.accent }}>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
