"use client";

const LINKS = [
  { icon: "📧", label: "EMAIL",   value: "synthrixs@gmail.com",      href: "mailto:synthrixs@gmail.com" },
  { icon: "💬", label: "DISCORD", value: "JOIN THE COMMUNITY",        href: "https://discord.gg/eT8RDu4YCU" },
  { icon: "▶",  label: "YOUTUBE", value: "SYNTHRIX Official Studio",  href: "https://youtube.com/@synthrixstudio" },
  { icon: "🎮", label: "ITCH.IO", value: "PLAY OUR GAMES",            href: "https://synthrix-studio.itch.io" },
];

export default function ContactView() {
  return (
    <div>
      <section className="section-base">
        <div className="section-header reveal">
          <div className="section-label">OPEN CHANNEL</div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div className="section-num">04</div>
            <h2>COMMUNICATIONS</h2>
          </div>
        </div>

        <div className="contact-grid">
          <div className="reveal-left">
            <p style={{ color: "var(--ink-soft)", fontSize: "17px", lineHeight: "1.9", marginBottom: "28px" }}>
              Ready to join the network? Connect with SYNTHRIX Studio through the following frequencies. Whether you&apos;re a fellow developer, a gamer, or a collaborator — we&apos;re online.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {LINKS.map((link) => (
                <a key={link.label} className="contact-link" href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel="noopener">
                  <div style={{ width: "44px", height: "44px", borderRadius: "4px", border: "1.5px solid var(--glass-border-warm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0, background: "rgba(245,166,35,0.08)", transition: "background .3s, border-color .3s" }}>
                    {link.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "3px", color: "var(--ink-muted)", marginBottom: "3px" }}>{link.label}</div>
                    <div style={{ fontSize: "15px", letterSpacing: "1px", color: "var(--ink-mid)", transition: "color .3s" }}>{link.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="contact-signal reveal-right">
            <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "16px", letterSpacing: "3px", marginBottom: "22px", color: "var(--teal-deep)" }}>// TRANSMISSION STATUS</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", marginBottom: "22px", height: "52px" }}>
              {[28,55,80,62,95,48,72,38].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: "linear-gradient(to top, rgba(0,201,184,0.30), var(--teal))", borderRadius: "2px 2px 0 0", animation: `signalpulse 1.6s ease-in-out infinite`, animationDelay: `${i * 0.12}s` }} />
              ))}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--ink-soft)", letterSpacing: "2px", lineHeight: "2" }}>
              STUDIO STATUS &nbsp;›&nbsp; <strong style={{ color: "#16a34a" }}>ONLINE</strong><br />
              RECRUITMENT &nbsp;›&nbsp; <strong style={{ color: "#16a34a" }}>OPEN</strong><br />
              RESPONSE TIME &nbsp;›&nbsp; WITHIN 48H
            </div>
            <style>{`@keyframes signalpulse{0%,100%{opacity:.35}50%{opacity:1}}`}</style>
          </div>
        </div>
      </section>
    </div>
  );
}
