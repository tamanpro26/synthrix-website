"use client";
import { motion } from "framer-motion";

const GOOGLE_FORM = "https://docs.google.com/forms/d/e/1FAIpQLScbSpOStoarYPRmn27JRwymNxkTeTMCzcM3heHkUdPlLjep1A/viewform?usp=dialog";

const UNITS = [
  { ico: "💻", name: "CORE DEVELOPMENT UNIT", sub: "TECHNICAL BACKBONE",
    desc: "The technical backbone of our studio. Handles engine architecture (Unity URP/HDRP), writes clean C# scripting, optimizes graphics workflows for various hardware scales, and programs core gameplay mechanics.",
    color: "#FF6B35" },
  { ico: "🎨", name: "DESIGN & CONCEPT UNIT", sub: "ATMOSPHERE CREATORS",
    desc: "The creators of our games' unique atmosphere. Responsible for Game Design Documentation (GDD), level blockouts (greyboxing), environmental lighting setups, and scripting environmental storytelling.",
    color: "#F5A623" },
  { ico: "🛠️", name: "WEB & SYSTEMS UNIT", sub: "VANGUARD CORE · DIGITAL INFRASTRUCTURE",
    desc: "The engineers behind our digital infrastructure. Builds and optimizes official web portals, manages backend player databases, deploys gamified user dashboards, and runs technical SEO to secure our global footprint.",
    color: "#00C9B8" },
  { ico: "🚀", name: "VANGUARD SPECIALIST UNIT", sub: "LAUNCHING JULY 2026 · EXPANSION WING",
    desc: "Our frontline expansion wing. Focuses on rapid prototyping, navigating the mobile gaming market, and onboarding & training raw talent to integrate them seamlessly into professional development pipelines.",
    color: "#8B5CF6" },
];

const PHILOSOPHY = [
  { ico: "⚙️", title: "PRACTICAL EXECUTION OVER ROTE LEARNING",
    text: "We value hands-on technical experimentation, logical problem-solving, and a strong personal creative vision above traditional, rigid textbooks." },
  { ico: "🎧", title: "IMMERSIVE AUDIO-VISUALS",
    text: "Every project features a tailored atmosphere where gritty custom sound design and atmospheric soundtracks are integrated tightly with the visuals to boost immersion by 200%." },
  { ico: "🤝", title: "TRUE CREATIVE INFLUENCE",
    text: "We operate in a highly collaborative ecosystem. Every developer, artist, and designer has a direct voice in shaping our game worlds from the ground up — no restrictive corporate hierarchy." },
];

const ROLES = [
  { name: "PROGRAMMER",       desc: "Unity / Unreal Engine / C# / C++" },
  { name: "GAME ARTIST",      desc: "3D Modelling / Texturing / VFX" },
  { name: "GAME DESIGNER",    desc: "Level design / Systems / Balancing" },
  { name: "WRITER / NARRATIVE", desc: "Story / World-building / Dialogue" },
  { name: "COMPOSER / AUDIO", desc: "OST / SFX / Ambience" },
];

