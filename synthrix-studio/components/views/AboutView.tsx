"use client";

const ROSTER = [
  { id:"MENTOR",  name:"SKYARK",       skill:"MENTOR · GUIDANCE & OVERSIGHT",           unit:"mentor",   status:"RECRUITED", rp:null,  badge:"SENIOR ADVISOR",     key:null },
  { id:"#101",    name:"LK PLAYZ",     skill:"GAME DEV · UNITY",                        unit:"syndicate",status:"RECRUITED", rp:null,  badge:null,                  key:null },
  { id:"#102",    name:"WILD",         skill:"WEB DEV · NEXT.JS / REACT",               unit:"protocol", status:"RECRUITED", rp:"30",  badge:null,                  key:"SOLE WEB DEVELOPER" },
  { id:"#103",    name:"HASAN-AYUB",   skill:"GAME DEV · UNITY",                        unit:"syndicate",status:"RECRUITED", rp:null,  badge:null,                  key:null },
  { id:"#104",    name:"SURVIVAL74",   skill:"3D MODELLING · ASSET CREATION",           unit:"frontier", status:"RECRUITED", rp:null,  badge:null,                  key:null },
  { id:"#105",    name:"PIYUSH",       skill:"GAME DEV · UNITY",                        unit:"syndicate",status:"RECRUITED", rp:null,  badge:null,                  key:null },
  { id:"#106",    name:"PRANKEY",      skill:"GAME DESIGNER · LEVEL DESIGN",            unit:"division", status:"RECRUITED", rp:null,  badge:null,                  key:"SOLE GAME DESIGNER" },
  { id:"#107",    name:"UNITYVERSE",   skill:"GAME DEV · UNITY",                        unit:"frontier", status:"RECRUITED", rp:null,  badge:null,                  key:null },
  { id:"#108",    name:"LAZY ZONE",    skill:"GAME DEV · UNITY",                        unit:"frontier", status:"RECRUITED", rp:null,  badge:null,                  key:null },
  { id:"#109",    name:"CHILL GUY",    skill:"GAME DEV · UNITY",                        unit:"syndicate",status:"RECRUITED", rp:null,  badge:null,                  key:null },
  { id:"#110",    name:"LIGHT",        skill:"GAME DEV · UNITY",                        unit:"protocol", status:"RECRUITED", rp:null,  badge:null,                  key:null },
  { id:"#111",    name:"SHADOWREN21",  skill:"GAME DEV · UNITY",                        unit:"axis",     status:"RECRUITED", rp:null,  badge:null,                  key:null },
  { id:"#112",    name:"IGNITEASCND",  skill:"GAME DEV · UNITY",                        unit:"protocol", status:"RECRUITED", rp:null,  badge:null,                  key:null },
  { id:"#113",    name:"JOTEEN1856",   skill:"GAME DEV · UNITY",                        unit:"axis",     status:"RECRUITED", rp:null,  badge:null,                  key:null },
  { id:"#114",    name:"PROSOON",      skill:"GAME DEV · UNITY",                        unit:"axis",     status:"RECRUITED", rp:null,  badge:null,                  key:null },
  { id:"#115",    name:"LEGENDHAPPYZ", skill:"GAME DEV · UNITY",                        unit:"axis",     status:"RECRUITED", rp:"2",   badge:null,                  key:null },
  { id:"#116",    name:"UI_DANIAL",    skill:"GAME DEV · UNITY",                        unit:"syndicate",status:"RECRUITED", rp:null,  badge:null,                  key:null },
];

const LEGEND = [
  { unit:"syndicate", color:"rgba(255,107,53,0.9)",  label:"VANGUARD SYNDICATE" },
  { unit:"protocol",  color:"rgba(0,201,184,0.9)",   label:"VANGUARD PROTOCOL" },
  { unit:"frontier",  color:"rgba(139,92,246,0.9)",  label:"VANGUARD FRONTIER" },
  { unit:"division",  color:"rgba(59,130,246,0.9)",  label:"VANGUARD DIVISION" },
  { unit:"axis",      color:"rgba(239,68,68,0.9)",   label:"VANGUARD AXIS" },
  { unit:"mentor",    color:"rgba(245,166,35,0.9)",  label:"MENTOR / ADVISOR" },
];

