"use client";

const DL = [
  { img:"https://img.itch.zone/aW1nLzIyOTExMzU0LnBuZw==/347x500/EotLYN.png",           name:"ESCAPE THE BRIDGE", desc:"ZOMBIE SURVIVAL · UNITY · FIRST PERSON", platform:"⊞ WINDOWS", size:"1,004 MB", href:"https://github.com/tamanpro26/synthrix-game-releases/releases/download/v1.0/ESCAPE-THE-BRIDGE-Zombie-Survival.exe", itch:false, coming:false },
  { img:"https://img.itch.zone/aW1nLzIzNTU4NjkyLnBuZw==/347x500/ggCuYf.png",            name:"BOOM",             desc:"FPS ACTION · UNITY · HORROR",           platform:"⊞ WINDOWS", size:"194 MB",    href:"https://synthrix-studio.itch.io/boom101",                                                                             itch:true,  coming:false },
  { img:"https://img.itch.zone/aW1nLzIzNDYxNTI3LmpwZw==/original/NLTnuO.jpg",           name:"OVERDRIVE",        desc:"ARCADE SPEED · UNITY · ACTION",         platform:"⊞ WINDOWS", size:"435 MB",    href:"https://github.com/tamanpro26/synthrix-game-releases/releases/download/v1.0/OVERDRIVE.zip",                           itch:false, coming:false },
  { img:"https://img.itch.zone/aW1hZ2UvNDQwMjE5MC8yNjI0NjA1MS5wbmc=/794x1000/wMU1zn.png", name:"SYNTHPAD 2.0",  desc:"DEV TOOL · NOTEPAD · PORTABLE",         platform:"⊞ WINDOWS", size:"36 MB",     href:"https://github.com/tamanpro26/synthrix-game-releases/releases/download/v1.0/SYNTHPAD-2.0.exe",                          itch:false, coming:false },
  { img:"https://img.itch.zone/aW1hZ2UvNDQwMjE5MC8yNjI0NjA1MS5wbmc=/794x1000/wMU1zn.png", name:"SYNTHPAD 2.1",  desc:"DEV TOOL · INSTALLER · UPDATED",        platform:"⊞ WINDOWS", size:"63 MB",     href:"https://github.com/tamanpro26/synthrix-game-releases/releases/download/v1.0/SYNTHPAD-2.1-Setup.exe",                    itch:false, coming:false },
  { img:null,                                                                               name:"RHINO'S LAST PROTOCOL", desc:"SCI-FI SHOOTER · UNREAL ENGINE · IN DEVELOPMENT", platform:"⊞ WINDOWS", size:"TBA", href:"#", itch:false, coming:true },
];

export default function DownloadsView({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div>
      <section id="downloads">
        <div className="sec-tag">FREE DOWNLOADS</div>
        <h2 className="sec-h2 reveal">GET THE <span style={{ color:"var(--orange)" }}>GAMES</span></h2>
        <div className="dl-table-wrap">
          {DL.map((d) => (
            <div key={d.name} className={`dl-row reveal${d.coming ? " dl-row-coming" : ""}`}>
              {d.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="dl-thumb" src={d.img} alt={d.name} loading="lazy" />
              ) : (
                <div className="dl-thumb-placeholder">▲</div>
              )}
              <div className="dl-info">
                <div className="dl-game-name">{d.name}</div>
                <div className="dl-game-desc">{d.desc}</div>
              </div>
              <div className="dl-platform">{d.platform}</div>
              <div className="dl-size">{d.size}</div>
              {d.coming ? (
                <span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"9px",letterSpacing:"3px",padding:"9px 18px",borderRadius:"2px",background:"rgba(245,166,35,0.08)",border:"1px solid rgba(245,166,35,0.20)",color:"rgba(245,166,35,0.45)",cursor:"not-allowed" }}>COMING SOON</span>
              ) : (
                <a className={`dl-btn-gh${d.itch ? " dl-btn-itch" : ""}`} href={d.href} target={d.itch ? "_blank" : undefined} rel="noopener">⬇ {d.itch ? "GET FREE" : "DOWNLOAD"}</a>
              )}
            </div>
          ))}
        </div>
        <div className="dl-section-note">
          ◼ ALL GAMES ARE FREE &nbsp;·&nbsp; WINDOWS ONLY &nbsp;·&nbsp; FILES HOSTED ON GITHUB RELEASES &nbsp;·&nbsp; SYNTHRIX STUDIO · BANGLADESH · EST. 2025<br />
          ◼ IF WINDOWS DEFENDER WARNS YOU — CLICK &ldquo;MORE INFO&rdquo; → &ldquo;RUN ANYWAY&rdquo; &nbsp;·&nbsp; INDIE BUILDS TRIGGER SMARTSCREEN
        </div>
      </section>
    </div>
  );
}
