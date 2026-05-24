"use client";
import { GAMES } from "@/lib/games";

export default function DownloadsView() {
  const releasedGames = GAMES.filter((g) => g.status === "released");
  const comingSoon    = GAMES.filter((g) => g.status === "coming-soon");

  return (
    <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-xs tracking-widest" style={{ fontFamily: "var(--font-mono)", color: "var(--orange)", border: "1px solid rgba(255,107,53,0.32)" }}>
          // DOWNLOADS
        </div>
        <h2 className="reveal" style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, letterSpacing: "4px" }}>
          GET THE <span style={{ color: "var(--orange)" }}>GAMES</span>
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {releasedGames.map((g) => (
          <div key={g.slug} className="reveal flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5" style={{ background: "var(--bg2)", border: "1px solid var(--bord)", borderRadius: "2px" }}>
            <div className="w-12 h-14 flex-shrink-0 overflow-hidden rounded" style={{ background: "var(--bg3)" }}>
              {g.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "14px", fontWeight: 700, letterSpacing: "2px", color: "var(--cream)" }}>{g.title}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "3px", color: "var(--muted)", marginTop: "3px" }}>
                {g.genre} · {g.engine} · {g.year}
              </div>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "var(--muted)", whiteSpace: "nowrap" }}>
              ⊞ WINDOWS
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "var(--muted)", whiteSpace: "nowrap" }}>
              {g.downloadSize}
            </div>
            {g.downloadUrl ? (
              <a
                href={g.downloadUrl}
                className="flex-shrink-0 px-5 py-2 text-xs"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "3px", background: "linear-gradient(135deg,var(--orange),var(--red))", color: "#fff", textDecoration: "none", whiteSpace: "nowrap", cursor: "none" }}
                download
              >
                ↓ DOWNLOAD
              </a>
            ) : (
              <span className="flex-shrink-0 px-5 py-2 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "3px", background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.18)", color: "rgba(245,166,35,0.45)", whiteSpace: "nowrap", cursor: "not-allowed" }}>
                COMING SOON
              </span>
            )}
          </div>
        ))}
        {comingSoon.map((g) => (
          <div key={g.slug} className="reveal flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 opacity-60" style={{ background: "var(--bg2)", border: "1px solid var(--bord)", borderRadius: "2px" }}>
            <div className="w-12 h-14 flex-shrink-0 flex items-center justify-center" style={{ background: "var(--bg3)", fontSize: "20px", color: "rgba(245,166,35,0.3)" }}>▲</div>
            <div className="flex-1 min-w-0">
              <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "14px", fontWeight: 700, letterSpacing: "2px", color: "var(--cream)" }}>{g.title}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "3px", color: "var(--muted)", marginTop: "3px" }}>
                {g.genre} · {g.engine} · IN DEVELOPMENT
              </div>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "var(--muted)" }}>⊞ WINDOWS</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "var(--muted)" }}>TBA</div>
            <span className="flex-shrink-0 px-5 py-2 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "3px", background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.18)", color: "rgba(245,166,35,0.45)", cursor: "not-allowed" }}>
              COMING SOON
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 text-center" style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "3px", color: "var(--muted)", background: "rgba(255,255,255,0.015)", border: "1px solid var(--bord)" }}>
        ■ ALL GAMES ARE FREE · WINDOWS ONLY · HOSTED ON GITHUB RELEASES · SYNTHRIX STUDIO · BANGLADESH · EST. 2025<br />
        ■ IF WINDOWS DEFENDER WARNS — CLICK "MORE INFO" → "RUN ANYWAY" · INDIE BUILDS TRIGGER SMARTSCREEN
      </div>
    </section>
  );
}
