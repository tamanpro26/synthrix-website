"use client";
import type { SUser } from "@/components/UserAuth";

const TEASERS = [
  { icon:"🏆", name:"FIRST BLOOD",    desc:"Ship your first game release",    pts:100,  rarity:"common" },
  { icon:"⚡", name:"SPEED RUNNER",   desc:"Complete a game jam in 48 hours", pts:250,  rarity:"rare" },
  { icon:"🌟", name:"VANGUARD ELITE", desc:"Reach vanguard protocol rank",     pts:500,  rarity:"epic" },
  { icon:"🔥", name:"FOUNDER'S MARK", desc:"Original studio founding member", pts:1000, rarity:"legendary" },
  { icon:"🎮", name:"GAME MASTER",    desc:"Release 5 complete projects",      pts:750,  rarity:"epic" },
  { icon:"🚀", name:"PIONEER",        desc:"Join within the first 30 days",   pts:300,  rarity:"rare" },
];

export default function AchievementsView({ active, user }: { active: boolean; user?: SUser | null }) {
  if (!active) return null;
  return (
    <div>
      <section id="achievements">
        <div className="sec-tag">PLAYER RECORD</div>
        <h2 className="sec-h2 reveal">YOUR <span style={{ color:"var(--orange)" }}>ACHIEVEMENTS</span></h2>

        {user ? (
          <>
            {/* Logged-in user card */}
            <div className="ach-user-card reveal">
              <div>
                <div className="ach-uc-name">▶ {user.display}</div>
                <div className="ach-uc-meta">
                  ENLISTED {user.joinDate} &nbsp;·&nbsp; UNIT: {user.unit.toUpperCase()}
                </div>
                <div className="ach-uc-rp">★ {user.rp} RESPECT POINTS</div>
              </div>
              <div style={{ marginLeft:"auto",textAlign:"right",opacity:0.35 }}>
                <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"8px",letterSpacing:"3px",lineHeight:2 }}>
                  STATUS: ACTIVE<br />VANGUARD NETWORK
                </div>
              </div>
            </div>

            {/* Achievement teasers — visible for logged-in users */}
            <div className="ach-teaser-label">▸ ACHIEVEMENTS COMING SOON — SYSTEM IN DEVELOPMENT</div>
            <div className="ach-teaser-grid">
              {TEASERS.map((a, i) => (
                <div key={i} className={`ach-tc ${a.rarity}`} style={{ filter:"none",opacity:0.6 }}>
                  <div className="ach-tc-icon">{a.icon}</div>
                  <div className="ach-tc-name">{a.name}</div>
                  <div className="ach-tc-desc">{a.desc}</div>
                  <div className="ach-tc-pts">{a.pts} PTS · {a.rarity.toUpperCase()}</div>
                </div>
              ))}
            </div>
            <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"9px",letterSpacing:"3px",color:"rgba(237,232,223,0.20)",textAlign:"center",padding:"28px 0" }}>
              ◼ ACHIEVEMENT TRACKING IN DEVELOPMENT &nbsp;·&nbsp; CHECK BACK SOON
            </div>
          </>
        ) : (
          <>
            {/* Teaser for guests */}
            <div className="ach-teaser-label">▸ ACHIEVEMENT PREVIEW · LOGIN TO UNLOCK</div>
            <div className="ach-teaser-grid">
              {TEASERS.map((a, i) => (
                <div key={i} className={`ach-tc ${a.rarity}`}>
                  <div className="ach-tc-icon">{a.icon}</div>
                  <div className="ach-tc-name">{a.name}</div>
                  <div className="ach-tc-desc">{a.desc}</div>
                  <div className="ach-tc-pts">{a.pts} PTS · {a.rarity.toUpperCase()}</div>
                </div>
              ))}
            </div>

            {/* Locked state */}
            <div className="ach-locked">
              <div className="ach-locked-icon">🔒</div>
              <div className="ach-locked-title">LOGIN REQUIRED</div>
              <div className="ach-locked-sub">CREATE AN ACCOUNT TO TRACK YOUR ACHIEVEMENTS</div>
              <div className="ach-locked-btns">
                <button className="ach-locked-btn primary" disabled style={{ opacity:0.5 }}>▶ COMING SOON</button>
                <button className="ach-locked-btn outline" disabled style={{ opacity:0.5 }}>▲ CREATE ACCOUNT</button>
              </div>
              <p style={{ marginTop:"24px",fontFamily:"'Share Tech Mono',monospace",fontSize:"9px",letterSpacing:"3px",color:"rgba(237,232,223,0.22)",textAlign:"center" }}>
                ACHIEVEMENT SYSTEM &nbsp;·&nbsp; IN DEVELOPMENT &nbsp;·&nbsp; COMING SOON
              </p>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