export default function JoinView() {
  return (
    <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-4" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "5px", color: "var(--orange)", border: "1px solid rgba(255,107,53,0.32)" }}>
          // RECRUITMENT
        </div>
        <h2 style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, letterSpacing: "4px" }}>
          JOIN THE <span style={{ color: "var(--orange)" }}>TEAM</span>
        </h2>
      </motion.div>

      {/* How Synthrix Works */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="mb-20"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "5px", color: "var(--orange)", border: "1px solid rgba(255,107,53,0.32)" }}>
          // HOW SYNTHRIX STUDIOS WORKS
        </div>
        <p className="mb-10" style={{ color: "var(--muted)", lineHeight: 1.9, maxWidth: "780px" }}>
          Welcome to <strong style={{ color: "var(--cream)" }}>SYNTHRIX Studios</strong>. Founded in Bangladesh, we are an independent game development studio dedicated to building dark, gritty, atmospheric sci-fi worlds with relentless combat and deep, memorable narratives.
          <br /><br />
          We don&apos;t just follow industry trends — we build games with a <strong style={{ color: "var(--cream)" }}>distinct identity</strong>. Here is a breakdown of our ecosystem, operational framework, and how our specialized units collaborate to bring flagship titles like <strong style={{ color: "var(--gold)" }}>Rhino&apos;s Last Protocol</strong> to life.
        </p>

        {/* Operational units */}
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "5px", color: "rgba(245,166,35,0.50)", marginBottom: "16px" }}>// OUR OPERATIONAL STRUCTURE</div>
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {UNITS.map((u, i) => (
            <motion.div
              key={u.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, borderColor: u.color }}
              className="p-6 relative overflow-hidden"
              style={{ background: "var(--bg2)", border: `1px solid rgba(${hexToRgb(u.color)},0.25)`, borderRadius: "3px" }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg,${u.color},transparent)` }} />
              <div className="text-3xl mb-3">{u.ico}</div>
              <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "13px", fontWeight: 900, letterSpacing: "3px", color: "var(--cream)", marginBottom: "4px" }}>{u.name}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "3px", color: u.color, marginBottom: "12px" }}>{u.sub}</div>
              <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.75 }}>{u.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Development philosophy */}
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "5px", color: "rgba(245,166,35,0.50)", marginBottom: "16px" }}>// OUR DEVELOPMENT PHILOSOPHY</div>
        <div className="flex flex-col gap-3 mb-14">
          {PHILOSOPHY.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-4 p-5"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--bord)", borderRadius: "3px" }}
            >
              <div className="text-2xl flex-shrink-0">{p.ico}</div>
              <div>
                <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "12px", fontWeight: 700, letterSpacing: "3px", color: "var(--cream)", marginBottom: "6px" }}>{p.title}</div>
                <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.75 }}>{p.text}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center p-6"
          style={{ fontFamily: "var(--font-orbitron)", fontSize: "13px", fontWeight: 700, letterSpacing: "3px", color: "rgba(237,232,223,0.55)", border: "1px solid rgba(245,166,35,0.20)", borderRadius: "3px", background: "rgba(245,166,35,0.04)" }}
        >
          Whether we are developing utility software like <span style={{ color: "var(--teal)" }}>SYNTHPAD</span> or high-octane shooters —<br />
          our goal remains unchanged: <span style={{ color: "var(--orange)" }}>To build something unforgettable.</span>
        </motion.div>
      </motion.div>

      {/* BUILD WORLDS + PORTAL */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h3 style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(22px,3vw,34px)", fontWeight: 900, letterSpacing: "3px", color: "var(--cream)", marginBottom: "16px" }}>
            BUILD WORLDS WITH US
          </h3>
          <p style={{ color: "var(--muted)", lineHeight: 1.85, fontSize: "15px", marginBottom: "12px" }}>
            SYNTHRIX is growing. We&apos;re looking for passionate creators who want to be part of something real — dark worlds, relentless gameplay, and stories that matter.
          </p>
          <p style={{ color: "var(--muted)", lineHeight: 1.85, fontSize: "15px", marginBottom: "28px" }}>
            Whether you&apos;re a programmer, artist, designer, or writer — if you share the vision, there&apos;s a place for you here.
          </p>
          <div className="flex flex-col gap-3">
            {ROLES.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ x: 6, borderColor: "var(--orange)" }}
                className="flex gap-3 p-3"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--bord)", borderRadius: "2px" }}
              >
                <div className="w-1.5 self-stretch" style={{ background: "var(--orange)" }} />
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "3px", color: "var(--cream)" }}>{r.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>{r.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RECRUITMENT PORTAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex flex-col items-center"
        >
          <div className="relative" style={{ width: "320px", height: "320px" }}>
            {/* Spinning rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full"
              style={{ border: "1px dashed rgba(245,166,35,0.30)" }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute rounded-full"
              style={{ inset: "20px", border: "1px solid rgba(255,107,53,0.25)" }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute rounded-full"
              style={{ inset: "40px", border: "1px dashed rgba(0,201,184,0.25)" }}
            />

            {/* Pulsing core glow */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute rounded-full"
              style={{ inset: "70px", background: "radial-gradient(circle, rgba(232,58,10,0.55) 0%, transparent 70%)" }}
            />

            {/* The portal button */}
            <motion.a
              href={GOOGLE_FORM}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.06, boxShadow: "0 0 80px rgba(232,58,10,0.85)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 16 }}
              className="absolute rounded-full flex flex-col items-center justify-center"
              style={{
                inset: "80px",
                background: "linear-gradient(135deg,var(--orange),var(--red))",
                color: "#fff",
                textDecoration: "none",
                cursor: "none",
                boxShadow: "0 0 50px rgba(232,58,10,0.55), inset 0 0 30px rgba(255,255,255,0.08)",
                border: "2px solid rgba(255,213,128,0.45)",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "6px" }}>▶</div>
              <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "18px", fontWeight: 900, letterSpacing: "3px", textAlign: "center", lineHeight: 1 }}>
                APPLY<br />NOW
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "4px", marginTop: "8px", opacity: 0.85 }}>
                ENTER THE VOID
              </div>
            </motion.a>
          </div>

          <div className="mt-8 text-center" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "3px", color: "var(--muted)", lineHeight: 1.8 }}>
            // RECRUITMENT PORTAL<br />
            <span style={{ color: "var(--orange)" }}>WARNING — YOU ARE ABOUT TO ENTER</span><br />
            <span style={{ color: "var(--gold)" }}>■ THE SYNTHRIX RECRUITMENT DIMENSION ■</span><br />
            THERE IS NO GOING BACK
          </div>
        </motion.div>
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
