"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Game } from "@/lib/games";

export default function GamePageContent({ game }: { game: Game }) {
  const imgRef = useRef<HTMLDivElement>(null);

  /* Parallax: image moves slower than scroll so it feels deep */
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY;
      el.style.transform = `translateY(${y * 0.28}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLive = !game.isComingSoon;

  return (
    <div className="gp-root" style={{
      background: "radial-gradient(ellipse at 55% 0%, #1a0804 0%, #070707 58%)",
      minHeight: "100vh",
      color: "var(--cream)",
    }}>

      {/* ── STICKY HEADER ── */}
      <div className="gp-header">
        <Link href="/" style={{
          fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "3px",
          color: "var(--orange)", textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: "7px",
        }}>
          ← BACK TO STUDIO
        </Link>
        <div style={{
          fontFamily: "var(--font-orbitron)", fontSize: "13px", fontWeight: 900,
          letterSpacing: "5px", color: "var(--cream)",
        }}>
          SYNTH<span style={{ color: "var(--orange)" }}>RIX</span>
        </div>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "3px",
          padding: "4px 12px",
          background: isLive ? "rgba(34,197,94,0.12)" : "rgba(0,201,184,0.10)",
          border: `1px solid ${isLive ? "rgba(34,197,94,0.28)" : "rgba(0,201,184,0.25)"}`,
          color: isLive ? "#22c55e" : "var(--teal)",
        }}>
          ● {isLive ? "LIVE" : "IN DEV"}
        </div>
      </div>

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "90vh", overflow: "hidden" }}>

        {/* Parallax image — oversize container so translateY has room to pan */}
        {game.image && (
          <div ref={imgRef} style={{ position: "absolute", top: "-28%", left: 0, right: 0, bottom: "-28%", zIndex: 1 }}>
            <Image
              src={game.image}
              alt={game.title}
              fill
              unoptimized
              priority
              style={{ objectFit: "cover", objectPosition: "top center", opacity: 0.42 }}
            />
          </div>
        )}

        {/* Scanlines */}
        <div className="gp-scanline" />

        {/* Blood-red ember vignette */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
          boxShadow: "inset 0 0 240px rgba(148,16,4,0.45)",
        }} />

        {/* Gradient: transparent top → solid bottom */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
          background: "linear-gradient(to bottom, rgba(7,7,7,0.20) 0%, rgba(7,7,7,0.62) 52%, #070707 100%)",
        }} />

        {/* No image placeholder for coming-soon games */}
        {!game.image && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 1,
            background: "repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(245,166,35,0.04) 28px,rgba(245,166,35,0.04) 29px), repeating-linear-gradient(90deg,transparent,transparent 28px,rgba(0,201,184,0.03) 28px,rgba(0,201,184,0.03) 29px)",
          }} />
        )}

        {/* Hero content — pinned to bottom */}
        <div style={{
          position: "relative", zIndex: 10, height: "100%",
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          maxWidth: "1140px", margin: "0 auto", padding: "0 48px 68px",
        }}>

          {/* Genre / engine / status badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "22px" }}>
            <span className="gp-tag" style={{
              fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "2px",
              padding: "4px 14px",
              background: "rgba(255,107,53,0.12)", border: "1px solid rgba(255,107,53,0.38)",
              color: "var(--orange)",
            }}>
              {game.genre}
            </span>
            <span className="gp-tag" style={{
              fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "2px",
              padding: "4px 14px",
              background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.28)",
              color: "var(--gold)",
            }}>
              {game.engine}
            </span>
            {game.isComingSoon && (
              <span className="gp-tag" style={{
                fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "2px",
                padding: "4px 14px",
                background: "rgba(0,201,184,0.08)", border: "1px solid rgba(0,201,184,0.28)",
                color: "var(--teal)",
              }}>
                IN DEVELOPMENT
              </span>
            )}
          </div>

          {/* Title with glitch */}
          <h1 className="gp-title" style={{
            fontFamily: "var(--font-orbitron)", fontWeight: 900,
            fontSize: "clamp(36px, 8vw, 104px)", letterSpacing: "4px",
            color: "var(--cream)", lineHeight: 1, margin: 0,
          }}>
            {game.title.toUpperCase()}
          </h1>

          {game.subtitle && (
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "5px",
              color: "var(--muted)", marginTop: "10px",
            }}>
              {game.subtitle.toUpperCase()}
            </div>
          )}

          <p style={{
            marginTop: "20px", maxWidth: "580px",
            fontSize: "17px", color: "rgba(237,232,223,0.70)", lineHeight: 1.85,
          }}>
            {game.longDesc}
          </p>

          {/* CTA row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginTop: "36px" }}>
            {game.downloadUrl ? (
              <a
                href={game.downloadUrl}
                download
                className="gp-dl-btn"
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "3px", fontWeight: 700,
                  padding: "14px 40px", textDecoration: "none", color: "#fff",
                  background: "linear-gradient(135deg, var(--orange), var(--red))",
                  boxShadow: "0 0 36px rgba(232,58,10,0.45)",
                }}
              >
                ↓ FREE DOWNLOAD
                {game.downloadSize && (
                  <span style={{ fontSize: "8px", opacity: 0.70, marginLeft: "10px" }}>
                    ({game.downloadSize})
                  </span>
                )}
              </a>
            ) : (
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "3px",
                padding: "14px 40px",
                background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.20)",
                color: "rgba(245,166,35,0.48)",
              }}>
                COMING SOON
              </span>
            )}
            <Link href="/" style={{
              fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "3px",
              padding: "14px 32px", color: "var(--cream)", textDecoration: "none",
              border: "1px solid rgba(237,232,223,0.22)",
              transition: "border-color .2s, color .2s",
            }}>
              VIEW ALL GAMES
            </Link>
          </div>
        </div>
      </section>

      {/* ── DETAILS ── */}
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "52px 48px 0" }}>

        {/* Four stat cards — consistently styled, all hover the same way */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "12px", marginBottom: "28px",
        }}>
          {[
            { label: "STUDIO",   val: "SYNTHRIX" },
            { label: "ENGINE",   val: game.engine },
            { label: "GENRE",    val: game.genre },
            { label: "PLATFORM", val: "WINDOWS PC" },
          ].map(({ label, val }) => (
            <div key={label} className="gp-stat-card" style={{
              padding: "20px", textAlign: "center",
              background: "rgba(13,10,7,0.95)", border: "1px solid var(--bord)",
            }}>
              <div className="gp-stat-label" style={{
                fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "3px",
                color: "var(--muted)", marginBottom: "8px", transition: "color .2s",
              }}>
                {label}
              </div>
              <div style={{
                fontFamily: "var(--font-orbitron)", fontSize: "13px",
                fontWeight: 700, letterSpacing: "2px", color: "var(--cream)",
              }}>
                {val}
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "32px" }}>
          {game.tags.map((tag) => (
            <span key={tag} className="gp-tag" style={{
              fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "2px",
              padding: "6px 14px",
              background: "rgba(255,255,255,0.03)", border: "1px solid var(--bord)",
              color: "var(--muted)",
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Scrolling Windows notice ticker */}
        {game.downloadUrl && (
          <div className="gp-ticker-wrap" style={{ marginBottom: "64px" }}>
            <div className="gp-ticker-track" style={{
              fontFamily: "var(--font-mono)", fontSize: "9px",
              letterSpacing: "2px", color: "var(--muted)", padding: "11px 0",
            }}>
              {/* Two copies so the loop is seamless */}
              {[0, 1].map((n) => (
                <span key={n} style={{
                  display: "inline-flex", alignItems: "center",
                  gap: "18px", paddingRight: "80px",
                }}>
                  <span className="gp-dot-pulse">■</span>
                  FREE DOWNLOAD &nbsp;·&nbsp; WINDOWS ONLY &nbsp;·&nbsp;
                  IF WINDOWS DEFENDER WARNS — CLICK &quot;MORE INFO&quot; → &quot;RUN ANYWAY&quot; &nbsp;·&nbsp;
                  INDIE BUILDS TRIGGER SMARTSCREEN &nbsp;·&nbsp;
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
