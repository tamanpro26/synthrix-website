"use client";
import { useState, useEffect } from "react";
import type { Tab } from "@/app/page";

interface Props { active: Tab; onSwitch: (t: Tab) => void; dark: boolean; onToggleDark: () => void; }

const NAV_LINKS: { id: Tab; label: string }[] = [
  { id: "home",    label: "HOME" },
  { id: "games",   label: "GAMES" },
  { id: "lore",    label: "THE WORLD" },
  { id: "news",    label: "DEVLOG" },
  { id: "contact", label: "CONTACT" },
];

export default function Navbar({ active, onSwitch, dark, onToggleDark }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header id="header" className={scrolled ? "scrolled" : ""}>
      {/* Logo */}
      <a
        href="#home"
        className="logo-area"
        onClick={(e) => { e.preventDefault(); onSwitch("home"); }}
        style={{ textDecoration: "none", cursor: "none" }}
      >
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "14px", fontWeight: 900, letterSpacing: "3.5px", color: "var(--ink)", transition: "color .25s" }}>
            SYNTH<span style={{ color: "var(--orange)" }}>RIX</span>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "7px", letterSpacing: "3.5px", color: "var(--ink-muted)", marginTop: "2px" }}>
            STUDIO
          </div>
        </div>
      </a>

      {/* Desktop nav */}
      <nav style={{ display: "flex", alignItems: "center", gap: "1px" }}>
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={`nav-link${active === link.id ? " active" : ""}`}
            onClick={(e) => { e.preventDefault(); onSwitch(link.id); setOpen(false); }}
          >
            {link.label}
          </a>
        ))}
        <button
          className="theme-btn"
          onClick={onToggleDark}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
          style={{ marginLeft: "8px" }}
        >
          {dark ? "☀" : "🌙"}
        </button>
      </nav>

      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(!open)}
        style={{ display: "none", background: "none", border: "none", cursor: "none", flexDirection: "column", gap: "5px", padding: "4px" }}
        className="mobile-burger"
        aria-label="Menu"
      >
        <span style={{ display: "block", width: "22px", height: "1.5px", background: "var(--orange)", transition: ".3s" }} />
        <span style={{ display: "block", width: "22px", height: "1.5px", background: "var(--orange)", transition: ".3s", opacity: open ? 0 : 1 }} />
        <span style={{ display: "block", width: "22px", height: "1.5px", background: "var(--orange)", transition: ".3s" }} />
      </button>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: "absolute", top: "52px", left: 0, right: 0,
          background: dark ? "rgba(11,11,15,0.97)" : "rgba(255,248,237,0.97)",
          borderBottom: "1px solid rgba(245,166,35,0.22)",
          backdropFilter: "blur(24px)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "0",
          zIndex: 999,
        }}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`nav-link${active === link.id ? " active" : ""}`}
              style={{ width: "100%", textAlign: "center", padding: "16px", fontSize: "12px", letterSpacing: "4px" }}
              onClick={(e) => { e.preventDefault(); onSwitch(link.id); setOpen(false); }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media(max-width:700px) {
          header nav { display: none !important; }
          .mobile-burger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
