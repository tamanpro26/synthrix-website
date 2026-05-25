"use client";
import { useEffect } from "react";
import type { Tab } from "@/app/page";

const GAMES = [
  { title:"ESCAPE THE BRIDGE", genre:"ZOMBIE SURVIVAL · UNITY · FIRST PERSON", status:"LIVE",        color:"live", img:"https://img.itch.zone/aW1nLzIyOTExMzU0LnBuZw==/347x500/EotLYN.png",           href:"../games/escape-the-bridge/index.html", desc:"Zombie survival — survive the night, escape the bridge, face the undead." },
  { title:"BOOM",              genre:"FPS ACTION · UNITY · HORROR",            status:"LIVE",        color:"live", img:"https://img.itch.zone/aW1nLzIzNTU4NjkyLnBuZw==/347x500/ggCuYf.png",            href:"../games/boom/index.html",              desc:"Fast-paced action. Minimal design, maximum impact." },
  { title:"OVERDRIVE",         genre:"ARCADE SPEED · UNITY · ACTION",          status:"LIVE",        color:"live", img:"https://img.itch.zone/aW1nLzIzNDYxNTI3LmpwZw==/original/NLTnuO.jpg",           href:"../games/overdrive/index.html",         desc:"High-energy arcade built for speed. Push your reflexes to the limit." },
  { title:"SYNTHPAD 2.0",      genre:"DEV TOOL · NOTEPAD · PORTABLE",          status:"LIVE",        color:"live", img:"https://img.itch.zone/aW1hZ2UvNDQwMjE5MC8yNjI0NjA1MS5wbmc=/794x1000/wMU1zn.png", href:"../games/synthpad-2/index.html",        desc:"Lightweight dev notepad. Fast, distraction-free, low-end friendly." },
];

export default function GamesView({ active, onSwitch }: { active: boolean; onSwitch: (t: Tab) => void }) {
  /* Shutter-reveal for cards */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("on"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".gcard").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [active]);

  if (!active) return null;
  return (
    <div>
      <section id="games">
        <div className="sec-tag">GAME LIBRARY</div>
        <h2 className="sec-h2 reveal">DATABASE: <span style={{ color:"var(--orange)" }}>PROJECTS</span></h2>

        <div className="g-grid">
          {/* Featured: RLP */}
          <div className="gcard g-featured reveal">
            <div className="gc-inner">
              <div className="gc-ftag">FLAGSHIP &middot; IN DEVELOPMENT</div>
              <div className="gc-title">RHINO&apos;S LAST PROTOCOL</div>
              <p className="gc-desc">A Sci-Fi Action Shooter set in a crumbling dystopian future. High-octane combat, fluid movement mechanics, and a story about survival against impossible odds.</p>
              <div className="gc-st" style={{ position:"relative",top:"auto",left:"auto",display:"inline-flex",marginBottom:"20px" }}>
                <span className="sdot dev" /><span style={{ color:"var(--gold)" }}>IN DEVELOPMENT</span>
              </div>
              <a href="../index.html" className="gc-link">→ VIEW ON GAME LAB</a>
            </div>
            <div className="gc-img" style={{ background:"linear-gradient(135deg,#120800,#0a1a14,#1a0d00)" }}>
              <div style={{ position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(245,166,35,0.05) 28px,rgba(245,166,35,0.05) 29px),repeating-linear-gradient(90deg,transparent,transparent 28px,rgba(0,201,184,0.04) 28px,rgba(0,201,184,0.04) 29px)" }} />
              <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"160px",height:"160px",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(245,166,35,0.22) 0%,rgba(255,107,53,0.10) 45%,transparent 70%)" }} />
            </div>
          </div>

          {GAMES.map((g) => (
            <div key={g.title} className="gcard reveal">
              <a className="gc-arr" href={g.href} title="View Game">↗</a>
              <div className="gc-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.img} alt={g.title} loading="lazy" />
                <div className="gc-ov" />
                <div className="gc-st"><span className="sdot live" /><span style={{ color:"#22c55e" }}>LIVE</span></div>
                <div className="gc-namebar">{g.title}</div>
                <div className="gc-rev">
                  <div className="gc-rt">{g.title}</div>
                  <div className="gc-rd">{g.desc}</div>
                  <a className="gc-rb" href={g.href}>▶ VIEW GAME</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
