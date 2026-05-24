"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import type { Tab } from "@/app/page";

const MARQUEE_TEXT = ["Enter The Void", "New Release", "Bangladesh Indie", "Dark Worlds", "Relentless Combat", "Stories Worth Playing", "Rhino's Last Protocol", "SYNTHRIX Studio"];

export default function HomeView({ onSwitch }: { onSwitch: (t: Tab) => void }) {
  const ctrlRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* GSAP hero entry sequence */
  useEffect(() => {
    const tl = gsap.timeline();
    if (ctrlRef.current) {
      tl.fromTo(
        ctrlRef.current,
        { opacity: 0, y: 80, rotate: -25, scale: 0.55 },
        { opacity: 0.95, y: -30, rotate: 6, scale: 1.08, duration: 1.0, ease: "back.out(1.2)" }
      ).to(ctrlRef.current, {
        opacity: 0.12, y: -20, rotate: 4, scale: 1, duration: 0.6, ease: "power2.out",
      });
    }
    if (titleRef.current) {
      const lines = titleRef.current.querySelectorAll(".htn-line");
      tl.fromTo(
        lines,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power3.out" },
        "-=0.6"
      );
    }
    /* Animate stat counters */
    statRefs.current.forEach((el, i) => {
      if (!el) return;
      const target = [5, 20, 1, 2025][i];
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.6,
        delay: 1.2,
        ease: "power2.out",
        onUpdate: () => {
          if (i === 2) el.textContent = "0" + Math.round(obj.val);
          else el.textContent = Math.round(obj.val) + (i === 0 || i === 1 ? "+" : "");
        },
      });
    });
  }, []);

  return (
    <div>
      {/* HERO */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{ minHeight: "100vh", background: "linear-gradient(135deg, var(--bg) 0%, var(--bg2) 60%, var(--bg3) 100%)" }}
      >
        {/* BG */}
        <div className="absolute inset-0 z-0"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1800')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.08 }}
        />
        <div className="absolute inset-0 z-1" style={{ background: "linear-gradient(to right, rgba(7,7,7,0.97) 40%, transparent 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 z-1" style={{ height: "40%", background: "linear-gradient(to top, var(--bg), transparent)" }} />

        {/* Controller animation */}
        <div ref={ctrlRef} className="absolute z-2 pointer-events-none" style={{ left: "50%", top: "30%", transform: "translateX(-50%)", opacity: 0 }}>
          <svg width="260" height="170" viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ filter: "drop-shadow(0 0 28px rgba(245,166,35,0.60)) drop-shadow(0 0 60px rgba(255,107,53,0.30))" }}>
            <path d="M40 50 C20 50 10 75 15 100 L30 125 C36 135 50 138 60 130 L80 110 H140 L160 130 C170 138 184 135 190 125 L205 100 C210 75 200 50 180 50 L140 42 H80 Z" fill="rgba(245,166,35,0.08)" stroke="rgba(245,166,35,0.70)" strokeWidth="2"/>
            <path d="M40 50 C38 42 45 36 55 36 L80 36 L80 42" stroke="rgba(245,166,35,0.50)" strokeWidth="1.5" fill="none"/>
            <path d="M180 50 C182 42 175 36 165 36 L140 36 L140 42" stroke="rgba(245,166,35,0.50)" strokeWidth="1.5" fill="none"/>
            <rect x="52" y="68" width="8" height="24" rx="2" fill="rgba(245,166,35,0.30)" stroke="rgba(245,166,35,0.60)" strokeWidth="1"/>
            <rect x="44" y="76" width="24" height="8" rx="2" fill="rgba(245,166,35,0.30)" stroke="rgba(245,166,35,0.60)" strokeWidth="1"/>
            <circle cx="155" cy="72" r="6" fill="rgba(0,201,184,0.20)" stroke="rgba(0,201,184,0.80)" strokeWidth="1.5"/>
            <circle cx="171" cy="80" r="6" fill="rgba(255,107,53,0.20)" stroke="rgba(255,107,53,0.80)" strokeWidth="1.5"/>
            <circle cx="155" cy="88" r="6" fill="rgba(245,166,35,0.20)" stroke="rgba(245,166,35,0.80)" strokeWidth="1.5"/>
            <circle cx="139" cy="80" r="6" fill="rgba(139,92,246,0.20)" stroke="rgba(139,92,246,0.80)" strokeWidth="1.5"/>
            <circle cx="110" cy="78" r="10" fill="rgba(245,166,35,0.10)" stroke="rgba(245,166,35,0.55)" strokeWidth="1.5"/>
            <circle cx="110" cy="78" r="4" fill="rgba(245,166,35,0.40)"/>
            <circle cx="80" cy="95" r="12" fill="rgba(255,255,255,0.04)" stroke="rgba(245,166,35,0.35)" strokeWidth="1.5"/>
            <circle cx="80" cy="95" r="6" fill="rgba(245,166,35,0.15)"/>
            <circle cx="140" cy="95" r="12" fill="rgba(255,255,255,0.04)" stroke="rgba(245,166,35,0.35)" strokeWidth="1.5"/>
            <circle cx="140" cy="95" r="6" fill="rgba(245,166,35,0.15)"/>
            <circle cx="155" cy="72" r="2" fill="rgba(0,201,184,0.90)"/>
            <circle cx="171" cy="80" r="2" fill="rgba(255,107,53,0.90)"/>
            <circle cx="155" cy="88" r="2" fill="rgba(245,166,35,0.90)"/>
            <circle cx="139" cy="80" r="2" fill="rgba(139,92,246,0.90)"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 w-full text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-6"
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "6px", color: "var(--gold)" }}
          >
            <span className="w-9 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--gold))" }} />
            BANGLADESH INDIE · EST. 2025
            <span className="w-9 h-px" style={{ background: "linear-gradient(90deg, var(--gold), transparent)" }} />
          </motion.div>

          {/* GSAP-animated title */}
          <div ref={titleRef} className="hero-title-wrap">
            <span className="htn-line block opacity-0" style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(52px,9vw,130px)", fontWeight: 900, letterSpacing: "6px", color: "var(--cream)", filter: "drop-shadow(0 0 28px rgba(255,255,255,0.28))" }}>
              SYNTH
            </span>
            <span className="htn-line block opacity-0" style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(52px,9vw,130px)", fontWeight: 900, letterSpacing: "6px", color: "var(--orange)", filter: "drop-shadow(0 0 30px rgba(255,107,53,0.72))", marginTop: "-12px" }}>
              RIX
            </span>
            <span className="htn-line block opacity-0" style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(10px,1.4vw,17px)", letterSpacing: "16px", color: "rgba(237,232,223,0.40)", marginTop: "8px" }}>
              S T U D I O
            </span>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mx-auto my-8 h-px"
            style={{ background: "linear-gradient(90deg,transparent,var(--orange),transparent)", width: "120px" }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="mb-10 mx-auto max-w-xl"
            style={{ fontSize: "clamp(15px,2vw,18px)", color: "var(--muted)", lineHeight: 1.7 }}
          >
            <strong style={{ color: "var(--cream)" }}>Born in Bangladesh.</strong> Building dark worlds,<br />
            relentless combat &amp; <em style={{ color: "var(--teal)", fontStyle: "normal" }}>stories worth playing.</em>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(232,58,10,0.65)" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSwitch("games")}
              className="relative overflow-hidden px-8 py-3 text-white font-bold"
              style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "3px", background: "linear-gradient(135deg,var(--orange),var(--red))", border: "1px solid transparent", boxShadow: "0 0 30px rgba(232,58,10,0.42)", cursor: "none" }}
            >
              ⬡ EXPLORE GAMES
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, borderColor: "var(--orange)", backgroundColor: "rgba(255,107,53,0.08)" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSwitch("join")}
              className="px-8 py-3"
              style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "3px", color: "var(--cream)", border: "1px solid rgba(190,30,45,0.45)", cursor: "none", background: "transparent" }}
            >
              ▶ JOIN THE TEAM
            </motion.button>
          </motion.div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px" style={{ border: "1px solid var(--bord)", borderRadius: "2px" }}>
            {[
              { label: "GAMES SHIPPED" },
              { label: "TEAM MEMBERS" },
              { label: "FLAGSHIP IN DEV" },
              { label: "FOUNDED" },
            ].map(({ label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.6 + i * 0.1 }}
                whileHover={{ background: "rgba(245,166,35,0.06)" }}
                className="py-8 text-center"
                style={{ background: "rgba(255,255,255,0.015)", borderRight: "1px solid var(--bord)" }}
              >
                <div
                  ref={(el) => { statRefs.current[i] = el; }}
                  style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, background: "linear-gradient(135deg,#fff,var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                >
                  0
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "4px", color: "var(--muted)", marginTop: "6px" }}>{label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "5px", color: "var(--muted)" }}
        >
          ↓ SCROLL ↓
        </motion.div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden py-4" style={{ background: "var(--bg2)", borderTop: "1px solid var(--bord)", borderBottom: "1px solid var(--bord)" }}>
        <div className="marquee-track" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "4px", color: "var(--muted)" }}>
          {[...MARQUEE_TEXT, ...MARQUEE_TEXT].map((t, i) => (
            <span key={i} className="mx-6">{t}<span className="mx-3" style={{ color: "var(--orange)" }}>◆</span></span>
          ))}
        </div>
      </div>

      {/* Manifesto */}
      <section className="py-32 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mb-8 px-4 py-2 text-xs tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--orange)", border: "1px solid rgba(255,107,53,0.32)" }}>
            // THE DOCTRINE
          </div>
          <h2 className="mb-8" style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(28px,5vw,56px)", fontWeight: 900, letterSpacing: "4px", color: "var(--cream)" }}>
            WE BUILD WORLDS,<br />
            <span style={{ color: "var(--orange)" }}>NOT PRODUCTS.</span>
          </h2>
          <p style={{ fontSize: "18px", color: "var(--muted)", lineHeight: 1.9, maxWidth: "600px", margin: "0 auto" }}>
            Every game we make is a statement. We don&apos;t chase trends — we carve our own path through the noise with dark themes, tight mechanics, and stories that hit different when you&apos;re from a place the world overlooked.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
