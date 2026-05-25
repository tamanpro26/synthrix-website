"use client";

export default function NewsView({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div>
      <section id="news">
        <div className="sec-tag">LATEST NEWS</div>
        <h2 className="sec-h2 reveal">INTEL &amp; <span style={{ color:"var(--orange)" }}>UPDATES</span></h2>

        <div className="news-card reveal">
          <div className="news-card-top" />
          <div className="news-card-head">
            <div className="news-badge"><span className="news-badge-dot" />OFFICIAL ANNOUNCEMENT</div>
            <div className="news-date">16 MAY 2026 &nbsp;·&nbsp; STRATEGIC PARTNERSHIP</div>
          </div>

          <div className="collab-title">// COLLABORATION ANNOUNCEMENT</div>
          <div className="collab-headline">
            <em>DarkStarGames Studio</em> Announces<br />
            Strategic Collaboration with <em>SYNTHRIX Studios</em>
          </div>

          <div className="collab-studios">
            <div className="cs-logo-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="cs-logo-img"
                src="https://www.darkstargames.org/web/image/586-10e83fa2/DarkStar%20TradeMark.webp"
                alt="DarkStarGames Studio"
                loading="lazy"
              />
              <span className="cs-name dark" style={{ fontSize:"10px",marginTop:"4px" }}>DARKSTARGAMES STUDIO</span>
            </div>
            <div className="cs-x-wrap">
              <span className="cs-x">&times;</span>
              <span className="cs-x-label">COLLAB</span>
            </div>
            <div className="cs-logo-block">
              <div style={{ height:"52px",display:"flex",alignItems:"center",justifyContent:"center",padding:"0 12px",border:"1px solid rgba(245,166,35,0.28)",borderRadius:"4px",background:"rgba(245,166,35,0.05)" }}>
                <span className="cs-logo-text">SYNTHRIX</span>
              </div>
              <span className="cs-name light" style={{ fontSize:"10px",marginTop:"4px" }}>SYNTHRIX STUDIOS</span>
            </div>
          </div>

          <div className="news-body">
            <div className="news-col">
              <p>In a major move set to reshape the independent gaming landscape, <strong>SYNTHRIX Studios</strong> has officially announced a strategic collaboration with <strong>DarkStarGames Studio</strong>. This partnership marks the beginning of a long-term vision focused on innovative game development and expansion into global gaming markets.</p>
              <p>The collaboration agreement combines creative talent, technical expertise, and operational resources for the development of high-quality interactive entertainment products — including <em>mobile games</em>, <em>PC titles</em>, and next-generation digital products.</p>
              <div className="news-quote">
                &ldquo;This collaboration with DarkStarGames Studio is an important milestone in our expansion journey. We believe that combining innovation, passion, and technical creativity will allow us to deliver products that stand out.&rdquo;
                <cite>— SYNTHRIX Studios Spokesperson</cite>
              </div>
              <div className="news-quote" style={{ borderLeftColor:"rgba(180,160,255,0.55)",background:"rgba(180,160,255,0.04)" }}>
                &ldquo;Partnering with SYNTHRIX Studios gives us an opportunity to accelerate our development roadmap while building more polished and commercially viable gaming experiences for players worldwide.&rdquo;
                <cite>— DarkStarGames Studio Representatives</cite>
              </div>
            </div>
            <div className="news-col">
              <div className="news-revenue">
                <div className="nr-label">// COLLABORATION STRUCTURE &amp; REVENUE MODEL</div>
                <div className="nr-row">For projects generating revenue below <strong style={{ color:"var(--gold)" }}>&nbsp;₹5,000</strong>, earnings remain under <strong>SYNTHRIX Studios</strong> for reinvestment.</div>
                <div className="nr-row">Once project revenue exceeds <strong style={{ color:"var(--gold)" }}>&nbsp;₹5,000</strong>, a formal <strong>revenue-sharing mechanism</strong> between both studios activates.</div>
              </div>
              <div className="news-goals" style={{ marginTop:"22px" }}>
                <div className="ng-label">// STRATEGIC GOALS OF THE PARTNERSHIP</div>
                <div className="ng-grid">
                  {["ADVANCED MOBILE GAME DEVELOPMENT","MULTIPLAYER & LIVE-SERVICE SYSTEMS","BRAND ECOSYSTEM GROWTH","CROSS-PLATFORM PRODUCT LAUNCHES","COMMUNITY EXPANSION & CREATOR PROGRAMS","LONG-TERM PUBLISHING OPPORTUNITIES"].map((g) => (
                    <div key={g} className="ng-item">{g}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="news-footer">
            16 MAY 2026 &nbsp;·&nbsp; OFFICIAL PARTNERSHIP ANNOUNCEMENT &nbsp;·&nbsp; SYNTHRIX STUDIOS &nbsp;·&nbsp; MORE ANNOUNCEMENTS EXPECTED SOON
          </div>
        </div>
      </section>
    </div>
  );
}
