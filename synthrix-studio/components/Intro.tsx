"use client";
import { useEffect, useRef } from "react";

export default function Intro({ onDone }: { onDone: () => void }) {
  const lineRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => {
      if (lineRef.current) lineRef.current.style.width = "260px";
    }, 400);
    const t2 = setTimeout(() => {
      rootRef.current?.classList.add("fade-out");
    }, 2900);
    const t3 = setTimeout(onDone, 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div id="intro" ref={rootRef}>
      <div className="i-logo glitch">SYNTHRIX</div>
      <div className="i-line" ref={lineRef} />
      <div className="i-sub">INTERACTIVE ARTS · EST. 2025</div>
    </div>
  );
}
