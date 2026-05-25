"use client";

export default function AchievementsView({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div>
      <section id="achievements">
        <div className="sec-tag">PLAYER RECORD</div>
        <h2 className="sec-h2 reveal">YOUR <span style={{ color:"var(--orange)" }}>ACHIEVEMENTS</span></h2>
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
      </section>
    </div>
  );
}
