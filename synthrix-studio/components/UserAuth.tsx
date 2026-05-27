"use client";
import { useState, useCallback } from "react";

const SALT = "SX_USR_V1_2026";
const UKEY = "synthrix_users";
const SKEY = "synthrix_session";

export interface SUser {
  username: string;
  display:  string;
  hash:     string;
  joinDate: string;
  unit:     string;
  rp:       number;
}

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function loadUsers(): SUser[] {
  try { return JSON.parse(localStorage.getItem(UKEY) ?? "[]"); } catch { return []; }
}
function saveUsers(u: SUser[]) { localStorage.setItem(UKEY, JSON.stringify(u)); }

export function getSession(): SUser | null {
  try {
    const name = localStorage.getItem(SKEY);
    if (!name) return null;
    return loadUsers().find(u => u.username === name) ?? null;
  } catch { return null; }
}
export function endSession() { localStorage.removeItem(SKEY); }

export default function UserAuth({
  onLogin,
  onClose,
}: {
  onLogin: (u: SUser) => void;
  onClose: () => void;
}) {
  const [tab,  setTab]  = useState<"login" | "register">("login");
  const [user, setUser] = useState("");
  const [disp, setDisp] = useState("");
  const [pass, setPass] = useState("");
  const [err,  setErr]  = useState("");
  const [busy, setBusy] = useState(false);

  const switchTab = (t: "login" | "register") => { setTab(t); setErr(""); };

  const submit = useCallback(async () => {
    setErr("");
    const u = user.trim(), p = pass.trim(), d = disp.trim();
    if (!u || !p) { setErr("ALL FIELDS REQUIRED"); return; }
    if (tab === "register" && !d) { setErr("DISPLAY NAME REQUIRED"); return; }
    if (p.length < 6) { setErr("PASSWORD MIN 6 CHARACTERS"); return; }
    if (!/^[a-z0-9_]{3,20}$/i.test(u)) { setErr("USERNAME: 3-20 CHARS (A-Z 0-9 _)"); return; }
    setBusy(true);
    try {
      const hash  = await sha256(SALT + p);
      const users = loadUsers();
      if (tab === "login") {
        const found = users.find(x => x.username.toLowerCase() === u.toLowerCase() && x.hash === hash);
        if (!found) { setErr("INVALID CREDENTIALS"); setBusy(false); return; }
        localStorage.setItem(SKEY, found.username);
        onLogin(found);
      } else {
        if (users.find(x => x.username.toLowerCase() === u.toLowerCase())) {
          setErr("USERNAME ALREADY TAKEN"); setBusy(false); return;
        }
        const nu: SUser = {
          username: u.toUpperCase(),
          display:  d.toUpperCase(),
          hash,
          joinDate: new Date().toISOString().slice(0, 10),
          unit:     "recruit",
          rp:       0,
        };
        saveUsers([...users, nu]);
        localStorage.setItem(SKEY, nu.username);
        onLogin(nu);
      }
    } catch { setErr("SYSTEM ERROR — TRY AGAIN"); setBusy(false); }
  }, [tab, user, disp, pass, onLogin]);

  return (
    <div className="ua-ov" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ua-modal">
        <div className="ua-top-bar" />
        <button className="ua-close" onClick={onClose} aria-label="Close">×</button>

        <div className="ua-head">
          <div className="ua-logo">// SYNTHRIX STUDIO</div>
          <div className="ua-title">{tab === "login" ? "ACCESS PORTAL" : "ENLIST NOW"}</div>
        </div>

        <div className="ua-tabs">
          <button className={`ua-tab${tab === "login" ? " active" : ""}`} onClick={() => switchTab("login")}>
            LOGIN
          </button>
          <button className={`ua-tab${tab === "register" ? " active" : ""}`} onClick={() => switchTab("register")}>
            REGISTER
          </button>
        </div>

        <div className="ua-body">
          <div className="ua-field">
            <div className="ua-lbl">// USERNAME</div>
            <input
              className="ua-inp"
              type="text"
              value={user}
              onChange={e => setUser(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              placeholder="YOUR_CALLSIGN"
              autoComplete="username"
            />
          </div>

          {tab === "register" && (
            <div className="ua-field">
              <div className="ua-lbl">// DISPLAY NAME</div>
              <input
                className="ua-inp"
                type="text"
                value={disp}
                onChange={e => setDisp(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()}
                placeholder="HOW OTHERS SEE YOU"
              />
            </div>
          )}

          <div className="ua-field">
            <div className="ua-lbl">// PASSWORD</div>
            <input
              className="ua-inp"
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              placeholder="••••••••"
              autoComplete={tab === "login" ? "current-password" : "new-password"}
            />
          </div>

          {err && <div className="ua-err">▶ {err}</div>}

          <button className="ua-btn" onClick={submit} disabled={busy}>
            {busy ? "AUTHENTICATING..." : tab === "login" ? "▶ ACCESS GRANTED" : "▶ ENLIST NOW"}
          </button>

          <div className="ua-note">
            {tab === "login"
              ? "NO ACCOUNT YET?  SWITCH TO REGISTER TAB"
              : "ALREADY ENLISTED?  SWITCH TO LOGIN TAB"}
            <br />
            <span style={{ color: "rgba(237,232,223,0.10)" }}>
              SYNTHRIX STUDIO · VANGUARD NETWORK · 2025
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