export default function AboutView({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div>
      {/* ABOUT SECTION */}
      <section id="about">
        <div className="sec-tag">FOUNDER PROFILE</div>
        <div className="about-grid">
          <div className="about-text reveal-left">
            <div className="about-lbl">// FOUNDER &amp; LEAD DEVELOPER</div>
            <div className="about-name">SUVOM KUNDU</div>
            <div className="about-role">GAME DEVELOPER &nbsp;&middot;&nbsp; DESIGNER &nbsp;&middot;&nbsp; STORYTELLER</div>
            <p><strong>Suvom</strong> is a young, passionate game developer from <em>Bangladesh</em> with big dreams and unstoppable determination. Currently in Class 9, he balances his studies with a deep love for gaming and creating worlds of his own.</p>
            <p>Drawing inspiration from <strong>ARK: Survival Evolved, Warframe, Minecraft,</strong> and <strong>Assassin&apos;s Creed</strong>, he experiments with <em>Unity</em> and <em>Unreal Engine</em> — building everything from shooters and open-world city games to horror adventures.</p>
            <p>Despite often working solo, Suvom has also joined <strong>ObscureCore Studio</strong> to gain collaboration experience. His ultimate dream: a sci-fi universe where his best friend <strong>Synth (AI)</strong> controls starships and shapes the cosmos.</p>
            <div className="about-quote">&ldquo;NEVER QUITTING. ALWAYS LEARNING.<br />SILENTLY PREPARING FOR THE RIGHT TIME.&rdquo;</div>
          </div>
          <div className="about-right reveal-right">
            <div className="a-panel">
              <div className="ap-lbl">// CURRENT BUILD</div>
              <div className="ap-val">BUILDING &middot; <span>RHINO&apos;S LAST PROTOCOL</span></div>
            </div>
            <div className="a-panel">
              <div className="ap-lbl">// ENGINES</div>
              <div className="ap-val">UNITY &middot; <span>UNREAL ENGINE</span></div>
            </div>
            <div className="a-panel">
              <div className="ap-lbl">// AFFILIATIONS</div>
              <div className="ap-val">SYNTHRIX &middot; <span>OBSCURECORE STUDIO</span></div>
            </div>
            <div className="a-panel">
              <div className="ap-lbl">// INSPIRED BY</div>
              <div className="ins-wrap">
                {["ARK: SURVIVAL EVOLVED","WARFRAME","MINECRAFT","ASSASSIN'S CREED","SCI-FI UNIVERSE"].map((t) => (
                  <span key={t} className="ins-tag">{t}</span>
                ))}
              </div>
            </div>
            <div className="a-panel">
              <div className="ap-lbl">// VISION</div>
              <div className="ap-val" style={{ fontSize:"12px",lineHeight:"1.85",color:"rgba(237,232,223,0.50)" }}>Game Developer + Scientist · Shaping the future of technology and entertainment.</div>
            </div>
          </div>
        </div>

        {/* TEAM ROSTER */}
        <div className="roster-section reveal">
          <div className="sec-tag">VANGUARD NETWORK</div>
          <h2 className="sec-h2">TEAM <span style={{ color:"var(--orange)" }}>ROSTER</span></h2>
          <div className="roster-grid">
            {ROSTER.map((m) => (
              <div key={m.id} className={`r-unit-${m.unit}`}>
                <div className="r-card reveal">
                  {m.rp && <div className="r-rp">★ {m.rp} RP</div>}
                  <div className="r-head">
                    <span className="r-id">{m.id}</span>
                    <span className="r-status"><span className="r-status-dot" />{m.status}</span>
                  </div>
                  <div className="r-name">{m.name}</div>
                  <div className="r-skill">{m.skill}</div>
                  <div className="r-unit-tag">{m.badge || LEGEND.find(l=>l.unit===m.unit)?.label}</div>
                  {m.key && <div className="r-key-badge">{m.key}</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="roster-legend">
            {LEGEND.map((l) => (
              <div key={l.unit} className="rl-item">
                <div className="rl-dot" style={{ background: l.color }} />
                {l.label}
              </div>
            ))}
            <div className="rl-item" style={{ marginLeft:"auto" }}>
              <span style={{ color:"rgba(245,166,35,0.7)" }}>★</span>&nbsp;RESPECT POINTS
            </div>
          </div>
          <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"9px",letterSpacing:"3px",color:"rgba(237,232,223,0.22)",marginTop:"14px",textAlign:"right" }}>
            17 MEMBERS &nbsp;&middot;&nbsp; VANGUARD NETWORK &nbsp;&middot;&nbsp; SYNTHRIX STUDIOS
          </div>
        </div>
      </section>
    </div>
  );
}
