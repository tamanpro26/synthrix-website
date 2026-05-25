"use client";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-watermark" aria-hidden="true">SYNTHRIX</div>
      <div className="footer-inner">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div>
            <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "13px", letterSpacing: "4px", background: "linear-gradient(120deg,#fff,var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              SYNTHRIX STUDIO
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "3px", color: "rgba(255,255,255,0.30)", marginTop: "2px" }}>
              INDEPENDENT · BANGLADESH · EST. 2025
            </div>
          </div>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "3px", color: "rgba(255,255,255,0.30)" }}>
          © 2025 SYNTHRIX STUDIO · ALL RIGHTS RESERVED
        </div>
        <div className="footer-transmission">TRANSMISSION COMPLETE</div>
      </div>
    </footer>
  );
}
