"use client";

export default function BlogView({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div>
      <section id="blog">
        <div className="sec-tag">STUDIO UPDATES</div>
        <h2 className="sec-h2 reveal">BLOG &amp; <span style={{ color:"var(--orange)" }}>POSTS</span></h2>
        <div className="blog-empty">
          ◼ NO POSTS PUBLISHED YET<br />
          <span style={{ fontSize:"8px",letterSpacing:"2px" }}>CHECK BACK SOON — THE TEAM WILL POST UPDATES HERE</span>
        </div>
      </section>
    </div>
  );
}
