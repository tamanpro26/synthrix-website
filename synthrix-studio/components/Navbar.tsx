"use client";
import { useState, useEffect, useRef } from "react";
import type { Tab } from "@/app/page";
import type { SUser } from "@/components/UserAuth";

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

const SCRAMBLE_CHARS = "!@#$%^&*_▓█▒░ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export default function Navbar({
  active,
  onSwitch,
  user,
  onLoginClick,
  onLogout,
}: {
  active: Tab;
  onSwitch: (t: Tab) => void;
  user?: SUser | null;
  onLoginClick?: () => void;
  onLogout?: () => void;
}) {
  const [scrolled,     setScrolled]     = useState(false);
  const [open,         setOpen]         = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const cancelMapRef = useRef(new Map<Element, () => void>());

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Close user menu on outside click */
  useEffect(() => {
    if (!userMenuOpen) return;
    const close = (e: MouseEvent) => {
      if (!(e.target as Element).closest?.(".nav-user")) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [userMenuOpen]);

  const go = (t: Tab) => { onSwitch(t); setOpen(false); setUserMenuOpen(false); };

  const startScramble = (el: HTMLElement, label: string) => {
    cancelMapRef.current.get(el)?.();
    let iter = 0;
    const id = setInterval(() => {
      el.textContent = label.split("").map((c, i) =>
        c === " " ? " " : i < iter ? c : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      ).join("");
      if (iter >= label.length) {
        clearInterval(id);
        el.textContent = label;
        cancelMapRef.current.delete(el);
      }
      iter += 0.38;
    }, 28);
    cancelMapRef.current.set(el, () => { clearInterval(id); el.textContent = label; });
  };

  const stopScramble = (el: HTMLElement, label: string) => {
    cancelMapRef.current.get(el)?.();
    cancelMapRef.current.delete(el);
    el.textContent = label;
  };

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
            onMouseEnter={e => startScramble(e.currentTarget, link.label)}
            onMouseLeave={e => stopScramble(e.currentTarget, link.label)}
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

        {user ? (
          <div className="nav-user">
            <button className="nav-user-btn" onClick={() => setUserMenuOpen(v => !v)}>
              <span className="nav-user-dot" />
              {user.display}
            </button>
            {userMenuOpen && (
              <div className="nav-user-menu">
                <div className="nu-item nu-head">
                  {user.username} &nbsp;·&nbsp; ★{user.rp} RP
                </div>
                <button className="nu-item" onClick={() => { go("achievements"); }}>
                  ACHIEVEMENTS
                </button>
                <button className="nu-item nu-danger" onClick={() => { onLogout?.(); setUserMenuOpen(false); }}>
                  LOGOUT
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="nav-login-btn" onClick={() => onLoginClick?.()}>▶ LOGIN</button>
        )}
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
          {!user && (
            <button className="nav-login-btn" style={{ margin:"8px auto 16px" }} onClick={() => { onLoginClick?.(); setOpen(false); }}>
              ▶ LOGIN
            </button>
          )}
        </div>
      )}

      <style>{`@media(max-width:700px){header nav{display:none!important}.mobile-burger{display:flex!important}}`}</style>
    </header>
  );
}
