"use client";
import { useEffect, useRef } from "react";

export default function Loader({ onDone }: { onDone: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const pctRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let pct = 0;
    const interval = setInterval(() => {
      pct = Math.min(pct + Math.random() * 18 + 4, 100);
      if (pctRef.current) pctRef.current.textContent = Math.floor(pct) + "%";
      if (pct >= 100) clearInterval(interval);
    }, 100);

    const t1 = setTimeout(() => {
      loaderRef.current?.classList.add("done");
    }, 2400);
    const t2 = setTimeout(onDone, 3200);

    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(interval); };
  }, [onDone]);

  return (
    <div id="sx-loader" ref={loaderRef}>
      <div className="loader-corner tl" />
      <div className="loader-corner tr" />
      <div className="loader-corner bl" />
      <div className="loader-corner br" />
      <div className="loader-scan-line" />

      <div className="loader-title-text">SYNTHRIX</div>

      <div className="loader-bar-wrap">
        <div className="loader-bar" />
      </div>

      <div ref={pctRef} style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "4px", color: "rgba(245,166,35,0.42)", marginTop: "-8px" }}>
        0%
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: "center" }}>
        <div className="loader-step">▶ LOADING GAME ENGINE</div>
        <div className="loader-step">▶ COMPILING SHADERS</div>
        <div className="loader-step">▶ ENTERING THE WORLD</div>
      </div>
    </div>
  );
}
