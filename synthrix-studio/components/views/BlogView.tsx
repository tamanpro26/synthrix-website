"use client";

const SKELETONS = [
  { icon: "⬡", cat: "DEVLOG" },
  { icon: "◼", cat: "STUDIO UPDATE" },
  { icon: "▶", cat: "GAME DESIGN" },
];

export default function BlogView({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div>
      <section id="blog">
        <div className="sec-tag">STUDIO UPDATES</div>
        <h2 className="sec-h2 reveal">BLOG &amp; <span style={{ color:"var(--orange)" }}>POSTS</span></h2>
        <div className="blog-grid">
          {SKELETONS.map((s, i) => (
            <div key={i} className="blog-card skel">
              <div className="blog-card-thumb-ph">{s.icon}</div>
              <div className="blog-card-body">
                <div className="blog-card-cat">{s.cat}</div>
                <div className="blog-card-title">LOADING CONTENT...</div>
                <div className="blog-card-meta">SYNTHRIX STUDIO · COMING SOON</div>
                <div className="blog-card-excerpt">Studio updates, devlogs and behind-the-scenes posts will appear here.</div>
              </div>
            </div>
          ))}
        </div>
        <div className="blog-empty">
          ◼ NO POSTS PUBLISHED YET<br />
          <span style={{ fontSize:"8px",letterSpacing:"2px" }}>CHECK BACK SOON — THE TEAM WILL POST UPDATES HERE</span>
        </div>
      </section>
    </div>
  );
}
