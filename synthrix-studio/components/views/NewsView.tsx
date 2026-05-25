"use client";

const DEVLOGS = [
  {
    date: "MARCH 27, 2026", id: "DEV UPDATE #01",
    title: "The Sound of SYNTHRIX — 'Crest of the Great Divide' Revealed",
    body: "We are proud to unveil the official soundtrack for Rhino's Last Protocol: 'Crest of the Great Divide'. This track defines a pivotal location in the game — the majestic mountain peaks encircling a hidden valley, isolated from the chaotic outer world.",
    extra: "Now playing — hit the player in the bottom-right corner.",
    download: true,
  },
  {
    date: "MARCH 2026", id: "LOG-003",
    title: "SYNTHPAD v2.1 Preview — AI Integration In Development",
    body: "SYNTHPAD v2.1 will feature an embedded AI assistant for game devs — context-aware writing, idea generation, and real-time design notes. Stay tuned for the release window.",
    status: "IN DEVELOPMENT",
  },
  {
    date: "MARCH 2026", id: "LOG-002",
    title: "Rhino's Last Protocol — Operational",
    body: "Development focus has shifted entirely to our flagship Sci-Fi shooter. Combat systems, fluid movement, weapon feedback, and environmental design are all active workstreams.",
  },
  {
    date: "JANUARY 2025", id: "LOG-001",
    title: "SYNTHRIX Studio Founded",
    body: "From a solo developer with a vision to a studio with a mission. SYNTHRIX Studio was founded by Suvom Kundu to create games worth playing — stories worth experiencing. The journey begins.",
  },
];

export default function NewsView() {
  return (
    <div>
      <section className="section-dark section-base">
        <div className="section-header reveal" style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: 0, right: 0, fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "4px", color: "rgba(0,201,184,0.25)", pointerEvents: "none" }}>
            // INTEL FEED — CLASSIFIED
          </div>
          <div className="section-label light">TACTICAL FEED</div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div className="section-num" style={{ color: "var(--gold)" }}>03</div>
            <h2>INTEL &amp; DEVLOGS</h2>
          </div>
        </div>

        <div className="news-grid">
          {DEVLOGS.map((item) => (
            <div key={item.id} className="news-item reveal">
              <div className="news-meta">
                <span className="news-date">{item.date}</span>
                <div className="news-id">{item.id}</div>
              </div>
              <div className="news-body">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                {item.extra && (
                  <p style={{ marginTop: "10px", color: "var(--ink-muted)", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "2px" }}>{item.extra}</p>
                )}
                {item.status && (
                  <p style={{ color: "var(--ink-muted)", fontFamily: "var(--font-mono)", fontSize: "11px", marginTop: "10px", letterSpacing: "2px" }}>
                    STATUS: <span style={{ color: "var(--gold)" }}>{item.status}</span>
                  </p>
                )}
                {item.download && (
                  <a
                    href="Crest_of_the_Great_Divide.mp3"
                    download="Crest_of_the_Great_Divide_SYNTHRIX.mp3"
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "16px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "3px", color: "var(--teal-deep)", textDecoration: "none", border: "1px solid var(--glass-border-teal)", padding: "10px 20px", borderRadius: "3px", background: "rgba(0,201,184,0.06)", transition: ".3s", position: "relative", zIndex: 10 }}
                  >
                    ⬇ DOWNLOAD TRACK (MP3)
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
