"use client";
import { useState, useRef } from "react";

export default function AudioPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play().catch(() => {}); setPlaying(true); }
  };

  return (
    <>
      <audio ref={audioRef} loop preload="none">
        <source src="Crest_of_the_Great_Divide.mp3" type="audio/mpeg" />
      </audio>
      <div id="audio-player">
        <button
          onClick={toggle}
          style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1.5px solid var(--orange)", background: "transparent", color: "var(--orange)", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "background .2s,color .2s,box-shadow .2s,transform .2s" }}
        >
          {playing ? "⏸" : "▶"}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "2px", color: "var(--ink-mid)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>CREST OF THE GREAT DIVIDE</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--ink-muted)", letterSpacing: "1px", marginTop: "2px" }}>SYNTHRIX OST · RLP SOUNDTRACK</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "20px" }} className={playing ? "ap-bars" : "ap-bars paused"}>
          {[6,14,10,18,8].map((h, i) => (
            <span key={i} style={{ width: "3px", height: `${h}px`, background: "linear-gradient(to top,var(--orange),var(--gold))", borderRadius: "1px", animation: playing ? `apbar 1s ease-in-out infinite alternate` : "none", animationDelay: `${i * 0.15}s`, opacity: playing ? 1 : 0.4 }} />
          ))}
        </div>
        <style>{`@keyframes apbar{from{opacity:.35;transform:scaleY(.4)}to{opacity:1;transform:scaleY(1)}}`}</style>
      </div>
    </>
  );
}
