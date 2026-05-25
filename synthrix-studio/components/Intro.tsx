"use client";
import { useEffect, useRef } from "react";

export default function Intro({ onDone }: { onDone: () => void }) {
  const rootRef  = useRef<HTMLDivElement>(null);
  const logoRef  = useRef<HTMLDivElement>(null);
  const lineRef  = useRef<HTMLDivElement>(null);
  const subRef   = useRef<HTMLDivElement>(null);
  const bootRef  = useRef<HTMLDivElement>(null);
  const scanRef  = useRef<HTMLDivElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl1 = setTimeout(() => {
      document.querySelectorAll(".ic").forEach((el) => el.classList.add("in"));
    }, 100);
    const tl2 = setTimeout(() => {
      if (scanRef.current) scanRef.current.classList.add("run");
    }, 350);
    const tl3 = setTimeout(() => {
      if (glitchRef.current) glitchRef.current.classList.add("flash");
    }, 600);
    const tl4 = setTimeout(() => {
      if (logoRef.current)  logoRef.current.classList.add("in");
    }, 700);
    const tl5 = setTimeout(() => {
      if (lineRef.current)  lineRef.current.style.width = "280px";
    }, 900);
    const tl6 = setTimeout(() => {
      if (subRef.current)   subRef.current.classList.add("in");
    }, 1100);
    const tl7 = setTimeout(() => {
      if (bootRef.current)  bootRef.current.classList.add("in");
    }, 1400);
    const tl8 = setTimeout(() => {
      rootRef.current?.classList.add("fade-out");
    }, 2800);
    const tl9 = setTimeout(onDone, 3300);

    return () => {
      [tl1,tl2,tl3,tl4,tl5,tl6,tl7,tl8,tl9].forEach(clearTimeout);
    };
  }, [onDone]);

  return (
    <div id="intro" ref={rootRef}>
      {/* HUD corners */}
      <div className="ic ic-tl" />
      <div className="ic ic-tr" />
      <div className="ic ic-bl" />
      <div className="ic ic-br" />
      {/* Scan + glitch */}
      <div className="i-scan" ref={scanRef} />
      <div className="i-glitch" ref={glitchRef} />
      {/* Content */}
      <div className="i-logo" ref={logoRef}>SYNTHRIX</div>
      <div className="i-line" ref={lineRef} />
      <div className="i-sub"  ref={subRef}>INTERACTIVE ARTS &nbsp;·&nbsp; EST. 2025</div>
      <div className="i-boot" ref={bootRef}>// SYSTEM BOOT COMPLETE</div>
    </div>
  );
}
