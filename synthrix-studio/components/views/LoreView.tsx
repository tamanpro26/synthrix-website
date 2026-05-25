"use client";
import { useState } from "react";
import type { Tab } from "@/app/page";

export default function LoreView({ onSwitch }: { onSwitch: (t: Tab) => void }) {
  const [declassified, setDeclassified] = useState(false);

  return (
    <div>
      <section className="section-dark" style={{ padding: 0, overflow: "hidden" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", padding: "140px 100px 80px", position: "relative" }}>
          <div className="lore-classified-tag">◼ CLASSIFIED FILE &nbsp;·&nbsp; UNIVERSE ARCHIVE &nbsp;·&nbsp; CLEARANCE REQUIRED</div>
          <h2 style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(32px,5vw,66px)", fontWeight: 900, letterSpacing: "4px", lineHeight: "1.1", marginBottom: "22px", color: "#fff" }}>
            THE <span style={{ color: "var(--orange)", textShadow: "0 0 22px rgba(255,107,53,0.70)" }}>SYNTHRIX</span><br />
            <span style={{ color: "var(--teal)", textShadow: "0 0 22px rgba(0,201,184,0.70)" }}>UNIVERSE</span>
          </h2>
          <p style={{ fontSize: "17px", color: "rgba(237,232,223,0.55)", maxWidth: "560px", margin: "0 auto", lineHeight: "1.85", letterSpacing: ".5px" }}>
            What we are building isn&apos;t just a game. It&apos;s a <strong style={{ color: "var(--orange)" }}>world</strong> — with history, consequence, and a single operative standing between collapse and survival.
          </p>
        </div>

        {/* Chapter Cards */}
        <div className="lore-grid-inner" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", padding: "0 100px", marginBottom: "80px" }}>
          <div className="lore-card reveal">
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "4px", color: "rgba(245,166,35,0.45)", marginBottom: "12px" }}>// FILE-001 · ORIGIN EVENT</div>
            <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "28px", fontWeight: 900, color: "var(--orange)", textShadow: "0 0 18px rgba(255,107,53,0.45)", marginBottom: "8px", letterSpacing: "2px" }}>2081</div>
            <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "14px", fontWeight: 900, letterSpacing: "3px", color: "#fff", marginBottom: "14px" }}>THE CORPORATION</div>
            <p style={{ fontSize: "14px", color: "rgba(237,232,223,0.52)", lineHeight: "1.9", letterSpacing: ".3px", marginBottom: "18px" }}>
              SYNTHRIX Corporation is officially registered as a defense contractor. In reality, it is the world&apos;s first fully autonomous resource-control entity — owning critical infrastructure across seven nations.
            </p>
            <span className="lore-status-open">◼ DECLASSIFIED</span>
          </div>

          <div className="lore-card reveal">
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "4px", color: "rgba(245,166,35,0.45)", marginBottom: "12px" }}>// FILE-002 · CRITICAL EVENT</div>
            <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "28px", fontWeight: 900, color: "var(--orange)", textShadow: "0 0 18px rgba(255,107,53,0.45)", marginBottom: "8px", letterSpacing: "2px" }}>2087</div>
            <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "14px", fontWeight: 900, letterSpacing: "3px", color: "#fff", marginBottom: "14px" }}>THE COLLAPSE</div>
            <p style={{ fontSize: "14px", color: "rgba(237,232,223,0.52)", lineHeight: "1.9", letterSpacing: ".3px", marginBottom: "18px" }}>
              The last known human city-state falls under sustained corporate warfare and resource exhaustion. Emergency systems activate globally. Civilization as a concept ceases to function. Chaos protocol begins.
            </p>
            <span className="lore-status-open">◼ DECLASSIFIED</span>
          </div>

          <div className="lore-card reveal">
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "4px", color: "rgba(245,166,35,0.45)", marginBottom: "12px" }}>// FILE-003 · OPERATIVE DOSSIER</div>
            <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "28px", fontWeight: 900, color: "var(--orange)", textShadow: "0 0 18px rgba(255,107,53,0.45)", marginBottom: "8px", letterSpacing: "2px" }}>2089</div>
            <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "14px", fontWeight: 900, letterSpacing: "3px", color: "#fff", marginBottom: "14px" }}>AGENT: RHINO</div>
            <p style={{ fontSize: "14px", color: "rgba(237,232,223,0.52)", lineHeight: "1.9", letterSpacing: ".3px", marginBottom: "18px" }}>
              Designation RHINO. Last authorized operative of the dissolved SYNTHRIX enforcement division. Enhanced reflexes. Zero allegiance to the old order. One directive: execute the Protocol at all costs.
            </p>
            {!declassified ? (
              <button className="lore-status-locked" onClick={() => setDeclassified(true)}>◆ CLICK TO DECLASSIFY</button>
            ) : (
              <>
                <span className="lore-status-open">◼ DECLASSIFIED</span>
                <p style={{ marginTop: "12px", fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "rgba(255,107,53,0.75)", lineHeight: "1.9", borderLeft: "2px solid var(--orange)", paddingLeft: "12px" }}>
                  CLASSIFIED ADDENDUM: RHINO IS NOT JUST AN AGENT.<br />
                  HE IS THE PROTOCOL.<br />
                  THE CORPORATION BUILT HIM TO END THEMSELVES.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div style={{ padding: "0 100px 80px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "5px", color: "rgba(245,166,35,0.50)", marginBottom: "24px" }}>// TIMELINE — KEY EVENTS IN THE SYNTHRIX UNIVERSE</div>
          <div className="lt-track">
            {[
              { year: "2081", title: "SYNTHRIX CORPORATION FOUNDED", desc: "Officially a defense contractor. Secretly, the first fully autonomous resource-control entity. Operates in seven nations simultaneously.", active: false, redacted: false },
              { year: "2083", title: "RESOURCE WAR ESCALATES",        desc: "40% of global infrastructure compromised. SYNTHRIX deploys autonomous enforcement units. The line between corporation and government dissolves.", active: false, redacted: false },
              { year: "2085", title: "OPERATIVE RHINO — ACTIVATED",   desc: "SYNTHRIX's most advanced operative brought online. Enhanced combat architecture. No family. No past. Only the mission.", active: false, redacted: false },
              { year: "2087", title: "THE COLLAPSE — CITY-STATE FALLS", desc: "The last standing city-state falls. Chaos protocol activated globally. This is where the story begins.", active: true, redacted: false },
              { year: "2089", title: "RHINO'S LAST PROTOCOL — INITIATED", desc: "One operative. One mission. No extraction plan. The final directive of a dying empire is activated. There is no going back.", active: true, redacted: false },
              { year: "20??", title: "██████████████████████", desc: "██████████████ CLASSIFIED ██████████████ CLEARANCE LEVEL 9 REQUIRED ██████████████████████████████", active: false, redacted: true },
            ].map((item) => (
              <div key={item.year} className={`lt-item reveal${item.active ? " lt-active" : ""}${item.redacted ? " lt-redacted" : ""}`}>
                <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "13px", fontWeight: 700, color: item.active ? "var(--orange)" : "rgba(245,166,35,0.70)", letterSpacing: "2px", textAlign: "right", paddingRight: "20px", paddingTop: "2px", textShadow: item.active ? "0 0 12px rgba(255,107,53,0.55)" : "none" }}>{item.year}</div>
                <div style={{ paddingLeft: "16px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "3px", color: item.active ? "#fff" : "rgba(237,232,223,0.75)", marginBottom: "4px" }} className="lt-event-title">{item.title}</div>
                  <div style={{ fontSize: "13px", color: "rgba(237,232,223,0.38)", letterSpacing: ".3px", lineHeight: "1.7" }} className="lt-event-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: "0 100px 80px", textAlign: "center" }}>
          <div className="reveal" style={{ background: "linear-gradient(135deg,rgba(255,107,53,0.08),rgba(0,201,184,0.06))", border: "1px solid rgba(245,166,35,0.25)", borderRadius: "4px", padding: "52px 40px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center,rgba(255,107,53,0.08) 0%,transparent 65%)", pointerEvents: "none" }} />
            <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(20px,3vw,38px)", fontWeight: 900, letterSpacing: "4px", color: "#fff", marginBottom: "16px", textShadow: "0 0 30px rgba(255,107,53,0.40)" }}>THE PROTOCOL IS COMING</div>
            <p style={{ fontSize: "16px", color: "rgba(237,232,223,0.50)", letterSpacing: "1px", marginBottom: "32px" }}>
              Rhino&apos;s Last Protocol — the flagship title of SYNTHRIX Studio — is currently in active development. Be there when the world drops.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                style={{ display: "inline-flex", alignItems: "center", gap: "12px", fontFamily: "var(--font-orbitron)", fontSize: "12px", fontWeight: 700, letterSpacing: "4px", padding: "16px 42px", background: "linear-gradient(135deg,var(--orange),var(--heat))", color: "#fff", border: "none", borderRadius: "2px", cursor: "none", clipPath: "polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%)", boxShadow: "0 0 40px rgba(232,58,10,0.50)", transition: "transform .3s,box-shadow .3s" }}
                onClick={() => onSwitch("contact")}
              >
                ◆ JOIN THE SYSTEM
              </button>
              <a className="btn-secondary" href="https://youtube.com/@synthrixstudio" target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>▶ WATCH DEVLOG</a>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
