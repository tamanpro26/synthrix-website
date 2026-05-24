"use client";
import { useState, useEffect, useRef } from "react";

/* ── Auth ── */
const ADMIN_DB: Record<string, { hash: string; role: string; display: string }> = {
  suvom: { hash: "e4eb3a47d93e5a729b9c2f3e7e1e0b2a1d4c5f6a7b8c9d0e1f2a3b4c5d6e7f8", role: "SYSTEM", display: "SUVOM KUNDU" },
  taman: { hash: "73d4532c8e1f9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6", role: "SYSTEM", display: "TAMAN" },
};

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

/* ── Storage keys ── */
const GKEY = "sx_games_v2";
const PKEY = "sx_posts";
const AKEY = "sx_announcements";
const ADKEY = "sx_admin_accounts";

type Tab = "overview" | "games" | "blog" | "announcements" | "team" | "ai" | "messages" | "database";

export default function AdminPanel() {
  const [authed, setAuthed]     = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authErr, setAuthErr]   = useState("");
  const [role, setRole]         = useState("");
  const [display, setDisplay]   = useState("");
  const [tab, setTab]           = useState<Tab>("overview");

  /* AI state */
  const [aiHistory, setAiHistory] = useState<{ role: string; content: string }[]>([]);
  const [aiInput, setAiInput]     = useState("");
  const [aiTyping, setAiTyping]   = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = sessionStorage.getItem("sx_admin_session");
    if (s) {
      const d = JSON.parse(s) as { display: string; role: string };
      setAuthed(true); setDisplay(d.display); setRole(d.role);
    }
  }, []);

  const login = async () => {
    setAuthErr("");
    const u = username.trim().toLowerCase();
    const h = await sha256(password);

    /* Check hardcoded admins first — known type, no passwordHash needed */
    const staticAdmin = Object.prototype.hasOwnProperty.call(ADMIN_DB, u) ? ADMIN_DB[u] : undefined;
    if (staticAdmin) {
      if (staticAdmin.hash !== h) { setAuthErr("INVALID PASSWORD"); return; }
      sessionStorage.setItem("sx_admin_session", JSON.stringify({ display: staticAdmin.display, role: staticAdmin.role }));
      setAuthed(true); setDisplay(staticAdmin.display); setRole(staticAdmin.role);
      return;
    }

    /* Check dynamic admins from localStorage — may have hash or passwordHash */
    type DynAdmin = { username: string; hash?: string; passwordHash?: string; role?: string; level?: string; display: string };
    const dynAdmins: DynAdmin[] = JSON.parse(localStorage.getItem(ADKEY) ?? "[]");
    const dyn = dynAdmins.find((a) => a.username === u);
    if (!dyn) { setAuthErr("USER NOT FOUND"); return; }
    if ((dyn.hash ?? dyn.passwordHash) !== h) { setAuthErr("INVALID PASSWORD"); return; }
    sessionStorage.setItem("sx_admin_session", JSON.stringify({ display: dyn.display, role: dyn.role ?? dyn.level }));
    setAuthed(true); setDisplay(dyn.display); setRole(dyn.role ?? dyn.level ?? "");
  };

  const logout = () => { sessionStorage.removeItem("sx_admin_session"); setAuthed(false); };

  const sendAI = async () => {
    if (!aiInput.trim() || aiTyping) return;
    const msg = aiInput.trim();
    setAiInput("");
    const newHist = [...aiHistory, { role: "user", content: msg }];
    setAiHistory(newHist);
    setAiTyping(true);

    try {
      const res = await fetch("/api/ai-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: msg, history: newHist.slice(-10) }),
      });
      const data = await res.json() as { result?: string; team?: { name: string }[]; error?: string };
      const reply = data.result ?? data.error ?? "No response.";
      setAiHistory(h => [...h, { role: "assistant", content: reply }]);
    } catch (e) {
      setAiHistory(h => [...h, { role: "assistant", content: `Error: ${(e as Error).message}` }]);
    }
    setAiTyping(false);
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [aiHistory, aiTyping]);

  /* ── Login screen ── */
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#050508" }}>
        <div className="w-full max-w-sm p-8" style={{ background: "#0a0a12", border: "1px solid rgba(139,92,246,0.30)", borderRadius: "4px" }}>
          <div style={{ fontFamily: "'Courier New',monospace", fontSize: "10px", letterSpacing: "6px", color: "rgba(139,92,246,0.7)", marginBottom: "4px" }}>// SYNTHRIX</div>
          <div style={{ fontFamily: "'Courier New',monospace", fontSize: "20px", fontWeight: 700, letterSpacing: "4px", color: "#e2e8e4", marginBottom: "24px" }}>MISSION CONTROL</div>
          {authErr && <div className="mb-4 p-2 text-xs text-center" style={{ fontFamily: "'Courier New',monospace", letterSpacing: "2px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "rgba(239,68,68,0.8)" }}>{authErr}</div>}
          {[
            { label: "USERNAME", val: username, set: setUsername, type: "text" },
            { label: "PASSWORD", val: password, set: setPassword, type: "password" },
          ].map(({ label, val, set, type }) => (
            <div key={label} className="mb-4">
              <div className="mb-1" style={{ fontFamily: "'Courier New',monospace", fontSize: "8px", letterSpacing: "3px", color: "rgba(226,232,228,0.4)" }}>{label}</div>
              <input type={type} value={val} onChange={e => set(e.target.value)} onKeyDown={e => e.key === "Enter" && login()}
                className="w-full px-3 py-2"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.28)", color: "#e2e8e4", fontFamily: "'Courier New',monospace", outline: "none", fontSize: "13px" }}
              />
            </div>
          ))}
          <button onClick={login} className="w-full py-3 mt-2 text-xs font-bold" style={{ fontFamily: "'Courier New',monospace", letterSpacing: "4px", background: "linear-gradient(135deg,rgba(139,92,246,0.8),rgba(109,40,217,0.8))", color: "#fff", border: "none", cursor: "pointer" }}>
            AUTHENTICATE
          </button>
        </div>
      </div>
    );
  }

  /* ── Dashboard ── */
  const TABS: { id: Tab; label: string }[] = [
    { id: "overview",      label: "OVERVIEW" },
    { id: "games",         label: "GAMES" },
    { id: "blog",          label: "BLOG" },
    { id: "announcements", label: "ANNOUNCEMENTS" },
    { id: "team",          label: "TEAM" },
    { id: "ai",            label: "AI TEAM" },
    { id: "messages",      label: "MESSAGES" },
    ...(role === "SYSTEM" || role === "CONTROLLER" ? [{ id: "database" as Tab, label: "DATABASE" }] : []),
  ];

  return (
    <div style={{ background: "#050508", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3" style={{ background: "#0a0a12", borderBottom: "1px solid rgba(139,92,246,0.20)", fontFamily: "'Courier New',monospace" }}>
        <div>
          <span style={{ fontSize: "12px", letterSpacing: "4px", color: "rgba(139,92,246,0.7)" }}>SYNTHRIX</span>
          <span className="ml-2" style={{ fontSize: "10px", letterSpacing: "3px", color: "rgba(226,232,228,0.5)" }}>MISSION CONTROL</span>
        </div>
        <div className="flex items-center gap-4">
          <span style={{ fontSize: "9px", letterSpacing: "2px", color: "rgba(226,232,228,0.4)" }}>{display} · {role}</span>
          <button onClick={logout} style={{ fontSize: "8px", letterSpacing: "3px", color: "rgba(239,68,68,0.7)", background: "none", border: "1px solid rgba(239,68,68,0.25)", padding: "4px 10px", cursor: "pointer", fontFamily: "'Courier New',monospace" }}>LOGOUT</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-44 flex-shrink-0 py-4" style={{ background: "#080810", borderRight: "1px solid rgba(139,92,246,0.15)", fontFamily: "'Courier New',monospace" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className="w-full text-left px-4 py-3 text-xs transition-colors" style={{ letterSpacing: "2px", background: tab === t.id ? "rgba(139,92,246,0.12)" : "transparent", color: tab === t.id ? "rgba(139,92,246,0.9)" : "rgba(226,232,228,0.35)", borderLeft: tab === t.id ? "2px solid rgba(139,92,246,0.7)" : "2px solid transparent", cursor: "pointer" }}>
              {t.label}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6" style={{ fontFamily: "'Courier New',monospace" }}>
          {tab === "overview" && <Overview role={role} display={display} />}
          {tab === "games"    && <GamesPanel />}
          {tab === "blog"     && <BlogPanel />}
          {tab === "ai"       && (
            <AIPanel aiHistory={aiHistory} aiInput={aiInput} setAiInput={setAiInput} aiTyping={aiTyping} onSend={sendAI} chatRef={chatRef} />
          )}
          {tab === "database" && <DatabasePanel />}
          {!["overview","games","blog","ai","database"].includes(tab) && (
            <PlaceholderPanel name={tab.toUpperCase()} />
          )}
        </main>
      </div>
    </div>
  );
}

/* ── Sub-panels ── */
function Overview({ role, display }: { role: string; display: string }) {
  const games   = JSON.parse(typeof window !== "undefined" ? localStorage.getItem(GKEY) ?? "[]" : "[]");
  const posts   = JSON.parse(typeof window !== "undefined" ? localStorage.getItem(PKEY) ?? "[]" : "[]");
  const anns    = JSON.parse(typeof window !== "undefined" ? localStorage.getItem(AKEY) ?? "[]" : "[]");
  return (
    <div>
      <div className="mb-6" style={{ fontSize: "9px", letterSpacing: "5px", color: "rgba(139,92,246,0.5)" }}>// OVERVIEW</div>
      <div className="mb-2" style={{ fontSize: "18px", letterSpacing: "3px", color: "#e2e8e4" }}>WELCOME, {display.toUpperCase()}</div>
      <div className="mb-8" style={{ fontSize: "9px", letterSpacing: "3px", color: "rgba(226,232,228,0.4)" }}>RANK: {role} · SYNTHRIX MISSION CONTROL</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "GAMES",    val: games.length },
          { label: "POSTS",    val: posts.length },
          { label: "ANNOUNCEMENTS", val: anns.length },
        ].map(({ label, val }) => (
          <div key={label} className="p-4 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(139,92,246,0.15)" }}>
            <div style={{ fontSize: "28px", fontWeight: 700, color: "rgba(139,92,246,0.8)" }}>{val}</div>
            <div style={{ fontSize: "8px", letterSpacing: "3px", color: "rgba(226,232,228,0.35)", marginTop: "4px" }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GamesPanel() {
  const [games, setGames] = useState<{ id: string; title: string; genre: string; status: string; description: string; thumbnail?: string }[]>([]);
  const [form, setForm]   = useState({ title: "", genre: "", status: "development", description: "" });
  const fileRef = useRef<HTMLInputElement>(null);
  const [thumb, setThumb] = useState("");

  useEffect(() => {
    const s = localStorage.getItem(GKEY);
    if (s) setGames(JSON.parse(s));
  }, []);

  const save = (g: typeof games) => { setGames(g); localStorage.setItem(GKEY, JSON.stringify(g)); };

  const add = () => {
    if (!form.title.trim()) return;
    save([...games, { id: Date.now().toString(), ...form, thumbnail: thumb }]);
    setForm({ title: "", genre: "", status: "development", description: "" }); setThumb("");
  };

  return (
    <div>
      <div className="mb-4" style={{ fontSize: "9px", letterSpacing: "5px", color: "rgba(139,92,246,0.5)" }}>// GAMES MANAGER</div>
      <div className="p-5 mb-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(139,92,246,0.20)" }}>
        <div className="mb-3" style={{ fontSize: "9px", letterSpacing: "3px", color: "rgba(226,232,228,0.45)" }}>ADD GAME</div>
        <div className="grid md:grid-cols-2 gap-3 mb-3">
          {[
            { key: "title",   label: "TITLE",  ph: "Game Title" },
            { key: "genre",   label: "GENRE",  ph: "e.g. FPS, RPG" },
          ].map(({ key, label, ph }) => (
            <div key={key}>
              <div className="mb-1" style={{ fontSize: "8px", letterSpacing: "2px", color: "rgba(226,232,228,0.35)" }}>{label}</div>
              <input value={(form as Record<string, string>)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph}
                className="w-full px-3 py-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.25)", color: "#e2e8e4", fontFamily: "'Courier New',monospace", fontSize: "11px", outline: "none" }} />
            </div>
          ))}
        </div>
        <div className="mb-3">
          <div className="mb-1" style={{ fontSize: "8px", letterSpacing: "2px", color: "rgba(226,232,228,0.35)" }}>DESCRIPTION</div>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
            className="w-full px-3 py-2 resize-none" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.25)", color: "#e2e8e4", fontFamily: "'Courier New',monospace", fontSize: "11px", outline: "none" }} />
        </div>
        <div className="mb-4">
          <div className="mb-1" style={{ fontSize: "8px", letterSpacing: "2px", color: "rgba(226,232,228,0.35)" }}>THUMBNAIL (drag &amp; drop or click)</div>
          <div
            className="border-2 border-dashed p-6 text-center cursor-pointer"
            style={{ borderColor: "rgba(139,92,246,0.25)", color: "rgba(226,232,228,0.35)", fontSize: "10px", letterSpacing: "2px" }}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { const r = new FileReader(); r.onload = ev => setThumb(ev.target?.result as string); r.readAsDataURL(f); } }}
            onClick={() => fileRef.current?.click()}
          >
            {thumb ? <img src={thumb} alt="" className="max-h-24 mx-auto" /> : "DROP IMAGE HERE"}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setThumb(ev.target?.result as string); r.readAsDataURL(f); }}} />
        </div>
        <button onClick={add} style={{ fontFamily: "'Courier New',monospace", fontSize: "9px", letterSpacing: "3px", padding: "8px 20px", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.40)", color: "rgba(139,92,246,0.9)", cursor: "pointer" }}>
          + ADD GAME
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {games.map(g => (
          <div key={g.id} className="flex items-center gap-4 p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(139,92,246,0.15)" }}>
            {g.thumbnail && <img src={g.thumbnail} alt="" className="w-10 h-12 object-cover" />}
            <div className="flex-1">
              <div style={{ fontSize: "12px", letterSpacing: "2px", color: "#e2e8e4" }}>{g.title}</div>
              <div style={{ fontSize: "9px", letterSpacing: "2px", color: "rgba(226,232,228,0.4)" }}>{g.genre} · {g.status}</div>
            </div>
            <button onClick={() => save(games.filter(x => x.id !== g.id))} style={{ fontSize: "9px", letterSpacing: "2px", color: "rgba(239,68,68,0.6)", background: "none", border: "1px solid rgba(239,68,68,0.2)", padding: "4px 10px", cursor: "pointer", fontFamily: "'Courier New',monospace" }}>
              REMOVE
            </button>
          </div>
        ))}
        {games.length === 0 && <div style={{ fontSize: "10px", letterSpacing: "3px", color: "rgba(226,232,228,0.2)", padding: "24px", textAlign: "center" }}>NO GAMES ADDED</div>}
      </div>
    </div>
  );
}

