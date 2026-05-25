"use client";
import { useState, useEffect } from "react";
import type { Tab } from "@/app/page";

const NAV_LINKS: { id: Tab; label: string }[] = [
  { id: "home",          label: "HOME" },
  { id: "about",         label: "ABOUT" },
  { id: "games",         label: "GAMES" },
  { id: "downloads",     label: "DOWNLOADS" },
  { id: "news",          label: "NEWS" },
  { id: "join",          label: "JOIN TEAM" },
  { id: "blog",          label: "BLOG" },
  { id: "achievements",  label: "ACHIEVEMENTS" },
];

export default function Navbar({ active, onSwitch }: { active: Tab; onSwitch: (t: Tab) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (t: Tab) => { onSwitch(t); setOpen(false); };

  return (
    <header className={scrolled ? "scrolled" : ""}>
      <a href="#home" className="logo" onClick={(e) => { e.preventDefault(); go("home"); }}>
        <span>SYNTH<span className="logo-accent">RIX</span></span>
        <span className="logo-sub-txt">STUDIO</span>
      </a>

      <nav>
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={`nav-a${active === link.id ? " nav-active" : ""}`}
            onClick={(e) => { e.preventDefault(); go(link.id); }}
          >
            {link.label}
          </a>
        ))}
        <a
          href="https://synthrixstudios.vercel.app"
          className="nav-a"
          style={{ color: "rgba(0,201,184,0.50)" }}
          target="_blank"
          rel="noopener"
        >
          GAME LAB ↗
        </a>
        <a href="#join" className="nav-cta" onClick={(e) => { e.preventDefault(); go("join"); }}>
          ▶ APPLY NOW
        </a>
      </nav>

      {/* Mobile burger */}
      <button
        className="mobile-burger"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        style={{ display: "none" }}
      >
        <span style={{ display:"block",width:"22px",height:"1.5px",background:"var(--orange)",transition:".3s" }} />
        <span style={{ display:"block",width:"22px",height:"1.5px",background:"var(--orange)",transition:".3s",opacity:open?0:1 }} />
        <span style={{ display:"block",width:"22px",height:"1.5px",background:"var(--orange)",transition:".3s" }} />
      </button>

      {open && (
        <div className="mobile-menu">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`nav-a${active === link.id ? " nav-active" : ""}`}
              onClick={(e) => { e.preventDefault(); go(link.id); }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <style>{`@media(max-width:700px){header nav{display:none!important}.mobile-burger{display:flex!important}}`}</style>
    </header>
  );
}
