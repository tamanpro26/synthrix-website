"use client";

const UNITS = [
  { name: "VANGUARD SYNDICATE",  color: "#FF6B35", desc: "Game development core. Unity engine specialists and programmers." },
  { name: "VANGUARD PROTOCOL",   color: "#00C9B8", desc: "Technology and platform infrastructure. Web dev and systems." },
  { name: "VANGUARD FRONTIER",   color: "#8B5CF6", desc: "3D art, asset creation, and visual world-building." },
  { name: "VANGUARD DIVISION",   color: "#F5A623", desc: "Game design, level design, and creative direction." },
  { name: "VANGUARD AXIS",       color: "#EC4899", desc: "QA, community, audio, and cross-functional support." },
];

const HOW_IT_WORKS = [
  { title: "APPLY ONLINE", desc: "Fill out the join form below with your skills and Discord handle. We review every application personally." },
  { title: "SKILL REVIEW",  desc: "We evaluate your portfolio or work samples. No formal qualifications needed — just passion and ability." },
  { title: "ONBOARDING",    desc: "Accepted members receive their unit assignment, ID number, and access to our private channels." },
  { title: "BUILD TOGETHER", desc: "Collaborate on active projects, earn Reputation Points (RP), and grow with the studio." },
];

export default function JoinView() {
  return (
    <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-4" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "5px", color: "var(--orange)", border: "1px solid rgba(255,107,53,0.32)" }}>
          // RECRUITMENT
        </div>
        <h2 className="reveal" style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, letterSpacing: "4px" }}>
          JOIN THE <span style={{ color: "var(--orange)" }}>TEAM</span>
        </h2>
      </div>

      {/* How Synthrix Works */}
      <div className="reveal mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "5px", color: "var(--orange)", border: "1px solid rgba(255,107,53,0.32)" }}>
          // HOW SYNTHRIX STUDIOS WORKS
        </div>
        <p className="mb-8" style={{ color: "var(--muted)", lineHeight: 1.9, maxWidth: "700px" }}>
          Welcome to <strong style={{ color: "var(--cream)" }}>SYNTHRIX Studios</strong>. Founded in Bangladesh, we are an independent game development studio dedicated to building dark, gritty, atmospheric sci-fi worlds with relentless combat and deep, memorable narratives.
          <br /><br />
          We don&apos;t just follow industry trends — we build games with a <strong style={{ color: "var(--cream)" }}>distinct identity</strong>. Here is a breakdown of our ecosystem, operational framework, and how our specialized units collaborate to bring flagship titles like <strong style={{ color: "var(--gold)" }}>Rhino&apos;s Last Protocol</strong> to life.
        </p>

        {/* Operational units */}
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "5px", color: "rgba(245,166,35,0.50)", marginBottom: "14px" }}>// OUR OPERATIONAL STRUCTURE</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {UNITS.map((u) => (
            <div key={u.name} className="p-5" style={{ background: "var(--bg2)", border: `1px solid rgba(${hexToRgb(u.color)},0.22)`, borderRadius: "3px" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ background: u.color }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "3px", color: u.color }}>{u.name}</span>
              </div>
              <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.7 }}>{u.desc}</p>
            </div>
          ))}
        </div>

        {/* How it works steps */}
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "5px", color: "rgba(245,166,35,0.50)", marginBottom: "14px" }}>// JOINING PROCESS</div>
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.title} className="p-5" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid var(--bord)", borderRadius: "2px" }}>
              <div className="flex items-center gap-3 mb-3">
                <span style={{ fontFamily: "var(--font-orbitron)", fontSize: "24px", fontWeight: 900, color: "var(--orange)", opacity: 0.4 }}>0{i + 1}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "3px", color: "var(--cream)" }}>{step.title}</span>
              </div>
              <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.7 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Application form */}
      <div className="reveal p-8" style={{ background: "var(--bg2)", border: "1px solid var(--bordhi)", borderRadius: "3px", position: "relative", overflow: "hidden" }}>
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg,var(--orange),var(--gold),transparent)" }} />
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "5px", color: "var(--orange)", marginBottom: "20px" }}>// APPLICATION FORM</div>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { label: "DISCORD USERNAME", placeholder: "YourName#0000" },
            { label: "PREFERRED UNIT", placeholder: "e.g. VANGUARD SYNDICATE" },
            { label: "PRIMARY SKILL", placeholder: "e.g. Unity Game Dev, 3D Art..." },
            { label: "YEARS OF EXPERIENCE", placeholder: "e.g. 1 year" },
          ].map(({ label, placeholder }) => (
            <div key={label}>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "3px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>{label}</label>
              <input
                type="text"
                placeholder={placeholder}
                className="w-full px-3 py-2 text-sm"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--bord)", color: "var(--cream)", fontFamily: "var(--font-mono)", outline: "none", cursor: "none" }}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--bordhi)")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--bord)")}
              />
            </div>
          ))}
        </div>
        <div className="mt-5">
          <label style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "3px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>WHY DO YOU WANT TO JOIN SYNTHRIX?</label>
          <textarea
            rows={4}
            placeholder="Tell us about yourself and what you'd bring to the team..."
            className="w-full px-3 py-2 text-sm resize-none"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--bord)", color: "var(--cream)", fontFamily: "var(--font-body)", outline: "none", cursor: "none" }}
            onFocus={e => (e.currentTarget.style.borderColor = "var(--bordhi)")}
            onBlur={e => (e.currentTarget.style.borderColor = "var(--bord)")}
          />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href="mailto:synthrixs@gmail.com"
            className="px-8 py-3 text-xs font-bold"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "3px", background: "linear-gradient(135deg,var(--orange),var(--red))", color: "#fff", textDecoration: "none", cursor: "none" }}
          >
            SUBMIT APPLICATION →
          </a>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "var(--muted)" }}>Or email: synthrixs@gmail.com</span>
        </div>
      </div>
    </section>
  );
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