function BlogPanel() {
  const [posts, setPosts]   = useState<{ id: string; title: string; category: string; content: string; author: string; date: string; status: string }[]>([]);
  const [form, setForm]     = useState({ title: "", category: "News", content: "", author: "SYNTHRIX TEAM", status: "draft" });

  useEffect(() => { const s = localStorage.getItem(PKEY); if (s) setPosts(JSON.parse(s)); }, []);
  const save = (p: typeof posts) => { setPosts(p); localStorage.setItem(PKEY, JSON.stringify(p)); };
  const add = () => {
    if (!form.title.trim()) return;
    save([...posts, { id: Date.now().toString(), ...form, date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase() }]);
    setForm({ title: "", category: "News", content: "", author: "SYNTHRIX TEAM", status: "draft" });
  };

  return (
    <div>
      <div className="mb-4" style={{ fontSize: "9px", letterSpacing: "5px", color: "rgba(139,92,246,0.5)" }}>// BLOG MANAGER</div>
      <div className="p-5 mb-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(139,92,246,0.20)" }}>
        {[
          { key: "title",    label: "TITLE",    ph: "Post Title",       multi: false },
          { key: "category", label: "CATEGORY", ph: "News/Update/...",  multi: false },
          { key: "author",   label: "AUTHOR",   ph: "Author Name",      multi: false },
          { key: "content",  label: "CONTENT",  ph: "Post content...",  multi: true  },
        ].map(({ key, label, ph, multi }) => (
          <div key={key} className="mb-3">
            <div className="mb-1" style={{ fontSize: "8px", letterSpacing: "2px", color: "rgba(226,232,228,0.35)" }}>{label}</div>
            {multi
              ? <textarea value={(form as Record<string, string>)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} rows={5}
                  className="w-full px-3 py-2 resize-none" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.25)", color: "#e2e8e4", fontFamily: "'Courier New',monospace", fontSize: "11px", outline: "none" }} />
              : <input value={(form as Record<string, string>)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph}
                  className="w-full px-3 py-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.25)", color: "#e2e8e4", fontFamily: "'Courier New',monospace", fontSize: "11px", outline: "none" }} />
            }
          </div>
        ))}
        <div className="flex gap-3 mt-2">
          <button onClick={add} style={{ fontFamily: "'Courier New',monospace", fontSize: "9px", letterSpacing: "3px", padding: "8px 20px", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.40)", color: "rgba(139,92,246,0.9)", cursor: "pointer" }}>
            SAVE DRAFT
          </button>
          <button onClick={() => { setForm(f => ({ ...f, status: "published" })); setTimeout(add, 0); }}
            style={{ fontFamily: "'Courier New',monospace", fontSize: "9px", letterSpacing: "3px", padding: "8px 20px", background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.30)", color: "rgba(34,197,94,0.8)", cursor: "pointer" }}>
            PUBLISH
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {posts.map(p => (
          <div key={p.id} className="flex items-center justify-between p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(139,92,246,0.15)" }}>
            <div>
              <div style={{ fontSize: "12px", letterSpacing: "1px", color: "#e2e8e4" }}>{p.title}</div>
              <div style={{ fontSize: "9px", letterSpacing: "2px", color: "rgba(226,232,228,0.35)" }}>{p.category} · {p.date} · {p.status.toUpperCase()}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => save(posts.map(x => x.id === p.id ? { ...x, status: x.status === "published" ? "draft" : "published" } : x))}
                style={{ fontSize: "8px", letterSpacing: "2px", color: p.status === "published" ? "rgba(245,166,35,0.8)" : "rgba(34,197,94,0.8)", background: "none", border: `1px solid ${p.status === "published" ? "rgba(245,166,35,0.25)" : "rgba(34,197,94,0.25)"}`, padding: "4px 8px", cursor: "pointer", fontFamily: "'Courier New',monospace" }}>
                {p.status === "published" ? "UNPUBLISH" : "PUBLISH"}
              </button>
              <button onClick={() => save(posts.filter(x => x.id !== p.id))} style={{ fontSize: "8px", letterSpacing: "2px", color: "rgba(239,68,68,0.6)", background: "none", border: "1px solid rgba(239,68,68,0.2)", padding: "4px 8px", cursor: "pointer", fontFamily: "'Courier New',monospace" }}>
                DELETE
              </button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <div style={{ fontSize: "10px", letterSpacing: "3px", color: "rgba(226,232,228,0.2)", padding: "24px", textAlign: "center" }}>NO POSTS YET</div>}
      </div>
    </div>
  );
}

