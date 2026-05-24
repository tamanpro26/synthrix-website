"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Tab } from "@/app/page";

const LEFT_TABS:  { id: Tab; label: string }[] = [
  { id: "home",      label: "HOME" },
  { id: "about",     label: "ABOUT" },
  { id: "games",     label: "GAMES" },
  { id: "downloads", label: "DOWNLOADS" },
];
const RIGHT_TABS: { id: Tab; label: string }[] = [
  { id: "news",         label: "NEWS" },
  { id: "blog",         label: "BLOG" },
  { id: "join",         label: "JOIN" },
  { id: "achievements", label: "ACHIEVEMENTS" },
];

interface Props { active: Tab; onSwitch: (t: Tab) => void; }

export default function Navbar({ active, onSwitch }: Props) {
  const [open, setOpen]     = useState(false);
  const [scrolled, setScroll] = useState(false);

  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const TabLink = ({ id, label }: { id: Tab; label: string }) => (
    <a
      href={`#${id}`}
      onClick={(e) => { e.preventDefault(); onSwitch(id); }}
      className="relative px-3 py-2 cursor-none"
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        letterSpacing: "3px",
        color: active === id ? "var(--orange)" : "rgba(237,232,223,0.55)",
        textDecoration: "none",
        transition: "color 0.25s",
      }}
    >
      {label}
      {active === id && (
        <motion.span
          layoutId="nav-underline"
          className="absolute left-0 right-0 -bottom-0.5 mx-3 h-px"
          style={{ background: "var(--orange)", boxShadow: "0 0 8px var(--orange)" }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </a>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.2, 0.9, 0.4, 1] }}
      className="fixed top-0 w-full z-50"
      style={{
        background: scrolled ? "rgba(7,7,7,0.94)" : "rgba(7,7,7,0.78)",
        backdropFilter: "blur(14px)",
        borderBottom: scrolled ? "1px solid var(--bordhi)" : "1px solid var(--bord)",
        transition: "background 0.3s, border-color 0.3s",
        fontFamily: "var(--font-mono)",
      }}
    >
      <div className="h-20 flex items-center justify-between px-6 md:px-12">

        {/* Left tabs */}
        <div className="hidden md:flex items-center gap-1">
          {LEFT_TABS.map((t) => <TabLink key={t.id} {...t} />)}
        </div>

        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          className="flex flex-col items-center cursor-none"
          onClick={() => onSwitch("home")}
          style={{ cursor: "none" }}
        >
          <span style={{ fontFamily: "var(--font-orbitron)", fontSize: "17px", fontWeight: 900, letterSpacing: "5px", color: "var(--cream)" }}>
            SYNTH<span style={{ color: "var(--orange)" }}>RIX</span>
          </span>
          <span style={{ fontSize: "8px", letterSpacing: "4px", color: "var(--muted)" }}>INTERACTIVE ARTS</span>
        </motion.div>

        {/* Right tabs */}
        <div className="hidden md:flex items-center gap-1">
          {RIGHT_TABS.map((t) => <TabLink key={t.id} {...t} />)}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "none" }}>
          <div className="flex flex-col gap-1.5">
            {[0,1,2].map(i => (
              <motion.span
                key={i}
                animate={open ? (i === 1 ? { opacity: 0 } : { rotate: i === 0 ? 45 : -45, y: i === 0 ? 6 : -6 }) : { rotate: 0, y: 0, opacity: 1 }}
                className="block w-6 h-px"
                style={{ background: "var(--orange)" }}
              />
            ))}
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
            style={{ background: "rgba(7,7,7,0.97)", borderBottom: "1px solid var(--bord)" }}
          >
            <div className="flex flex-col items-center gap-6 py-10">
              {[...LEFT_TABS, ...RIGHT_TABS].map((t, i) => (
                <motion.button
                  key={t.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => { onSwitch(t.id); setOpen(false); }}
                  style={{ fontFamily: "var(--font-mono)", fontSize: "13px", letterSpacing: "4px", color: active === t.id ? "var(--orange)" : "var(--muted)", background: "none", border: "none", cursor: "none" }}
                >
                  {t.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
