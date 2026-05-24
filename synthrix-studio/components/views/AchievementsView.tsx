"use client";
import { useState, useEffect } from "react";

interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  date: string;
  unlocked: boolean;
  secret?: boolean;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: "first_game",    title: "FIRST CONTACT",      icon: "🎮", desc: "First game released by SYNTHRIX Studio.",    date: "2025",     unlocked: true  },
  { id: "team_10",       title: "SQUAD ASSEMBLED",    icon: "👥", desc: "Team grew to 10+ members.",                  date: "2025",     unlocked: true  },
  { id: "collab",        title: "ALLIANCE FORGED",    icon: "🤝", desc: "Strategic partnership with DarkStarGames.", date: "MAY 2026", unlocked: true  },
  { id: "team_20",       title: "VANGUARD FORCE",     icon: "⚡", desc: "Team reached 20 members.",                  date: "2026",     unlocked: true  },
  { id: "web_launch",    title: "SIGNAL BROADCAST",   icon: "🌐", desc: "Official studio website launched.",          date: "2026",     unlocked: true  },
  { id: "five_games",    title: "VAULT OPENED",       icon: "🗝️", desc: "5 titles shipped.",                          date: "2026",     unlocked: true  },
  { id: "rlp_dev",       title: "THE PROTOCOL BEGINS",icon: "▲",  desc: "Rhino's Last Protocol entered development.", date: "2026",     unlocked: true  },
  { id: "ai_system",     title: "MACHINE MIND",       icon: "🤖", desc: "AI agent system integrated into mission control.", date: "2026", unlocked: true },
  { id: "rlp_release",   title: "PROTOCOL EXECUTED",  icon: "🚀", desc: "Rhino's Last Protocol shipped.",             date: "???",      unlocked: false },
  { id: "global_reach",  title: "WORLDWIDE SIGNAL",   icon: "🌍", desc: "10,000+ downloads across all titles.",       date: "???",      unlocked: false },
  { id: "secret_1",      title: "???",                icon: "?",  desc: "A secret achievement. Keep building.",       date: "???",      unlocked: false, secret: true },
  { id: "secret_2",      title: "???",                icon: "?",  desc: "Something legendary is coming.",             date: "???",      unlocked: false, secret: true },
];

export default function AchievementsView() {
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const u = sessionStorage.getItem("sx_user");
    if (u) { setLoggedIn(true); setUser(u); }

    const stored = localStorage.getItem("sx_achievements");
    if (stored) {
      const extra: Achievement[] = JSON.parse(stored);
      setAchievements((prev) => {
        const ids = new Set(prev.map((a) => a.id));
        return [...prev, ...extra.filter((a) => !ids.has(a.id))];
      });
    }
  }, []);

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked   = achievements.filter((a) => !a.unlocked);

  return (
    <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-4" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "5px", color: "var(--orange)", border: "1px solid rgba(255,107,53,0.32)" }}>
          // STUDIO MILESTONES
        </div>
        <h2 className="reveal" style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, letterSpacing: "4px" }}>
          ACHIEVE<span style={{ color: "var(--orange)" }}>MENTS</span>
        </h2>
        <div className="mt-4 flex items-center gap-4">
          <div className="h-2 rounded-sm overflow-hidden flex-1 max-w-xs" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--bord)" }}>
            <div style={{ width: `${(unlocked.length / achievements.length) * 100}%`, height: "100%", background: "linear-gradient(90deg,var(--orange),var(--gold))", transition: "width .8s ease" }} />
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "3px", color: "var(--muted)" }}>
            {unlocked.length} / {achievements.length} UNLOCKED
          </span>
        </div>
      </div>

      {!loggedIn && (
        <div className="mb-8 p-4" style={{ background: "rgba(245,166,35,0.05)", border: "1px solid rgba(245,166,35,0.22)", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "3px", color: "var(--muted)" }}>
          ⚠ LOG IN TO UNLOCK PERSONAL ACHIEVEMENTS AND TRACK YOUR RP
        </div>
      )}
      {loggedIn && (
        <div className="mb-8 p-4" style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.22)", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "3px", color: "rgba(34,197,94,0.8)" }}>
          ✓ LOGGED IN AS {user?.toUpperCase()} — TRACKING ACTIVE
        </div>
      )}

      {/* Unlocked */}
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "5px", color: "rgba(245,166,35,0.50)", marginBottom: "14px" }}>// UNLOCKED</div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {unlocked.map((a) => (
          <div key={a.id} className="reveal p-5" style={{ background: "var(--bg2)", border: "1px solid var(--bordhi)", borderRadius: "3px", position: "relative", overflow: "hidden" }}>
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg,var(--orange),var(--gold),transparent)" }} />
            <div className="flex items-start gap-3">
              <span className="text-3xl">{a.icon}</span>
              <div>
                <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "12px", fontWeight: 700, letterSpacing: "2px", color: "var(--cream)", marginBottom: "4px" }}>{a.title}</div>
                <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.6 }}>{a.desc}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", color: "var(--gold)", marginTop: "8px" }}>{a.date}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Locked */}
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "5px", color: "rgba(237,232,223,0.2)", marginBottom: "14px" }}>// LOCKED</div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-50">
        {locked.map((a) => (
          <div key={a.id} className="reveal p-5" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "3px", filter: "grayscale(1)" }}>
            <div className="flex items-start gap-3">
              <span className="text-3xl opacity-30">{a.icon}</span>
              <div>
                <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "12px", fontWeight: 700, letterSpacing: "2px", color: "rgba(237,232,223,0.4)", marginBottom: "4px" }}>
                  {a.secret ? "???" : a.title}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(237,232,223,0.25)", lineHeight: 1.6 }}>
                  {a.secret ? "CLASSIFIED" : a.desc}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", color: "rgba(237,232,223,0.2)", marginTop: "8px" }}>🔒 LOCKED</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
