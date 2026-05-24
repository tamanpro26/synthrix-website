"use client";
import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  const linkCls = (id: Tab) =>
    `nav-a text-xs tracking-widest uppercase transition-all duration-200 px-3 py-1 rounded-sm cursor-none ${
      active === id
        ? "text-orange"
        : "text-cream/50 hover:text-cream hover:bg-orange/10"
    }`;

  return (
    <nav
      className="fixed top-0 w-full z-50"
      style={{ background: "rgba(7,7,7,0.88)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--bord)", fontFamily: "var(--font-mono)" }}
    >
      <div className="h-24 flex items-center justify-between px-6 md:px-12">

        {/* Left tabs */}
        <div className="hidden md:flex items-center gap-1">
          {LEFT_TABS.map((t) => (
            <button key={t.id} onClick={() => onSwitch(t.id)} className={linkCls(t.id)} style={{ fontSize: "10px", letterSpacing: "3px" }}>
              {t.label}
              {active === t.id && <span className="block w-full h-px mt-0.5" style={{ background: "var(--orange)" }} />}
            </button>
          ))}
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center cursor-none" onClick={() => onSwitch("home")} style={{ cursor: "none" }}>
          <span style={{ fontFamily: "var(--font-orbitron)", fontSize: "17px", fontWeight: 900, letterSpacing: "5px", color: "var(--cream)" }}>
            SYNTH<span style={{ color: "var(--orange)" }}>RIX</span>
          </span>
          <span style={{ fontSize: "8px", letterSpacing: "4px", color: "var(--muted)" }}>INTERACTIVE ARTS</span>
        </div>

        {/* Right tabs */}
        <div className="hidden md:flex items-center gap-1">
          {RIGHT_TABS.map((t) => (
            <button key={t.id} onClick={() => onSwitch(t.id)} className={linkCls(t.id)} style={{ fontSize: "10px", letterSpacing: "3px" }}>
              {t.label}
              {active === t.id && <span className="block w-full h-px mt-0.5" style={{ background: "var(--orange)" }} />}
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-cream/60 hover:text-cream" onClick={() => setOpen(!open)}>
          <div className="flex flex-col gap-1.5">
            {[0,1,2].map(i => (
              <span key={i} className="block w-6 h-px" style={{ background: "var(--orange)" }} />
            ))}
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-24 left-0 w-full z-40 flex flex-col items-center gap-6 py-10" style={{ background: "rgba(7,7,7,0.97)", borderBottom: "1px solid var(--bord)" }}>
          {[...LEFT_TABS, ...RIGHT_TABS].map((t) => (
            <button key={t.id} onClick={() => { onSwitch(t.id); setOpen(false); }}
              style={{ fontFamily: "var(--font-mono)", fontSize: "13px", letterSpacing: "4px", color: active === t.id ? "var(--orange)" : "var(--muted)" }}>
              {t.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