interface AIProps {
  aiHistory: { role: string; content: string }[];
  aiInput: string;
  setAiInput: (v: string) => void;
  aiTyping: boolean;
  onSend: () => void;
  chatRef: React.RefObject<HTMLDivElement | null>;
}
function AIPanel({ aiHistory, aiInput, setAiInput, aiTyping, onSend, chatRef }: AIProps) {
  return (
    <div>
      <div className="mb-4" style={{ fontSize: "9px", letterSpacing: "5px", color: "rgba(139,92,246,0.5)" }}>// AI TEAM — 10 SPECIALISTS · BACKEND-SECURED</div>
      <div className="mb-4 grid grid-cols-5 gap-2">
        {["ORACLE","SCOUT","SAGE","FORGE","JUDGE","HERALD","THINKER","SWIFT","WEAVER","NEXUS"].map(n => (
          <div key={n} className="p-2 text-center" style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.18)", fontSize: "8px", letterSpacing: "2px", color: "rgba(139,92,246,0.7)" }}>{n}</div>
        ))}
      </div>
      <div ref={chatRef} className="mb-3 overflow-y-auto flex flex-col gap-3 p-4" style={{ height: "360px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(139,92,246,0.18)" }}>
        {aiHistory.length === 0 && (
          <div style={{ fontSize: "10px", letterSpacing: "3px", color: "rgba(226,232,228,0.2)", margin: "auto", textAlign: "center" }}>
            ⚡ AI TEAM READY<br /><span style={{ fontSize: "9px" }}>3 SPECIALISTS AUTO-ASSIGNED PER TASK</span>
          </div>
        )}
        {aiHistory.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-lg p-3" style={{
              background: m.role === "user" ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${m.role === "user" ? "rgba(139,92,246,0.30)" : "rgba(255,255,255,0.08)"}`,
              fontSize: "12px", color: "#e2e8e4", lineHeight: 1.7, whiteSpace: "pre-wrap",
              fontFamily: m.role === "user" ? "'Courier New',monospace" : "inherit",
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {aiTyping && (
          <div className="flex gap-2 items-center" style={{ fontSize: "10px", letterSpacing: "3px", color: "rgba(139,92,246,0.6)" }}>
            <span className="animate-pulse">⚙</span> TEAM PROCESSING...
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <textarea value={aiInput} onChange={e => setAiInput(e.target.value)} rows={2} placeholder="Ask the AI team anything..."
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
          className="flex-1 px-3 py-2 resize-none" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.28)", color: "#e2e8e4", fontFamily: "'Courier New',monospace", fontSize: "11px", outline: "none" }} />
        <button onClick={onSend} disabled={aiTyping} style={{ fontFamily: "'Courier New',monospace", fontSize: "9px", letterSpacing: "3px", padding: "0 20px", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.40)", color: "rgba(139,92,246,0.9)", cursor: "pointer", opacity: aiTyping ? 0.5 : 1 }}>
          SEND
        </button>
      </div>
    </div>
  );
}

function DatabasePanel() {
  const visitors = JSON.parse(typeof window !== "undefined" ? localStorage.getItem("sx_users_v2") ?? "[]" : "[]");
  const admins   = JSON.parse(typeof window !== "undefined" ? localStorage.getItem(ADKEY) ?? "[]" : "[]");
  return (
    <div>
      <div className="mb-4" style={{ fontSize: "9px", letterSpacing: "5px", color: "rgba(139,92,246,0.5)" }}>// DATABASE VIEWER — CONTROLLER ACCESS ONLY</div>
      <div className="mb-6">
        <div className="mb-2" style={{ fontSize: "9px", letterSpacing: "3px", color: "rgba(226,232,228,0.4)" }}>VISITOR ACCOUNTS ({visitors.length})</div>
        <div className="flex flex-col gap-1 max-h-48 overflow-auto">
          {visitors.map((v: { username: string; createdAt: string }, i: number) => (
            <div key={i} className="px-3 py-2 flex justify-between" style={{ background: "rgba(255,255,255,0.02)", fontSize: "10px", letterSpacing: "1px", color: "rgba(226,232,228,0.5)" }}>
              <span>{v.username}</span><span>{v.createdAt}</span>
            </div>
          ))}
          {visitors.length === 0 && <div style={{ fontSize: "9px", letterSpacing: "2px", color: "rgba(226,232,228,0.2)", padding: "12px" }}>NO VISITORS</div>}
        </div>
      </div>
      <div>
        <div className="mb-2" style={{ fontSize: "9px", letterSpacing: "3px", color: "rgba(226,232,228,0.4)" }}>ADMIN ACCOUNTS ({admins.length})</div>
        <div className="flex flex-col gap-1 max-h-48 overflow-auto">
          {admins.map((a: { username: string; role: string; display: string }, i: number) => (
            <div key={i} className="px-3 py-2 flex justify-between" style={{ background: "rgba(255,255,255,0.02)", fontSize: "10px", letterSpacing: "1px", color: "rgba(226,232,228,0.5)" }}>
              <span>{a.username}</span><span>{a.role ?? a.display}</span>
            </div>
          ))}
          {admins.length === 0 && <div style={{ fontSize: "9px", letterSpacing: "2px", color: "rgba(226,232,228,0.2)", padding: "12px" }}>NO DYNAMIC ADMINS</div>}
        </div>
      </div>
    </div>
  );
}

function PlaceholderPanel({ name }: { name: string }) {
  return (
    <div style={{ fontSize: "10px", letterSpacing: "3px", color: "rgba(226,232,228,0.2)", padding: "40px", textAlign: "center" }}>
      // {name} — PANEL COMING SOON
    </div>
  );
}
