import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { GAMES, getGame } from "@/lib/games";
import type { Metadata } from "next";

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) return { title: "Game Not Found" };
  return {
    title: `${game.title} — SYNTHRIX Studio`,
    description: game.longDesc,
  };
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingTop: "80px" }}>
      {/* Back */}
      <div className="px-6 md:px-12 pt-8 max-w-5xl mx-auto">
        <Link href="/" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "3px", color: "var(--orange)", textDecoration: "none" }}>
          ← BACK TO STUDIO
        </Link>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: "60vh" }}>
        {game.image && (
          <div className="absolute inset-0">
            <Image src={game.image} alt={game.title} fill className="object-cover" style={{ opacity: 0.15, filter: "blur(4px)" }} />
          </div>
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,transparent 0%,var(--bg) 90%)" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-20">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "2px", background: "rgba(255,107,53,0.12)", border: "1px solid rgba(255,107,53,0.35)", color: "var(--orange)" }}>
              {game.genre}
            </span>
            <span className="px-3 py-1 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "2px", background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.25)", color: "var(--gold)" }}>
              {game.engine}
            </span>
            {game.isComingSoon && (
              <span className="px-3 py-1 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "2px", background: "rgba(0,201,184,0.08)", border: "1px solid rgba(0,201,184,0.25)", color: "var(--teal)" }}>
                IN DEVELOPMENT
              </span>
            )}
          </div>
          <h1 style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(32px,7vw,90px)", fontWeight: 900, letterSpacing: "4px", color: "var(--cream)" }}>
            {game.title.toUpperCase()}
          </h1>
          {game.subtitle && (
            <div className="mt-2" style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "5px", color: "var(--muted)" }}>
              {game.subtitle.toUpperCase()}
            </div>
          )}
          <p className="mt-6 max-w-xl" style={{ fontSize: "18px", color: "var(--muted)", lineHeight: 1.8 }}>{game.longDesc}</p>

          <div className="mt-10 flex flex-wrap gap-4">
            {game.downloadUrl ? (
              <a
                href={game.downloadUrl}
                download
                className="px-8 py-3 text-xs font-bold"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "3px", background: "linear-gradient(135deg,var(--orange),var(--red))", color: "#fff", textDecoration: "none", boxShadow: "0 0 30px rgba(232,58,10,0.4)" }}
              >
                ↓ FREE DOWNLOAD
              </a>
            ) : (
              <span className="px-8 py-3 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "3px", background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.20)", color: "rgba(245,166,35,0.50)" }}>
                COMING SOON
              </span>
            )}
            <Link href="/" className="px-8 py-3 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "3px", color: "var(--cream)", border: "1px solid rgba(237,232,223,0.2)", textDecoration: "none" }}>
              VIEW ALL GAMES
            </Link>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-20">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "STUDIO",    val: "SYNTHRIX" },
            { label: "ENGINE",    val: game.engine },
            { label: "GENRE",     val: game.genre },
            { label: "PLATFORM",  val: "WINDOWS PC" },
          ].map(({ label, val }) => (
            <div key={label} className="p-4 text-center" style={{ background: "var(--bg2)", border: "1px solid var(--bord)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "3px", color: "var(--muted)", marginBottom: "6px" }}>{label}</div>
              <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "14px", fontWeight: 700, letterSpacing: "2px", color: "var(--cream)" }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-10">
          {game.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "2px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--bord)", color: "var(--muted)" }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Windows note */}
        {game.downloadUrl && (
          <div className="p-4" style={{ background: "rgba(245,166,35,0.04)", border: "1px solid rgba(245,166,35,0.18)", fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "var(--muted)" }}>
            ■ FREE DOWNLOAD · WINDOWS ONLY · IF WINDOWS DEFENDER WARNS — CLICK "MORE INFO" → "RUN ANYWAY" · INDIE BUILDS TRIGGER SMARTSCREEN
          </div>
        )}
      </div>
    </div>
  );
}
