"use client";
import type { Tab } from "@/app/page";

const GOOGLE_FORM = "https://docs.google.com/forms/d/e/1FAIpQLScbSpOStoarYPRmn27JRwymNxkTeTMCzcM3heHkUdPlLjep1A/viewform?usp=dialog";

const UNITS = [
  { ico:"💻", name:"CORE DEVELOPMENT UNIT",       sub:"TECHNICAL BACKBONE",               desc:"Handles engine architecture (Unity URP/HDRP), writes clean C# scripting, optimizes graphics workflows, and programs core gameplay mechanics." },
  { ico:"🎨", name:"DESIGN & CONCEPT UNIT",        sub:"ATMOSPHERE CREATORS",              desc:"Responsible for Game Design Documentation (GDD), level blockouts, environmental lighting setups, and scripting environmental storytelling." },
  { ico:"🛠️", name:"WEB & SYSTEMS UNIT",           sub:"VANGUARD CORE · DIGITAL INFRA",   desc:"Builds and optimizes official web portals, manages backend databases, deploys gamified user dashboards, and runs technical SEO." },
  { ico:"🚀", name:"VANGUARD SPECIALIST UNIT",     sub:"LAUNCHING JULY 2026 · EXPANSION",  desc:"Our frontline expansion wing. Focuses on rapid prototyping, mobile gaming market, and onboarding raw talent into professional pipelines." },
];

const ROLES = [
  { label:"PROGRAMMER",       desc:"Unity / Unreal Engine / C# / C++" },
  { label:"GAME ARTIST",      desc:"3D Modelling / Texturing / VFX" },
  { label:"GAME DESIGNER",    desc:"Level design / Systems / Balancing" },
  { label:"WRITER / NARRATIVE",desc:"Story / World-building / Dialogue" },
  { label:"COMPOSER / AUDIO", desc:"OST / SFX / Ambience" },
];

const PHIL = [
  { ico:"⚙️", title:"PRACTICAL EXECUTION OVER ROTE LEARNING",  text:"We value hands-on technical experimentation, logical problem-solving, and a strong personal creative vision above rigid textbooks." },
  { ico:"🎧", title:"IMMERSIVE AUDIO-VISUALS",                  text:"Every project features a tailored atmosphere where gritty custom sound design and atmospheric soundtracks are integrated tightly with the visuals." },
  { ico:"🤝", title:"TRUE CREATIVE INFLUENCE",                  text:"We operate in a highly collaborative ecosystem. Every developer has a direct voice in shaping our game worlds — no restrictive corporate hierarchy." },
];

export default function JoinView({ active, onSwitch: _onSwitch }: { active: boolean; onSwitch: (t: Tab) => void }) {
  if (!active) return null;
  return (
    <div>
      <section id="join">
        <div className="sec-tag">RECRUITMENT</div>
        <h2 className="sec-h2 reveal">JOIN THE <span style={{ color:"var(--orange)" }}>TEAM</span></h2>

        {/* How we work */}
        <div className="reveal">
          <div style={{ display:"inline-flex",alignItems:"center",gap:"8px",fontFamily:"'Share Tech Mono',monospace",fontSize:"10px",letterSpacing:"5px",color:"var(--orange)",border:"1px solid rgba(255,107,53,0.32)",padding:"5px 16px",borderRadius:"2px",marginBottom:"20px" }}>
            <span style={{ color:"rgba(255,107,53,0.40)" }}>//</span> HOW SYNTHRIX STUDIOS WORKS
          </div>
          <p className="hww-intro">
            Welcome to <strong>SYNTHRIX Studios</strong>. Founded in Bangladesh, we are an independent game development studio dedicated to building dark, gritty, atmospheric sci-fi worlds with relentless combat and deep, memorable narratives.<br /><br />
            We don&apos;t just follow industry trends — we build games with a <strong>distinct identity</strong>. Here is a breakdown of our ecosystem, operational framework, and how our specialized units collaborate to bring flagship titles like <strong>Rhino&apos;s Last Protocol</strong> to life.
          </p>

          <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"9px",letterSpacing:"5px",color:"rgba(245,166,35,0.50)",marginBottom:"16px" }}>// OUR OPERATIONAL STRUCTURE</div>
          <div className="hww-units">
            {UNITS.map((u) => (
              <div key={u.name} className="hww-unit">
                <div className="hww-unit-ico">{u.ico}</div>
                <div className="hww-unit-name">{u.name}</div>
                <div className="hww-unit-sub">{u.sub}</div>
                <div className="hww-unit-desc" dangerouslySetInnerHTML={{ __html:u.desc.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>") }} />
              </div>
            ))}
          </div>

          <div className="hww-philosophy">
            <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"9px",letterSpacing:"5px",color:"rgba(245,166,35,0.50)",marginBottom:"16px" }}>// OUR DEVELOPMENT PHILOSOPHY</div>
            <div className="hww-phil-grid">
              {PHIL.map((p) => (
                <div key={p.title} className="hww-phil-row">
                  <div className="hww-phil-ico">{p.ico}</div>
                  <div>
                    <div className="hww-phil-title">{p.title}</div>
                    <div className="hww-phil-text">{p.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontFamily:"'Orbitron',sans-serif",fontSize:"13px",fontWeight:700,letterSpacing:"3px",color:"rgba(237,232,223,0.45)",padding:"22px 26px",border:"1px solid rgba(245,166,35,0.18)",borderRadius:"3px",background:"rgba(245,166,35,0.04)",marginBottom:0,textAlign:"center" }}>
            Whether we are developing utility software like <span style={{ color:"var(--teal)" }}>SYNTHPAD</span> or high-octane shooters —<br />
            our goal remains unchanged: <span style={{ color:"var(--orange)" }}>To build something unforgettable.</span>
          </div>
        </div>

        <div className="hww-divider" />

        <div className="join-grid">
          <div className="reveal-left">
            <h3 className="join-h3">BUILD WORLDS WITH US</h3>
            <p className="join-p">SYNTHRIX is growing. We&apos;re looking for passionate creators who want to be part of something real — dark worlds, relentless gameplay, and stories that matter.</p>
            <p className="join-p">Whether you&apos;re a programmer, artist, designer, or writer — if you share the vision, there&apos;s a place for you here.</p>
            <div className="roles">
              {ROLES.map((r) => (
                <div key={r.label} className="role-row">
                  <div className="role-ico">▸</div>
                  <div>
                    <div className="role-nm">{r.label}</div>
                    <div className="role-ds">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-right">
            <div className="portal-wrap">
              <div className="portal-ring" />
              <div className="portal-ring" />
              <div className="portal-ring" />
              <div className="portal-header">// RECRUITMENT PORTAL</div>
              <a
                className="portal-btn"
                href={GOOGLE_FORM}
                target="_blank"
                rel="noopener"
                title="Apply to join SYNTHRIX Studio"
              >
                <div className="portal-spin" />
                <div className="portal-spin r2" />
                <div className="portal-core" />
                <div className="portal-icon">▶</div>
                <div className="portal-label">APPLY<br />NOW</div>
                <div className="portal-sub">ENTER THE VOID</div>
              </a>
              <div className="portal-warn">
                WARNING — YOU ARE ABOUT TO ENTER<br />
                <span>◼ THE SYNTHRIX RECRUITMENT DIMENSION ◼</span><br />
                THERE IS NO GOING BACK
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
