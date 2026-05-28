"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const SALT="SX_MC_SALT_V2_2026",SKEY="sx_mc_ses",EKEY="sx_users_v2",ADKEY="sx_admin_accounts";
const AKEY="sx_announcements",PKEY="sx_posts",GKEY="sx_custom_games",CKEY="sx_custom_achievements";
const MSGKEY="sx_messages",THKEY="sx_theme",NEKEY="sx_nav_items",ANKEY="sx_analytics";
const PBKEY="sx_pages",SNKEY="sx_snippets",FKEY="sx_mc_fails",LKEY="sx_mc_lock";
const AHKEY="sx_ai_history";
const MAX=5, WAIT=15*60*1000;

const ADMIN_DB=[
  {u:"suvom",p:"",h:"e4eb3a4797313b91b9b64bf843b10ec84c66d35ef7b1908f5f69560d8fc98146",display:"SUVOM",role:"SYSTEM",level:"system"},
  {u:"taman",p:"a123456",h:"73d4532c1929d708b10c924e0f0aff4ac60ea514987e8e93dcce3f1213a292ca",display:"TAMAN",role:"SYSTEM",level:"controller"},
];

async function sha256(p:string){
  const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(p+SALT));
  return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("");
}

function ls<T>(k:string,fb:T):T{
  if(typeof window==="undefined")return fb;
  try{const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}catch{return fb;}
}
function lsSet(k:string,v:unknown){
  if(typeof window==="undefined")return;
  localStorage.setItem(k,JSON.stringify(v));
  /* Background sync to Python backend — never blocks UI */
  fetch("/api/internal/store",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key:k,value:v})}).catch(()=>{});
}
async function bootstrapFromBackend(){
  try{
    const res=await fetch("/api/internal/store",{signal:AbortSignal.timeout(5000)});
    if(!res.ok)return;
    const all=await res.json() as Record<string,unknown>;
    /* Restore all sx_ keys — skip security / session keys */
    const skip=new Set([SKEY,FKEY,LKEY,"sx_login_count","sx_achievements"]);
    Object.entries(all).forEach(([k,v])=>{if(k.startsWith("sx_")&&!skip.has(k))localStorage.setItem(k,JSON.stringify(v));});
  }catch{/* backend not deployed yet — fine */}
}

type Phase="boot"|"login"|"dashboard";
type Panel="overview"|"ai"|"messages"|"employees"|"roster"|"announce"|"games"|"achievements"|"posts"|"editor"|"pagebuilder"|"naveditor"|"theme"|"analytics"|"roles"|"database"|"controls";
type Admin={u:string;display:string;role:string;level:string};

export default function AdminPanel(){
  const [phase,setPhase]=useState<Phase>("boot");
  const [bootLine,setBootLine]=useState("LOADING...");
  const [admin,setAdmin]=useState<Admin|null>(null);
  const [panel,setPanel]=useState<Panel>("overview");
  /* login state */
  const [uInput,setUInput]=useState("");
  const [pInput,setPInput]=useState("");
  const [loginErr,setLoginErr]=useState("");
  const [loginLocked,setLoginLocked]=useState("");
  const [loginTries,setLoginTries]=useState("");
  const [loginBusy,setLoginBusy]=useState(false);
  /* toast */
  const [toast,setToast]=useState("");
  const toastRef=useRef<ReturnType<typeof setTimeout>|null>(null);

  const notify=useCallback((msg:string)=>{
    setToast(msg);
    if(toastRef.current)clearTimeout(toastRef.current);
    toastRef.current=setTimeout(()=>setToast(""),3200);
  },[]);

  /* boot */
  useEffect(()=>{
    const ses=sessionStorage.getItem(SKEY);
    if(ses){
      try{
        const d=JSON.parse(atob(ses));
        const a=ADMIN_DB.find(x=>x.u===d.u);
        if(a){setBootLine("SESSION RESTORED — LOADING DASHBOARD...");setTimeout(()=>{setAdmin(a);setPhase("dashboard");},700);return;}
      }catch{sessionStorage.removeItem(SKEY);}
    }
    setBootLine("NO ACTIVE SESSION — LOADING LOGIN...");
    setTimeout(()=>setPhase("login"),900);
  },[]);

  /* lockout helpers */
  function isLocked(){
    if(typeof window==="undefined")return false;
    const t=localStorage.getItem(LKEY);
    if(!t)return false;
    if(Date.now()-+t<WAIT)return true;
    localStorage.removeItem(LKEY);localStorage.removeItem(FKEY);return false;
  }
  function minsLeft(){return Math.ceil((WAIT-(Date.now()-+(localStorage.getItem(LKEY)||"0")))/60000);}
  function updateLockUI(){
    if(isLocked()){
      setLoginLocked(`LOCKED — TRY AGAIN IN ${minsLeft()} MINUTE${minsLeft()!==1?"S":""}`);
      setLoginTries("");
    } else {
      setLoginLocked("");
    }
  }

  /* achievements on login */
  function onLoginSuccess(dn:string){
    sessionStorage.setItem("sx_user",dn);
    const lc=parseInt(localStorage.getItem("sx_login_count")??"0")+1;
    localStorage.setItem("sx_login_count",String(lc));
    const yr=String(new Date().getFullYear());
    const ua=(id:string,title:string,icon:string,desc:string)=>{
      type AR={id:string;title:string;icon:string;desc:string;date:string;unlocked:boolean};
      const raw:AR[]=JSON.parse(localStorage.getItem("sx_achievements")??"[]");
      if(!raw.find(a=>a.id===id)){raw.push({id,title,icon,desc,date:yr,unlocked:true});localStorage.setItem("sx_achievements",JSON.stringify(raw));}
    };
    if(lc===1)ua("logged_in","ACCESS GRANTED","🔐","First access to Mission Control.");
    if(lc>=2) ua("comeback","RETURNING SIGNAL","📡","Logged in more than once.");
    if(lc>=5) ua("dedicated","SWORN OPERATOR","⚔️","Five or more logins. True dedication.");
    /* Pull latest data from backend into localStorage */
    bootstrapFromBackend();
  }

  async function doLogin(){
    if(loginBusy)return;
    setLoginErr("");
    if(isLocked()){updateLockUI();return;}
    const u=uInput.trim().toLowerCase();
    const p=pInput;
    if(!u||!p){setLoginErr("ENTER USERNAME AND PASSWORD");return;}
    setLoginBusy(true);
    await new Promise(r=>setTimeout(r,550));
    const h=await sha256(p);
    let found:Admin|null=null;
    const sta=ADMIN_DB.find(a=>a.u===u&&a.h===h);
    if(sta)found={u:sta.u,display:sta.display,role:sta.role,level:sta.level};
    if(!found){
      const dynAccs=ls<{u:string;display:string;passHash:string;level:string}[]>(ADKEY,[]);
      const dyn=dynAccs.find(a=>a.u===u&&a.passHash===h);
      if(dyn)found={u:dyn.u,display:dyn.display,role:dyn.level.toUpperCase(),level:dyn.level};
    }
    setLoginBusy(false);
    if(!found){
      const f=+(localStorage.getItem(FKEY)||"0")+1;
      localStorage.setItem(FKEY,String(f));
      if(f>=MAX)localStorage.setItem(LKEY,String(Date.now()));
      if(isLocked()){
        setLoginErr("ACCOUNT LOCKED — TOO MANY FAILED ATTEMPTS");
        updateLockUI();
      } else {
        setLoginErr(`ACCESS DENIED — ${MAX-f} ATTEMPT${MAX-f!==1?"S":""} REMAINING`);
        setLoginTries(`ATTEMPT ${f} / ${MAX}`);
      }
      return;
    }
    localStorage.removeItem(FKEY);localStorage.removeItem(LKEY);
    sessionStorage.setItem(SKEY,btoa(JSON.stringify({u:found.u,t:Date.now()})));
    setAdmin(found);
    onLoginSuccess(found.display);
    setPhase("dashboard");
  }

  function signOut(){
    if(!confirm("Sign out of Mission Control?"))return;
    sessionStorage.removeItem(SKEY);
    setAdmin(null);setPhase("login");setUInput("");setPInput("");
  }

  /* ── BOOT ── */
  if(phase==="boot") return (
    <div className="mc-root">
      <div className="boot">
        <div className="bl" style={{animationDelay:".1s",color:"rgba(34,197,94,0.85)",fontSize:"12px",letterSpacing:"5px",fontWeight:"bold"}}>SYNTHRIX MISSION CONTROL</div>
        <div className="bl" style={{animationDelay:".3s"}}>INITIALIZING SECURE SESSION...</div>
        <div className="bl" style={{animationDelay:".6s"}}>VERIFYING ACCESS CREDENTIALS...</div>
        <div className="bl" style={{animationDelay:".9s"}}>{bootLine}</div>
      </div>
    </div>
  );

  /* ── LOGIN ── */
  if(phase==="login") return (
    <div className="mc-root">
      <div className="login">
        <div className="lw">
          <div className="l-topbar"/>
          <div className="l-c tl"/><div className="l-c tr"/>
          <div className="l-c bl"/><div className="l-c br"/>
          <div className="l-head">
            <div className="l-tag">// SYNTHRIX STUDIO &nbsp;·&nbsp; INTERNAL SYSTEM</div>
            <div className="l-title">MISSION CONTROL</div>
            <div className="l-sub">AUTHORIZED PERSONNEL ONLY</div>
          </div>
          <div className="l-body">
            <label className="l-lbl" htmlFor="li-u">USERNAME</label>
            <input className="l-inp" id="li-u" type="text" placeholder="username" autoComplete="off" spellCheck={false}
              value={uInput} onChange={e=>setUInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
            <label className="l-lbl" htmlFor="li-p">PASSWORD</label>
            <input className="l-inp" id="li-p" type="password" placeholder="••••••••••••"
              value={pInput} onChange={e=>setPInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
            <button className="l-btn" onClick={doLogin} disabled={loginBusy||isLocked()}>
              {loginBusy?"// VERIFYING...":"▶  AUTHENTICATE"}
            </button>
            {loginErr&&<div className="l-err">{loginErr}</div>}
            {loginLocked&&<div className="l-locked">{loginLocked}</div>}
            {loginTries&&<div className="l-tries">{loginTries}</div>}
          </div>
        </div>
      </div>
    </div>
  );

  /* ── DASHBOARD ── */
  const isCtrl=admin&&(admin.level==="controller"||admin.level==="system");
  const roleColors:Record<string,string>={SYSTEM:"#b48cff",CONTROLLER:"#ff6464","SUPER ADMIN":"#F5A623",EDITOR:"#00C9B8",MODERATOR:"#8B5CF6"};
  const roleColor=roleColors[admin?.role||""]||"rgba(226,232,228,0.42)";

  const navItems:[string,string,Panel][]=[
    ["⬡","OVERVIEW","overview"],["🤖","AI AGENT","ai"],["💬","MESSAGES","messages"],
    ["👤","EMPLOYEES","employees"],["🎖️","ROSTER","roster"],["📡","ANNOUNCEMENTS","announce"],
    ["🎮","GAMES","games"],["🏆","ACHIEVEMENTS","achievements"],["📰","BLOG / POSTS","posts"],
    ["📝","CONTENT EDITOR","editor"],["📄","PAGE BUILDER","pagebuilder"],
    ["🔗","NAV EDITOR","naveditor"],["🎨","THEME","theme"],["📊","ANALYTICS","analytics"],
    ["🧑‍💼","ROLES","roles"],
    ...(isCtrl?[["🗄️","DATABASE","database"] as [string,string,Panel]]:[]),
    ["⚙️","SITE CONTROLS","controls"],
  ];

  return (
    <div className="mc-root">
      <div className="dashboard">
        {/* SIDEBAR */}
        <div className="sb">
          <div className="sb-logo">
            <div className="sb-tag">// MISSION CONTROL</div>
            <div className="sb-name">SYNTH<span>RIX</span></div>
            <div className="sb-sub">INTERNAL SYSTEM V2</div>
          </div>
          <div className="sb-user">
            <div className="sb-dot"/>
            <div>
              <div className="sb-uname">{admin?.display}</div>
              <div className="sb-urole" style={{color:roleColor}}>{admin?.role}</div>
            </div>
          </div>
          <nav className="sb-nav">
            {navItems.map(([ico,label,id])=>(
              <button key={id} className={`sb-item${panel===id?" on":""}`} onClick={()=>setPanel(id)}>
                <span className="sb-ico">{ico}</span>{label}
                {id==="ai"&&<span style={{fontSize:"6px",letterSpacing:"2px",padding:"1px 5px",background:"linear-gradient(90deg,rgba(139,92,246,0.40),rgba(0,201,184,0.30))",borderRadius:"2px",marginLeft:"6px",color:"#fff"}}>BETA</span>}
              </button>
            ))}
          </nav>
          <div className="sb-signout">
            <button className="sb-so-btn" onClick={signOut}>▶ SIGN OUT</button>
          </div>
        </div>

        {/* MAIN */}
        <div className="db-main">
          {panel==="overview"    && <PanelOverview admin={admin!} notify={notify}/>}
          {panel==="ai"          && <PanelAI notify={notify}/>}
          {panel==="messages"    && <PanelMessages admin={admin!} notify={notify}/>}
          {panel==="employees"   && <PanelEmployees notify={notify}/>}
          {panel==="roster"      && <PanelRoster notify={notify}/>}
          {panel==="announce"    && <PanelAnnounce notify={notify}/>}
          {panel==="games"       && <PanelGames notify={notify}/>}
          {panel==="achievements"&& <PanelAchievements notify={notify}/>}
          {panel==="posts"       && <PanelPosts notify={notify}/>}
          {panel==="editor"      && <PanelEditor notify={notify}/>}
          {panel==="pagebuilder" && <PanelPageBuilder notify={notify}/>}
          {panel==="naveditor"   && <PanelNavEditor notify={notify}/>}
          {panel==="theme"       && <PanelTheme notify={notify}/>}
          {panel==="analytics"   && <PanelAnalytics/>}
          {panel==="roles"       && <PanelRoles notify={notify}/>}
          {panel==="database"    && isCtrl && <PanelDatabase notify={notify}/>}
          {panel==="controls"    && <PanelControls notify={notify}/>}
        </div>
      </div>

      {/* TOAST */}
      <div className={`mc-toast${toast?" show":""}`}>{toast}</div>
    </div>
  );
}

/* ═══════════════════════════ OVERVIEW ══════════════════════════════ */
function PanelOverview({admin,notify:_n}:{admin:Admin;notify:(m:string)=>void}){
  const [admins,setAdmins]=useState<{display:string;loginCount:number}[]>([]);
  const [visitors,setVisitors]=useState<{displayName:string;email:string;loginCount:number}[]>([]);
  const [anns,setAnns]=useState<unknown[]>([]);
  useEffect(()=>{
    setAdmins(ls(ADKEY,[]));
    setVisitors(ls(EKEY,[]));
    setAnns(ls(AKEY,[]));
  },[]);
  const top=visitors.filter(u=>u.loginCount>0).sort((a,b)=>b.loginCount-a.loginCount).slice(0,6);
  return (
    <div>
      <div className="p-tag">// SYSTEM STATUS</div>
      <div className="p-title">OVERVIEW <span>· ONLINE</span></div>
      <div className="stat-cards">
        {[
          {v:admins.length+2,l:"ADMIN ACCOUNTS"},
          {v:visitors.length,l:"WEBSITE USERS"},
          {v:anns.length,l:"ANNOUNCEMENTS"},
          {v:new Date().toLocaleDateString("en-GB"),l:"SESSION DATE",sm:true},
        ].map(({v,l,sm})=>(
          <div key={l} className="sc">
            <div className="sc-v" style={sm?{fontSize:"14px",marginTop:"6px"}:{}}>{v}</div>
            <div className="sc-l">{l}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title">// WELCOME, {admin.display}</div>
        <div style={{fontSize:"9px",letterSpacing:"2px",color:"var(--muted)",marginBottom:"8px"}}>
          RANK: {admin.role} · SYNTHRIX MISSION CONTROL
        </div>
      </div>
      <div className="card">
        <div className="card-title">// RECENT EMPLOYEE ACTIVITY</div>
        {top.length
          ? top.map((u,i)=>(
              <div key={i} style={{fontSize:"10px",color:"var(--muted)",lineHeight:"2.4",letterSpacing:".5px"}}>
                ■ <span style={{color:"var(--green)"}}>{u.displayName}</span> &nbsp;—&nbsp; {u.loginCount} login{u.loginCount!==1?"s":""} <span style={{fontSize:"9px"}}>&nbsp;·&nbsp; {u.email}</span>
              </div>
            ))
          : <div style={{fontSize:"10px",color:"var(--muted)"}}>No employee logins recorded yet.</div>
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════ EMPLOYEES ═════════════════════════════ */
type DynAdmin={id:string;u:string;display:string;passHash:string;level:string;createdAt:number;loginCount:number};
function PanelEmployees({notify}:{notify:(m:string)=>void}){
  const [accs,setAccs]=useState<DynAdmin[]>([]);
  const [eu,setEu]=useState("");const [en,setEn]=useState("");const [ep,setEp]=useState("");const [elv,setElv]=useState("superadmin");
  const [err,setErr]=useState("");
  useEffect(()=>setAccs(ls(ADKEY,[])),[]);
  const levelBadge=(l:string)=>l==="controller"?"role-badge-ctrl":l==="editor"?"role-badge-ed":"role-badge-mo";
  async function create(){
    setErr("");
    const username=eu.trim().toLowerCase().replace(/\s+/g,"");
    const name=en.trim();
    if(!username)return setErr("USERNAME REQUIRED");
    if(!name)return setErr("DISPLAY NAME REQUIRED");
    if(ep.length<6)return setErr("PASSWORD TOO SHORT — MIN 6 CHARS");
    if(ADMIN_DB.find(a=>a.u===username))return setErr("USERNAME ALREADY EXISTS IN SYSTEM");
    if(accs.find(a=>a.u===username))return setErr("USERNAME ALREADY EXISTS");
    const hh=await sha256(ep);
    const na=[...accs,{id:Date.now().toString(36)+Math.random().toString(36).slice(2),u:username,display:name.toUpperCase(),passHash:hh,level:elv,createdAt:Date.now(),loginCount:0}];
    setAccs(na);lsSet(ADKEY,na);
    setEu("");setEn("");setEp("");
    notify("ADMIN ACCOUNT CREATED: "+name.toUpperCase()+" ["+elv.toUpperCase()+"]");
  }
  function del(id:string){
    if(!confirm("Remove this admin account permanently?"))return;
    const na=accs.filter(a=>a.id!==id);setAccs(na);lsSet(ADKEY,na);notify("ADMIN ACCOUNT REMOVED");
  }
  return (
    <div>
      <div className="p-tag">// ADMIN ACCOUNT MANAGEMENT</div>
      <div className="p-title">ADMIN <span>ACCOUNTS</span></div>
      <div style={{fontSize:"9px",letterSpacing:"2px",color:"rgba(255,100,100,0.60)",padding:"10px 14px",background:"rgba(255,80,80,0.05)",border:"1px solid rgba(255,80,80,0.15)",borderRadius:"2px",marginBottom:"14px",lineHeight:"1.9"}}>
        ■ THESE ACCOUNTS ARE FOR <strong style={{color:"rgba(255,100,100,0.85)"}}>INTERNAL ADMIN PANEL ACCESS ONLY</strong><br/>
        ■ WEBSITE VISITOR ACCOUNTS ARE SEPARATE
      </div>
      <div className="card">
        <div className="card-title">// CREATE ADMIN ACCOUNT</div>
        <div className="frow">
          <div className="fg" style={{margin:0}}><label>USERNAME (for login)</label><input className="fi" type="text" placeholder="e.g. lkplayz" autoComplete="off" value={eu} onChange={e=>setEu(e.target.value)}/></div>
          <div className="fg" style={{margin:0}}><label>DISPLAY NAME / CALLSIGN</label><input className="fi" type="text" placeholder="e.g. LK PLAYZ" value={en} onChange={e=>setEn(e.target.value)}/></div>
        </div>
        <div className="frow" style={{marginTop:"11px"}}>
          <div className="fg" style={{margin:0}}><label>PASSWORD (min 6 chars)</label><input className="fi" type="password" placeholder="••••••••••" value={ep} onChange={e=>setEp(e.target.value)}/></div>
          <div className="fg" style={{margin:0}}><label>ADMIN LEVEL</label>
            <select className="fsel" value={elv} onChange={e=>setElv(e.target.value)}>
              <option value="superadmin">SUPER ADMIN — Full access, all panels</option>
              <option value="controller">CONTROLLER — Full access + database</option>
              <option value="editor">EDITOR — Content panels only</option>
              <option value="moderator">MODERATOR — Announcements + forms only</option>
            </select>
          </div>
        </div>
        <div style={{marginTop:"13px"}}><button className="btn p" onClick={create}>▶ CREATE ADMIN ACCOUNT</button></div>
        {err&&<div className="err-msg">{err}</div>}
      </div>
      <div className="card">
        <div className="card-title">// ACTIVE ADMIN ACCOUNTS</div>
        <table className="t"><thead><tr><th>USERNAME</th><th>DISPLAY NAME</th><th>LEVEL</th><th>LOGINS</th><th>CREATED</th><th></th></tr></thead>
        <tbody>
          {accs.length ? accs.map(a=>(
            <tr key={a.id}>
              <td style={{color:"var(--green)",fontFamily:"Courier New,monospace"}}>{a.u}</td>
              <td style={{color:"var(--white)"}}>{a.display}</td>
              <td><span className={`badge ${levelBadge(a.level)}`} style={{fontSize:"7px",letterSpacing:"2px",padding:"3px 8px"}}>{(a.level||"editor").toUpperCase()}</span></td>
              <td style={{color:"var(--green)"}}>{a.loginCount||0}</td>
              <td style={{color:"var(--muted)",fontSize:"8px"}}>{new Date(a.createdAt).toLocaleDateString("en-GB")}</td>
              <td><button className="btn d" style={{fontSize:"7px",padding:"4px 8px"}} onClick={()=>del(a.id)}>REMOVE</button></td>
            </tr>
          )) : <tr><td colSpan={6} style={{color:"var(--muted)",fontSize:"9px",letterSpacing:"2px"}}>NO ADMIN ACCOUNTS CREATED YET</td></tr>}
        </tbody></table>
      </div>
    </div>
  );
}

/* ═══════════════════════════ ROSTER ════════════════════════════════ */
type RosterMember={id:string;name:string;role:string;unit:string;rp:number;status:string;notes:string;joined:string};
const RP_PRESETS=[5,10,25,50];
const STATUS_COLORS:Record<string,string>={active:"var(--green)",inactive:"var(--muted)",on_leave:"var(--gold)",suspended:"var(--red)"};
function PanelRoster({notify}:{notify:(m:string)=>void}){
  const [members,setMembers]=useState<RosterMember[]>([]);
  const [loading,setLoading]=useState(true);
  const [adding,setAdding]=useState(false);
  const [editId,setEditId]=useState<string|null>(null);
  const [nm,setNm]=useState("");const [nr,setNr]=useState("");
  const [nu,setNu]=useState("");const [ns,setNs]=useState("active");const [nn,setNn]=useState("");
  const [err,setErr]=useState("");
  const [rpDelta,setRpDelta]=useState(10);const [search,setSearch]=useState("");

  async function load(){
    try{
      const res=await fetch("/api/internal/roster",{signal:AbortSignal.timeout(5000)});
      if(res.ok){const data=await res.json() as RosterMember[];setMembers(data);lsSet("sx_roster",data);return;}
    }catch{}
    setMembers(ls<RosterMember[]>("sx_roster",[]));
  }
  useEffect(()=>{load().finally(()=>setLoading(false));},[]);

  async function addMember(){
    setErr("");if(!nm.trim())return setErr("NAME REQUIRED");
    const payload={name:nm.trim().toUpperCase(),role:nr.trim().toUpperCase(),unit:nu.trim().toUpperCase(),status:ns,notes:nn.trim(),rp:0};
    try{
      const res=await fetch("/api/internal/roster",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      if(res.ok){const m=await res.json() as RosterMember;const upd=[...members,m];setMembers(upd);lsSet("sx_roster",upd);notify("MEMBER ADDED");resetForm();return;}
    }catch{}
    const local:RosterMember={id:Date.now().toString(),...payload,joined:new Date().toISOString()};
    const upd=[...members,local];setMembers(upd);lsSet("sx_roster",upd);notify("MEMBER ADDED (LOCAL)");resetForm();
  }

  function resetForm(){setNm("");setNr("");setNu("");setNs("active");setNn("");setAdding(false);setEditId(null);}

  function startEdit(m:RosterMember){setEditId(m.id);setNm(m.name);setNr(m.role);setNu(m.unit);setNs(m.status);setNn(m.notes);setAdding(false);}

  async function saveEdit(){
    if(!editId)return;
    const changes={name:nm.trim().toUpperCase(),role:nr.trim().toUpperCase(),unit:nu.trim().toUpperCase(),status:ns,notes:nn.trim()};
    fetch(`/api/internal/roster/${editId}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(changes)}).catch(()=>{});
    const upd=members.map(m=>m.id===editId?{...m,...changes}:m);setMembers(upd);lsSet("sx_roster",upd);notify("MEMBER UPDATED");resetForm();
  }

  async function adjustRP(id:string,delta:number){
    try{
      const res=await fetch(`/api/internal/roster/${id}/rp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({delta})});
      if(res.ok){const {rp}=await res.json() as {rp:number};const upd=members.map(m=>m.id===id?{...m,rp}:m);setMembers(upd);lsSet("sx_roster",upd);notify(`RP ${delta>0?"+":""}${delta}`);return;}
    }catch{}
    const upd=members.map(m=>m.id===id?{...m,rp:Math.max(0,m.rp+delta)}:m);setMembers(upd);lsSet("sx_roster",upd);notify(`RP ${delta>0?"+":""}${delta}`);
  }

  async function removeMember(id:string){
    if(!confirm("Remove this member?"))return;
    fetch(`/api/internal/roster/${id}`,{method:"DELETE"}).catch(()=>{});
    const upd=members.filter(m=>m.id!==id);setMembers(upd);lsSet("sx_roster",upd);notify("MEMBER REMOVED");
  }

  const filtered=members.filter(m=>!search||m.name.toLowerCase().includes(search.toLowerCase())||m.role.toLowerCase().includes(search.toLowerCase())||m.unit.toLowerCase().includes(search.toLowerCase()));
  const sorted=[...filtered].sort((a,b)=>b.rp-a.rp);

  const FormPanel=({isEdit}:{isEdit:boolean})=>(
    <div className="roster-form">
      <div className="frow">
        <div className="fg" style={{margin:0}}><label>NAME</label><input className="fi" type="text" placeholder="TAMAN" value={nm} onChange={e=>setNm(e.target.value)}/></div>
        <div className="fg" style={{margin:0}}><label>ROLE</label><input className="fi" type="text" placeholder="DEVELOPER" value={nr} onChange={e=>setNr(e.target.value)}/></div>
      </div>
      <div className="frow" style={{marginTop:"8px"}}>
        <div className="fg" style={{margin:0}}><label>UNIT</label><input className="fi" type="text" placeholder="CORE" value={nu} onChange={e=>setNu(e.target.value)}/></div>
        <div className="fg" style={{margin:0}}><label>STATUS</label>
          <select className="fsel" value={ns} onChange={e=>setNs(e.target.value)}>
            <option value="active">ACTIVE</option><option value="inactive">INACTIVE</option>
            <option value="on_leave">ON LEAVE</option><option value="suspended">SUSPENDED</option>
          </select>
        </div>
      </div>
      <div className="fg" style={{marginTop:"8px"}}><label>NOTES</label><input className="fi" type="text" placeholder="Optional notes..." value={nn} onChange={e=>setNn(e.target.value)}/></div>
      {err&&<div className="err-msg">{err}</div>}
      <div style={{display:"flex",gap:"8px",marginTop:"10px"}}>
        <button className="btn p" onClick={isEdit?saveEdit:addMember}>▶ {isEdit?"SAVE CHANGES":"CONFIRM ADD"}</button>
        <button className="btn outline" onClick={resetForm}>CANCEL</button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="p-tag">// VANGUARD NETWORK</div>
      <div className="p-title">TEAM <span>ROSTER</span></div>

      {/* ── RP DELTA SELECTOR ── */}
      <div className="card" style={{marginBottom:"12px"}}>
        <div className="card-title">// RESPECT POINT INCREMENT</div>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginTop:"8px"}}>
          {RP_PRESETS.map(v=>(
            <button key={v} className={`btn${rpDelta===v?" p":" outline"}`}
              style={{fontSize:"9px",padding:"4px 14px",letterSpacing:"2px"}}
              onClick={()=>setRpDelta(v)}>
              {v} RP
            </button>
          ))}
          <input type="number" min={1} max={9999} value={rpDelta}
            onChange={e=>setRpDelta(Math.max(1,+e.target.value))}
            className="fi" style={{width:"80px",padding:"4px 10px",fontSize:"11px"}}/>
        </div>
      </div>

      {/* ── MEMBER LIST ── */}
      <div className="card" style={{marginBottom:"12px"}}>
        <div className="card-title" style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"8px"}}>
          <span>// MEMBERS — {members.length} TOTAL</span>
          <div style={{display:"flex",gap:"8px"}}>
            <input className="fi" type="text" placeholder="SEARCH..." value={search}
              onChange={e=>setSearch(e.target.value)}
              style={{padding:"3px 10px",fontSize:"9px",width:"120px"}}/>
            {!adding&&!editId&&<button className="btn p" style={{fontSize:"8px",padding:"4px 12px"}} onClick={()=>{setAdding(true);setEditId(null);}}>+ ADD</button>}
          </div>
        </div>

        {adding&&<FormPanel isEdit={false}/>}

        {loading?(
          <div style={{padding:"24px",textAlign:"center",fontSize:"9px",letterSpacing:"3px",color:"var(--muted)"}}>LOADING...</div>
        ):sorted.length===0?(
          <div style={{padding:"24px",textAlign:"center",fontSize:"9px",letterSpacing:"3px",color:"var(--muted)"}}>
            {search?"NO MATCHES":"NO MEMBERS YET — ADD THE FIRST"}
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:"6px",marginTop:"10px"}}>
            {sorted.map((m,i)=>(
              <div key={m.id}>
                <div className="roster-row">
                  <div className="roster-rank">#{String(i+1).padStart(2,"0")}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="roster-name">{m.name}</div>
                    <div className="roster-meta">
                      {m.role&&<span>{m.role}</span>}
                      {m.unit&&<><span className="roster-dot">·</span><span>{m.unit}</span></>}
                      {m.notes&&<><span className="roster-dot">·</span><span style={{fontStyle:"italic"}}>{m.notes}</span></>}
                    </div>
                  </div>
                  {/* ── RP controls ── */}
                  <div className="roster-rp-col">
                    <button className="rp-btn" onClick={()=>adjustRP(m.id,-rpDelta)} title={`−${rpDelta} RP`}>−</button>
                    <div className="roster-rp">{m.rp}<span style={{fontSize:"6px",letterSpacing:"1px",color:"var(--muted)",display:"block",textAlign:"center"}}>RP</span></div>
                    <button className="rp-btn rp-add" onClick={()=>adjustRP(m.id,rpDelta)} title={`+${rpDelta} RP`}>+</button>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"5px"}}>
                    <span style={{fontSize:"7px",letterSpacing:"2px",color:STATUS_COLORS[m.status]||"var(--muted)"}}>● {m.status.replace("_"," ").toUpperCase()}</span>
                    <div style={{display:"flex",gap:"5px"}}>
                      <button className="btn outline" style={{fontSize:"6px",padding:"2px 7px"}} onClick={()=>startEdit(m)}>EDIT</button>
                      <button className="btn d" style={{fontSize:"6px",padding:"2px 7px"}} onClick={()=>removeMember(m.id)}>✕</button>
                    </div>
                  </div>
                </div>
                {editId===m.id&&<FormPanel isEdit={true}/>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════ ANNOUNCEMENTS ═════════════════════════ */
type Ann={id:number;title:string;body:string;cat:string;date:string};
function PanelAnnounce({notify}:{notify:(m:string)=>void}){
  const [anns,setAnns]=useState<Ann[]>([]);
  const [at,setAt]=useState("");const [ab,setAb]=useState("");const [ac,setAc]=useState("STUDIO UPDATE");
  useEffect(()=>setAnns(ls(AKEY,[])),[]);
  function post(){
    if(!at||!ab){notify("TITLE AND CONTENT REQUIRED");return;}
    const na=[{id:Date.now(),title:at,body:ab,cat:ac,date:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"2-digit"}).toUpperCase()},...anns];
    setAnns(na);lsSet(AKEY,na);setAt("");setAb("");notify("ANNOUNCEMENT POSTED");
  }
  function del(id:number){const na=anns.filter(a=>a.id!==id);setAnns(na);lsSet(AKEY,na);}
  return (
    <div>
      <div className="p-tag">// BROADCAST</div>
      <div className="p-title">ANNOUNCEMENTS <span>&amp; NEWS</span></div>
      <div className="card">
        <div className="card-title">// POST NEW ANNOUNCEMENT</div>
        <div className="frow">
          <div className="fg" style={{margin:0}}><label>TITLE</label><input className="fi" type="text" placeholder="Announcement title..." value={at} onChange={e=>setAt(e.target.value)}/></div>
          <div className="fg" style={{margin:0}}><label>CATEGORY</label>
            <select className="fsel" value={ac} onChange={e=>setAc(e.target.value)}>
              {["STUDIO UPDATE","GAME NEWS","RECRUITMENT","COLLABORATION","RELEASE","INTERNAL"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="fg" style={{marginTop:"11px"}}><label>CONTENT</label>
          <textarea className="fi" rows={5} style={{resize:"vertical"}} placeholder="Full announcement text..." value={ab} onChange={e=>setAb(e.target.value)}/>
        </div>
        <button className="btn p" style={{marginTop:"4px"}} onClick={post}>▶ POST ANNOUNCEMENT</button>
      </div>
      <div className="card">
        <div className="card-title">// POSTED ANNOUNCEMENTS</div>
        {anns.length ? anns.map(a=>(
          <div key={a.id} style={{padding:"13px 0",borderBottom:"1px solid var(--bord)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"6px"}}>
              <div><span className="badge g">{a.cat}</span>&nbsp;&nbsp;<span style={{fontSize:"10px",letterSpacing:"2px",color:"var(--white)"}}>{a.title}</span></div>
              <div style={{display:"flex",alignItems:"center",gap:"9px"}}>
                <span style={{fontSize:"7px",color:"var(--muted)",letterSpacing:"2px"}}>{a.date}</span>
                <button className="btn d" style={{fontSize:"6px",padding:"3px 7px"}} onClick={()=>del(a.id)}>DEL</button>
              </div>
            </div>
            <div style={{fontSize:"11px",color:"var(--muted)",lineHeight:"1.75",letterSpacing:".3px"}}>{a.body}</div>
          </div>
        )) : <div style={{color:"var(--muted)",fontSize:"9px",letterSpacing:"2px"}}>NO ANNOUNCEMENTS YET</div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════ GAMES ═════════════════════════════════ */
type Game={id:string;title:string;genre:string;desc:string;platform:string;status:string;link:string;size:string;thumb:string};
function PanelGames({notify}:{notify:(m:string)=>void}){
  const [games,setGames]=useState<Game[]>([]);
  const [gt,setGt]=useState("");const [gg,setGg]=useState("");const [gd,setGd]=useState("");
  const [gpl,setGpl]=useState("Windows PC");const [gs,setGs]=useState("live");
  const [gl,setGl]=useState("");const [gsz,setGsz]=useState("");
  const [gThumb,setGThumb]=useState("");const [err,setErr]=useState("");
  const fileRef=useRef<HTMLInputElement>(null);
  const [dragOver,setDragOver]=useState(false);
  useEffect(()=>setGames(ls(GKEY,[])),[]);
  function save(g:Game[]){setGames(g);lsSet(GKEY,g);}
  function add(){
    setErr("");if(!gt.trim())return setErr("GAME TITLE REQUIRED");
    const thumb=gThumb||gl;
    save([...games,{id:Date.now().toString(),title:gt.trim(),genre:gg,desc:gd,platform:gpl,status:gs,link:gl,size:gsz,thumb}]);
    setGt("");setGg("");setGd("");setGl("");setGsz("");setGThumb("");
    notify("GAME ADDED TO LIBRARY");
  }
  function handleFile(f:File|null){
    if(!f)return;const r=new FileReader();r.onload=ev=>setGThumb(ev.target?.result as string);r.readAsDataURL(f);
  }
  const statusBadge=(s:string)=>s==="live"?"badge g":s==="beta"?"badge o":"badge";
  const statusLabel=(s:string)=>s==="live"?"LIVE":s==="dev"?"IN DEV":s==="beta"?"BETA":"SOON";
  return (
    <div>
      <div className="p-tag">// GAME LIBRARY MANAGEMENT</div>
      <div className="p-title">GAMES <span>MANAGER</span></div>
      <div className="card">
        <div className="card-title">// ADD NEW GAME</div>
        <div className="frow">
          <div className="fg" style={{margin:0}}><label>GAME TITLE</label><input className="fi" type="text" placeholder="e.g. OVERDRIVE" value={gt} onChange={e=>setGt(e.target.value)}/></div>
          <div className="fg" style={{margin:0}}><label>GENRE / TYPE</label><input className="fi" type="text" placeholder="e.g. Arcade Racing" value={gg} onChange={e=>setGg(e.target.value)}/></div>
        </div>
        <div className="fg" style={{marginTop:"11px"}}>
          <label>THUMBNAIL — DRAG &amp; DROP, CLICK TO SELECT, OR PASTE URL</label>
          <div className={`drop-zone${dragOver?" drag-over":""}`}
            onDragOver={e=>{e.preventDefault();setDragOver(true);}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0]);}}
            onClick={()=>fileRef.current?.click()}>
            <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files?.[0]||null)}/>
            {gThumb
              ? <img src={gThumb} alt="" style={{maxHeight:"120px",objectFit:"cover",borderRadius:"2px",width:"100%"}}/>
              : <div style={{fontSize:"9px",letterSpacing:"3px",color:"var(--muted)"}}>▼ Drop image here or <span style={{color:"var(--green)"}}>click to browse</span></div>
            }
          </div>
          <input className="fi" type="text" placeholder="— or paste an image URL —" value={gl} onChange={e=>setGl(e.target.value)} style={{marginTop:"6px"}}/>
        </div>
        <div className="fg"><label>GAME DESCRIPTION</label>
          <textarea className="fi" rows={4} style={{resize:"vertical"}} placeholder="Describe the game..." value={gd} onChange={e=>setGd(e.target.value)}/>
        </div>
        <div className="frow">
          <div className="fg" style={{margin:0}}><label>PLATFORM</label>
            <select className="fsel" value={gpl} onChange={e=>setGpl(e.target.value)}>
              {["Windows PC","Android","Web (Browser)","Windows + Android","TBA"].map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="fg" style={{margin:0}}><label>STATUS</label>
            <select className="fsel" value={gs} onChange={e=>setGs(e.target.value)}>
              <option value="live">LIVE</option><option value="dev">IN DEVELOPMENT</option>
              <option value="soon">COMING SOON</option><option value="beta">BETA</option>
            </select>
          </div>
        </div>
        <div className="frow" style={{marginTop:"11px"}}>
          <div className="fg" style={{margin:0}}><label>DOWNLOAD / STORE LINK</label><input className="fi" type="url" placeholder="https://..." value={gl} onChange={e=>setGl(e.target.value)}/></div>
          <div className="fg" style={{margin:0}}><label>FILE SIZE (optional)</label><input className="fi" type="text" placeholder="e.g. 435 MB" value={gsz} onChange={e=>setGsz(e.target.value)}/></div>
        </div>
        <div style={{marginTop:"13px",display:"flex",gap:"10px"}}>
          <button className="btn p" onClick={add}>▶ ADD GAME TO LIBRARY</button>
          <button className="btn outline" onClick={()=>{setGt("");setGg("");setGd("");setGl("");setGsz("");setGThumb("");}}>CLEAR</button>
        </div>
        {err&&<div className="err-msg">{err}</div>}
      </div>
      <div className="card">
        <div className="card-title">// GAME LIBRARY &nbsp;<span style={{color:"var(--muted)",fontWeight:"normal",fontSize:"8px"}}>{games.length} GAME{games.length!==1?"S":""}</span></div>
        <div className="game-grid">
          {games.map(g=>(
            <div key={g.id} className="game-card-adm">
              {g.thumb
                ? <img className="gc-thumb" src={g.thumb} alt={g.title}/>
                : <div className="gc-thumb-placeholder">🎮</div>
              }
              <div className="gc-body">
                <div className="gc-status-row">
                  <span className={statusBadge(g.status)} style={{fontSize:"7px",letterSpacing:"2px",padding:"2px 7px"}}>{statusLabel(g.status)}</span>
                  <span style={{fontSize:"8px",color:"var(--muted)",letterSpacing:"2px"}}>{g.platform}</span>
                </div>
                <div className="gc-title-adm">{g.title}</div>
                <div className="gc-genre">{g.genre}</div>
                <div className="gc-desc">{g.desc}</div>
                <div className="gc-actions">
                  <button className="btn d" style={{fontSize:"7px",padding:"4px 8px"}} onClick={()=>save(games.filter(x=>x.id!==g.id))}>REMOVE</button>
                </div>
              </div>
            </div>
          ))}
          {games.length===0&&<div style={{color:"var(--muted)",fontSize:"9px",letterSpacing:"3px",padding:"24px"}}>NO GAMES ADDED YET</div>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ ACHIEVEMENTS ══════════════════════════ */
type Ach={id:string;icon:string;name:string;cat:string;desc:string;trigger:string};
function PanelAchievements({notify}:{notify:(m:string)=>void}){
  const [achs,setAchs]=useState<Ach[]>([]);
  const [aid,setAid]=useState("");const [aico,setAico]=useState("");const [an,setAn]=useState("");
  const [acat,setAcat]=useState("account");const [adesc,setAdesc]=useState("");const [atrig,setAtrig]=useState("");
  const [auEmail,setAuEmail]=useState("");const [auId,setAuId]=useState("");
  const [err,setErr]=useState("");const [auErr,setAuErr]=useState("");
  useEffect(()=>setAchs(ls(CKEY,[])),[]);
  function add(){
    setErr("");
    if(!aid.trim())return setErr("ACHIEVEMENT ID REQUIRED");
    if(!an.trim())return setErr("DISPLAY NAME REQUIRED");
    if(achs.find(a=>a.id===aid))return setErr("ID ALREADY EXISTS");
    const na=[...achs,{id:aid.trim(),icon:aico||"🏆",name:an.trim().toUpperCase(),cat:acat,desc:adesc,trigger:atrig}];
    setAchs(na);lsSet(CKEY,na);
    setAid("");setAico("");setAn("");setAdesc("");setAtrig("");
    notify("ACHIEVEMENT CREATED");
  }
  function del(id:string){const na=achs.filter(a=>a.id!==id);setAchs(na);lsSet(CKEY,na);}
  function unlockForUser(){
    setAuErr("");
    if(!auEmail||!auId)return setAuErr("FILL ALL FIELDS");
    const users=ls<{email:string;achievements:Record<string,boolean>}[]>(EKEY,[]);
    const ui=users.findIndex(u=>u.email===auEmail);
    if(ui<0)return setAuErr("USER NOT FOUND");
    users[ui].achievements=users[ui].achievements||{};
    users[ui].achievements[auId]=true;
    lsSet(EKEY,users);notify("ACHIEVEMENT UNLOCKED FOR USER");
  }
  return (
    <div>
      <div className="p-tag">// ACHIEVEMENT SYSTEM</div>
      <div className="p-title">CUSTOM <span>ACHIEVEMENTS</span></div>
      <div className="card">
        <div className="card-title">// CREATE CUSTOM ACHIEVEMENT</div>
        <div className="frow">
          <div className="fg" style={{margin:0}}><label>ACHIEVEMENT ID (unique, no spaces)</label><input className="fi" type="text" placeholder="e.g. beta_tester" value={aid} onChange={e=>setAid(e.target.value)}/></div>
          <div className="fg" style={{margin:0}}><label>ICON (emoji)</label><input className="fi" type="text" placeholder="🧪" maxLength={4} style={{fontSize:"22px",textAlign:"center"}} value={aico} onChange={e=>setAico(e.target.value)}/></div>
        </div>
        <div className="frow" style={{marginTop:"11px"}}>
          <div className="fg" style={{margin:0}}><label>DISPLAY NAME (ALL CAPS)</label><input className="fi" type="text" placeholder="e.g. BETA TESTER" value={an} onChange={e=>setAn(e.target.value)}/></div>
          <div className="fg" style={{margin:0}}><label>CATEGORY</label>
            <select className="fsel" value={acat} onChange={e=>setAcat(e.target.value)}>
              {["account","exploration","download","engagement","special","time","meta"].map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <div className="fg" style={{marginTop:"11px"}}><label>DESCRIPTION</label><input className="fi" type="text" placeholder="e.g. Participated in beta testing" value={adesc} onChange={e=>setAdesc(e.target.value)}/></div>
        <div className="fg"><label>TRIGGER NOTE</label><textarea className="fi" rows={2} style={{resize:"vertical"}} placeholder="How will this be activated..." value={atrig} onChange={e=>setAtrig(e.target.value)}/></div>
        <div style={{marginTop:"13px"}}><button className="btn p" onClick={add}>▶ CREATE ACHIEVEMENT</button></div>
        {err&&<div className="err-msg">{err}</div>}
      </div>
      <div className="card">
        <div className="card-title">// UNLOCK ACHIEVEMENT FOR USER</div>
        <div className="frow">
          <div className="fg" style={{margin:0}}><label>USER EMAIL</label><input className="fi" type="email" placeholder="user@email.com" value={auEmail} onChange={e=>setAuEmail(e.target.value)}/></div>
          <div className="fg" style={{margin:0}}><label>ACHIEVEMENT ID</label>
            <select className="fsel" value={auId} onChange={e=>setAuId(e.target.value)}>
              <option value="">— select achievement —</option>
              {achs.map(a=><option key={a.id} value={a.id}>{a.id}</option>)}
            </select>
          </div>
        </div>
        <div style={{marginTop:"11px"}}><button className="btn p" onClick={unlockForUser}>▶ UNLOCK FOR USER</button></div>
        {auErr&&<div className="err-msg">{auErr}</div>}
      </div>
      <div className="card">
        <div className="card-title">// CUSTOM ACHIEVEMENTS LIBRARY &nbsp;<span style={{color:"var(--muted)",fontWeight:"normal",fontSize:"8px"}}>{achs.length} ACHIEVEMENT{achs.length!==1?"S":""}</span></div>
        <div className="ach-preview-grid">
          {achs.map(a=>(
            <div key={a.id} className="ach-prev-card">
              <div className="ach-prev-ico">{a.icon}</div>
              <div style={{flex:1}}>
                <div className="ach-prev-name">{a.name}</div>
                <div className="ach-prev-desc">{a.desc}</div>
                <div className="ach-prev-id">{a.id}</div>
                {a.trigger&&<div className="ach-trigger-note">{a.trigger}</div>}
                <button className="btn d" style={{fontSize:"7px",padding:"3px 7px",marginTop:"8px"}} onClick={()=>del(a.id)}>REMOVE</button>
              </div>
            </div>
          ))}
          {achs.length===0&&<div style={{color:"var(--muted)",fontSize:"9px",letterSpacing:"3px",padding:"24px"}}>NO ACHIEVEMENTS YET</div>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ AI ════════════════════════════════════ */
const AI_TEAM=[
  {name:"ORACLE",role:"Strategic Reasoning",tag:"general · analysis"},
  {name:"SCOUT",role:"Research & Context",tag:"general · creative"},
  {name:"SAGE",role:"Deep Reasoning",tag:"analysis · code"},
  {name:"FORGE",role:"Technical & Code",tag:"code"},
  {name:"JUDGE",role:"Critical Analysis",tag:"analysis"},
  {name:"HERALD",role:"Writing & Comms",tag:"creative"},
  {name:"THINKER",role:"Logic & Problems",tag:"analysis · code"},
  {name:"SWIFT",role:"Quick Synthesis",tag:"general"},
  {name:"WEAVER",role:"Creative Synthesis",tag:"creative"},
  {name:"NEXUS",role:"Code Review",tag:"code"},
];
const AI_ACTIONS=[
  {ico:"📰",label:"BLOG POST",key:"blog_post"},{ico:"🎮",label:"GAME DESCRIPTION",key:"game_desc"},
  {ico:"📡",label:"ANNOUNCEMENT",key:"announcement"},{ico:"👤",label:"EMPLOYEE BIO",key:"employee_bio"},
  {ico:"📄",label:"PAGE CONTENT",key:"page_content"},{ico:"🎖️",label:"ROSTER ENTRY",key:"roster_entry"},
  {ico:"🚀",label:"RELEASE NOTES",key:"release_notes"},{ico:"📖",label:"LORE / UNIVERSE",key:"lore_entry"},
];
type ChatMsg={role:string;content:string};
type ChatSession={id:string;ts:number;preview:string;msgs:ChatMsg[]};
function PanelAI({notify:_n}:{notify:(m:string)=>void}){
  const [hist,setHist]=useState<ChatMsg[]>([]);
  const [input,setInput]=useState("");
  const [thinking,setThinking]=useState(false);
  const [view,setView]=useState<"chat"|"history">("chat");
  const [sessions,setSessions]=useState<ChatSession[]>([]);
  const chatRef=useRef<HTMLDivElement>(null);
  const sidRef=useRef<string>(Date.now().toString());

  useEffect(()=>{setSessions(ls<ChatSession[]>(AHKEY,[]));},[]);
  useEffect(()=>{if(chatRef.current)chatRef.current.scrollTop=chatRef.current.scrollHeight;},[hist,thinking]);

  function saveSession(msgs:ChatMsg[]){
    if(msgs.length<2)return;
    const sid=sidRef.current;
    const preview=msgs.find(m=>m.role==="user")?.content.slice(0,72)||"";
    setSessions(prev=>{
      const idx=prev.findIndex(s=>s.id===sid);
      const entry:ChatSession={id:sid,ts:Date.now(),preview,msgs};
      const next=idx>=0?prev.map((s,i)=>i===idx?entry:s):[entry,...prev];
      const trimmed=next.slice(0,60);
      lsSet(AHKEY,trimmed);
      return trimmed;
    });
  }

  async function send(prompt?:string){
    const msg=(prompt||input).trim();
    if(!msg||thinking)return;
    setInput("");
    const nh=[...hist,{role:"user",content:msg}];
    setHist(nh);setThinking(true);
    try{
      const res=await fetch("/api/ai-team",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:msg,history:nh.slice(-10)})});
      const data=await res.json() as {result?:string;error?:string};
      const final=[...nh,{role:"assistant",content:data.result||data.error||"No response."}];
      setHist(final);
      saveSession(final);
    }catch(e){setHist(h=>[...h,{role:"assistant",content:`Error: ${(e as Error).message}`}]);}
    setThinking(false);
  }

  function newChat(){
    setHist([]);setInput("");
    sidRef.current=Date.now().toString();
  }

  function loadSession(s:ChatSession){
    setHist(s.msgs);
    sidRef.current=s.id;
    setView("chat");
  }

  function deleteSession(id:string,e:React.MouseEvent){
    e.stopPropagation();
    setSessions(prev=>{const u=prev.filter(s=>s.id!==id);lsSet(AHKEY,u);return u;});
  }

  function aiAction(key:string){
    const prompts:Record<string,string>={
      blog_post:"Write a professional blog post for Synthrix Studio, an indie game studio. Include a catchy title, intro, body, and conclusion.",
      game_desc:"Write a compelling game description for a Synthrix Studio game. Include genre, atmosphere, key features, and a call-to-action.",
      announcement:"Write an announcement for Synthrix Studio. Make it exciting and professional.",
      employee_bio:"Write a short bio for a Synthrix Studio team member. Make it professional yet engaging.",
      page_content:"Write content for a Synthrix Studio website page. Focus on our mission to create innovative games.",
      roster_entry:"Write a roster entry for a Synthrix team member with their role, skills, and unit.",
      release_notes:"Write release notes for a new Synthrix Studio game update. Include new features, fixes, and improvements.",
      lore_entry:"Write a lore entry for the Synthrix universe. Create compelling world-building content.",
    };
    setView("chat");
    send(prompts[key]);
  }

  return (
    <div>
      <div className="p-tag">// SYNTHRIX AI TEAM — 15 SPECIALIST MODELS · LANGCHAIN AGENTS · AUTO-ROUTING</div>
      <div className="p-title">AI <span>TEAM</span></div>

      {/* ── view switcher ── */}
      <div className="ai-view-bar">
        <div style={{display:"flex",gap:"6px"}}>
          <button className={`msg-tab${view==="chat"?" on":""}`} onClick={()=>setView("chat")}>⚡ CHAT</button>
          <button className={`msg-tab${view==="history"?" on":""}`} onClick={()=>setView("history")}>
            📋 HISTORY{sessions.length>0?` (${sessions.length})`:""}
          </button>
        </div>
        {hist.length>0&&(
          <button className="btn" style={{fontSize:"8px",padding:"4px 12px",letterSpacing:"2px"}} onClick={newChat}>+ NEW CHAT</button>
        )}
      </div>

      {/* ══ CHAT VIEW ══ */}
      {view==="chat"&&(<>
        <div className="card" style={{marginBottom:"12px"}}>
          <div className="card-title">// ACTIVE TEAM — TASK IS AUTO-ROUTED TO 3 SPECIALISTS + SYNTHESIZER</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"8px",marginTop:"8px"}}>
            {AI_TEAM.map(t=>(
              <div key={t.name} className="ai-team-card">
                <span className="ai-team-name">{t.name}</span>
                <span className="ai-team-role">{t.role}</span>
                <span className="ai-team-tag">{t.tag}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{marginBottom:"12px"}}>
          <div className="card-title">// QUICK ACTIONS — AI WILL GENERATE &amp; LET YOU APPLY WITH ONE CLICK</div>
          <div className="ai-actions-grid">
            {AI_ACTIONS.map(a=>(
              <button key={a.key} className="ai-act-btn" onClick={()=>aiAction(a.key)}>
                <span className="ai-act-ico">{a.ico}</span>{a.label}
              </button>
            ))}
          </div>
        </div>
        <div className="card" style={{marginBottom:0}}>
          <div className="card-title">// AI CHAT — DESCRIBE WHAT YOU NEED</div>
          <div className="ai-chat" ref={chatRef}>
            {hist.length===0&&(
              <div style={{textAlign:"center",padding:"60px 20px",fontSize:"9px",letterSpacing:"3px",color:"rgba(226,232,228,0.22)",lineHeight:"2.5"}}>
                ⚡ AI TEAM READY<br/>
                <span>Select a quick action or type — specialists auto-assigned per task</span><br/>
                <span style={{color:"rgba(139,92,246,0.50)"}}>ORACLE · SCOUT · SAGE · FORGE · JUDGE · HERALD · THINKER · SWIFT · WEAVER · NEXUS</span>
              </div>
            )}
            {hist.map((m,i)=>(
              <div key={i} className={`ai-msg ${m.role==="user"?"user":"ai"}`}>
                <div className="ai-msg-avatar">{m.role==="user"?"👤":"⚡"}</div>
                <div className="ai-msg-bubble">{m.content}</div>
              </div>
            ))}
            {thinking&&(
              <div className="ai-msg ai">
                <div className="ai-msg-avatar">🤖</div>
                <div className="ai-msg-bubble" style={{flex:1}}>
                  <div className="ai-thinking-wrap">
                    <div className="ai-think-top">
                      <div className="ai-think-icon">⚙️</div>
                      <div className="ai-think-text-col">
                        <div className="ai-think-label">AI TEAM WORKING</div>
                        <div className="ai-think-status">ROUTING TO SPECIALISTS...</div>
                      </div>
                      <div className="ai-think-bars">
                        <div className="ai-think-bar"/><div className="ai-think-bar"/>
                        <div className="ai-think-bar"/><div className="ai-think-bar"/>
                        <div className="ai-think-bar"/><div className="ai-think-bar"/>
                        <div className="ai-think-bar"/>
                      </div>
                    </div>
                    <div className="ai-think-scan-wrap"><div className="ai-think-scan"/></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="ai-input-row" style={{marginTop:"10px"}}>
            <textarea className="ai-textarea" rows={2} placeholder="Ask the AI anything..." value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}/>
            <button className="ai-send-btn" onClick={()=>send()} disabled={thinking}>SEND</button>
          </div>
        </div>
      </>)}

      {/* ══ HISTORY VIEW ══ */}
      {view==="history"&&(
        <div className="card" style={{marginBottom:0}}>
          <div className="card-title" style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span>// CHAT HISTORY — {sessions.length} SESSION{sessions.length!==1?"S":""}</span>
            {sessions.length>0&&(
              <button className="btn d" style={{fontSize:"8px",padding:"3px 10px"}}
                onClick={()=>{setSessions([]);lsSet(AHKEY,[]);}}>CLEAR ALL</button>
            )}
          </div>
          {sessions.length===0?(
            <div style={{padding:"60px 20px",textAlign:"center",fontSize:"9px",letterSpacing:"3px",color:"rgba(226,232,228,0.20)",lineHeight:"2.2"}}>
              📋 NO SAVED SESSIONS<br/>
              <span style={{fontSize:"8px"}}>Conversations are auto-saved after each AI response</span>
            </div>
          ):(
            <div className="ai-hist-list">
              {sessions.map((s,i)=>(
                <div key={s.id} className="ai-hist-row" onClick={()=>loadSession(s)}>
                  <div className="ai-hist-idx">#{String(i+1).padStart(2,"0")}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="ai-hist-preview">{s.preview}</div>
                    <div className="ai-hist-meta">
                      <span>{new Date(s.ts).toLocaleDateString()} {new Date(s.ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
                      <span className="ai-hist-dot">·</span>
                      <span>{Math.floor(s.msgs.length/2)} exchange{Math.floor(s.msgs.length/2)!==1?"s":""}</span>
                    </div>
                  </div>
                  <button className="ai-hist-del" onClick={e=>deleteSession(s.id,e)} title="Delete">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════ MESSAGES ══════════════════════════════ */
type Msg={id:string;from:string;fromDisplay:string;to:string;subject:string;body:string;ts:number;read:boolean};
function PanelMessages({admin,notify}:{admin:Admin;notify:(m:string)=>void}){
  const [msgTab,setMsgTab]=useState<"inbox"|"compose"|"sent">("inbox");
  const [msgs,setMsgs]=useState<Msg[]>([]);
  const [mto,setMto]=useState("");const [msub,setMsub]=useState("");const [mbody,setMbody]=useState("");
  const [mErr,setMErr]=useState("");
  const [modalMsg,setModalMsg]=useState<Msg|null>(null);
  const [admins,setAdmins]=useState<{u:string;display:string}[]>([]);
  useEffect(()=>{
    setMsgs(ls(MSGKEY,[]));
    const dynAccs=ls<{u:string;display:string}[]>(ADKEY,[]);
    const all=[...ADMIN_DB.map(a=>({u:a.u,display:a.display})),...dynAccs];
    setAdmins(all.filter(a=>a.u!==admin.u));
  },[admin.u]);
  const inbox=msgs.filter(m=>m.to===admin.u);
  const sent=msgs.filter(m=>m.from===admin.u);
  const unread=inbox.filter(m=>!m.read).length;
  function sendMsg(){
    setMErr("");
    if(!mto)return setMErr("SELECT RECIPIENT");
    if(!msub)return setMErr("SUBJECT REQUIRED");
    if(!mbody)return setMErr("MESSAGE REQUIRED");
    const nm=[...msgs,{id:Date.now().toString(),from:admin.u,fromDisplay:admin.display,to:mto,subject:msub,body:mbody,ts:Date.now(),read:false}];
    setMsgs(nm);lsSet(MSGKEY,nm);setMto("");setMsub("");setMbody("");
    notify("MESSAGE SENT");setMsgTab("sent");
  }
  function openMsg(m:Msg){
    setModalMsg(m);
    if(!m.read){const nm=msgs.map(x=>x.id===m.id?{...x,read:true}:x);setMsgs(nm);lsSet(MSGKEY,nm);}
  }
  return (
    <div>
      <div className="p-tag">// INTERNAL COMMS</div>
      <div className="p-title">MESSAGES {unread>0&&<span style={{fontSize:"12px",color:"var(--green)"}}>· {unread} UNREAD</span>}</div>
      <div className="msg-tabs">
        {(["inbox","compose","sent"] as const).map(t=>(
          <button key={t} className={`msg-tab${msgTab===t?" on":""}`} onClick={()=>setMsgTab(t)}>
            {t.toUpperCase()}{t==="inbox"&&unread>0&&<span className="sb-badge" style={{marginLeft:"6px"}}>{unread}</span>}
          </button>
        ))}
      </div>
      {msgTab==="inbox"&&(
        <div>
          {inbox.length ? inbox.map(m=>(
            <div key={m.id} className={`msg-item${m.read?"":" unread"}`} onClick={()=>openMsg(m)}>
              <div className={`msg-dot${m.read?" read":""}`}/>
              <div style={{flex:1}}>
                <div className="msg-subject">{m.subject}</div>
                <div className="msg-meta">FROM: {m.fromDisplay||m.from.toUpperCase()} &nbsp;·&nbsp; {new Date(m.ts).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"2-digit"}).toUpperCase()+' '+new Date(m.ts).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}</div>
                <div className="msg-preview">{m.body}</div>
              </div>
            </div>
          )) : <div style={{color:"var(--muted)",fontSize:"9px",letterSpacing:"2px"}}>NO MESSAGES</div>}
        </div>
      )}
      {msgTab==="compose"&&(
        <div className="card" style={{marginBottom:0}}>
          <div className="card-title">// NEW MESSAGE</div>
          <div className="fg"><label>TO (USERNAME)</label>
            <select className="fsel" value={mto} onChange={e=>setMto(e.target.value)}>
              <option value="">— select recipient —</option>
              {admins.map(a=><option key={a.u} value={a.u}>{a.display} ({a.u})</option>)}
            </select>
          </div>
          <div className="fg"><label>SUBJECT</label><input className="fi" type="text" placeholder="Message subject..." value={msub} onChange={e=>setMsub(e.target.value)}/></div>
          <div className="fg"><label>MESSAGE</label><textarea className="fi" rows={6} style={{resize:"vertical"}} placeholder="Write your message..." value={mbody} onChange={e=>setMbody(e.target.value)}/></div>
          <button className="btn p" style={{marginTop:"4px"}} onClick={sendMsg}>▶ SEND MESSAGE</button>
          {mErr&&<div className="err-msg">{mErr}</div>}
        </div>
      )}
      {msgTab==="sent"&&(
        <div>
          {sent.length ? sent.map(m=>(
            <div key={m.id} className="msg-item" onClick={()=>setModalMsg(m)}>
              <div className="msg-dot read"/>
              <div style={{flex:1}}>
                <div className="msg-subject">{m.subject}</div>
                <div className="msg-meta">TO: {m.to.toUpperCase()} &nbsp;·&nbsp; {new Date(m.ts).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"2-digit"}).toUpperCase()+' '+new Date(m.ts).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}</div>
                <div className="msg-preview">{m.body}</div>
              </div>
            </div>
          )) : <div style={{color:"var(--muted)",fontSize:"9px",letterSpacing:"2px"}}>NO SENT MESSAGES</div>}
        </div>
      )}
      {modalMsg&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModalMsg(null)}>
          <div className="msg-modal-box">
            <div className="msg-modal-head">
              <div>
                <div className="msg-modal-subject">{modalMsg.subject}</div>
                <div className="msg-modal-meta">FROM: {modalMsg.fromDisplay||modalMsg.from.toUpperCase()} (@{modalMsg.from}) &nbsp;·&nbsp; {new Date(modalMsg.ts).toLocaleString("en-GB")}</div>
              </div>
              <button className="msg-modal-close" onClick={()=>setModalMsg(null)}>✕</button>
            </div>
            <div className="msg-modal-body">{modalMsg.body}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════ POSTS ═════════════════════════════════ */
type Post={id:number;title:string;cat:string;thumb:string;content:string;status:string;author:string;date:string;createdAt:number};
function PanelPosts({notify}:{notify:(m:string)=>void}){
  const [posts,setPosts]=useState<Post[]>([]);
  const [pt,setPt]=useState("");const [pc,setPc]=useState("News");const [pth,setPth]=useState("");const [pcont,setPcont]=useState("");
  useEffect(()=>setPosts(ls(PKEY,[])),[]);
  function save(p:Post[]){setPosts(p);lsSet(PKEY,p);}
  function savePost(status:string){
    if(!pt.trim())return notify("TITLE REQUIRED");
    if(!pcont.trim())return notify("CONTENT REQUIRED");
    save([{id:Date.now(),title:pt,cat:pc,thumb:pth,content:pcont,status,author:"TAMAN",date:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"2-digit"}).toUpperCase(),createdAt:Date.now()},...posts]);
    setPt("");setPc("News");setPth("");setPcont("");
    notify(status==="published"?"POST PUBLISHED":"DRAFT SAVED");
  }
  function toggleStatus(id:number){save(posts.map(p=>p.id===id?{...p,status:p.status==="published"?"draft":"published"}:p));}
  return (
    <div>
      <div className="p-tag">// CONTENT PUBLISHING</div>
      <div className="p-title">BLOG <span>/ POSTS</span></div>
      <div className="card">
        <div className="card-title">// NEW POST</div>
        <div className="frow">
          <div className="fg" style={{margin:0}}><label>TITLE</label><input className="fi" type="text" placeholder="Post title..." value={pt} onChange={e=>setPt(e.target.value)}/></div>
          <div className="fg" style={{margin:0}}><label>CATEGORY</label>
            <select className="fsel" value={pc} onChange={e=>setPc(e.target.value)}>
              {["News","Update","Event","Release","Dev Log","Announcement"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="fg" style={{marginTop:"11px"}}><label>THUMBNAIL URL (optional)</label><input className="fi" type="url" placeholder="https://..." value={pth} onChange={e=>setPth(e.target.value)}/></div>
        <div className="fg" style={{marginTop:"11px"}}><label>CONTENT</label>
          <textarea className="fi" rows={8} style={{resize:"vertical"}} placeholder="Write post content..." value={pcont} onChange={e=>setPcont(e.target.value)}/>
        </div>
        <div className="frow" style={{marginTop:"13px"}}>
          <button className="btn p" onClick={()=>savePost("published")}>▶ PUBLISH</button>
          <button className="btn outline" onClick={()=>savePost("draft")}>SAVE AS DRAFT</button>
        </div>
      </div>
      <div className="card">
        <div className="card-title">// ALL POSTS &nbsp;<span style={{color:"var(--muted)",fontWeight:"normal",fontSize:"8px"}}>{posts.length} POST{posts.length!==1?"S":""}</span></div>
        <div className="post-list">
          {posts.map(p=>(
            <div key={p.id} className="post-item">
              {p.thumb
                ? <img className="post-thumb" src={p.thumb} alt={p.title}/>
                : <div className="post-thumb-ph">📰</div>
              }
              <div>
                <div className="post-title">{p.title}</div>
                <div className="post-meta">{p.cat} · {p.date} · {p.status.toUpperCase()}</div>
              </div>
              <div style={{display:"flex",gap:"6px"}}>
                <button className="btn outline" style={{fontSize:"7px",padding:"4px 8px"}} onClick={()=>toggleStatus(p.id)}>
                  {p.status==="published"?"UNPUBLISH":"PUBLISH"}
                </button>
                <button className="btn d" style={{fontSize:"7px",padding:"4px 8px"}} onClick={()=>save(posts.filter(x=>x.id!==p.id))}>DEL</button>
              </div>
            </div>
          ))}
          {posts.length===0&&<div style={{color:"var(--muted)",fontSize:"9px",letterSpacing:"3px",padding:"24px"}}>NO POSTS YET</div>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ CONTENT EDITOR ════════════════════════ */
type Snippet={id:string;type:string;content:string;date:string};
function PanelEditor({notify}:{notify:(m:string)=>void}){
  const [snips,setSnips]=useState<Snippet[]>([]);
  const [sid,setSid]=useState("");const [stype,setStype]=useState("Text Block");const [scont,setScont]=useState("");
  const [preview,setPreview]=useState(false);
  useEffect(()=>setSnips(ls(SNKEY,[])),[]);
  function save(){
    if(!sid.trim())return notify("SNIPPET ID REQUIRED");
    if(!scont.trim())return notify("CONTENT REQUIRED");
    const na=[{id:sid.trim(),type:stype,content:scont,date:new Date().toLocaleDateString("en-GB")},...snips.filter(s=>s.id!==sid.trim())];
    setSnips(na);lsSet(SNKEY,na);setSid("");setScont("");setPreview(false);
    notify("SNIPPET SAVED");
  }
  return (
    <div>
      <div className="p-tag">// RICH TEXT</div>
      <div className="p-title">CONTENT <span>EDITOR</span></div>
      <div className="card">
        <div className="card-title">// CREATE CONTENT SNIPPET</div>
        <div className="frow">
          <div className="fg" style={{margin:0}}><label>SNIPPET ID / NAME</label><input className="fi" type="text" placeholder="e.g. hero_tagline" value={sid} onChange={e=>setSid(e.target.value)}/></div>
          <div className="fg" style={{margin:0}}><label>TYPE</label>
            <select className="fsel" value={stype} onChange={e=>setStype(e.target.value)}>
              {["Text Block","Hero Content","About Section","Announcement","Custom"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="fg" style={{marginTop:"11px"}}><label>CONTENT</label>
          <textarea className="fi" rows={8} style={{resize:"vertical"}} placeholder="Write content..." value={scont} onChange={e=>setScont(e.target.value)}/>
        </div>
        <div style={{marginTop:"13px",display:"flex",gap:"10px"}}>
          <button className="btn p" onClick={save}>▶ SAVE SNIPPET</button>
          <button className="btn outline" onClick={()=>setPreview(p=>!p)}>PREVIEW HTML</button>
        </div>
        {preview&&<div style={{marginTop:"12px",padding:"14px",background:"rgba(255,255,255,0.02)",border:"1px solid var(--bord)",borderRadius:"2px",fontSize:"11px",color:"var(--muted)",lineHeight:"1.7",wordBreak:"break-all"}}>{scont}</div>}
      </div>
      <div className="card">
        <div className="card-title">// SAVED SNIPPETS</div>
        <table className="t">
          <thead><tr><th>ID</th><th>TYPE</th><th>PREVIEW</th><th>SAVED</th><th></th></tr></thead>
          <tbody>
            {snips.length ? snips.map(s=>(
              <tr key={s.id}>
                <td style={{color:"var(--green)",fontFamily:"Courier New,monospace"}}>{s.id}</td>
                <td style={{color:"var(--muted)",fontSize:"9px"}}>{s.type}</td>
                <td style={{color:"var(--white)",fontSize:"10px",maxWidth:"200px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.content.slice(0,60)}{s.content.length>60?"...":""}</td>
                <td style={{color:"var(--muted)",fontSize:"8px"}}>{s.date}</td>
                <td>
                  <div style={{display:"flex",gap:"5px"}}>
                    <button className="btn outline" style={{fontSize:"7px",padding:"3px 7px"}} onClick={()=>{setSid(s.id);setStype(s.type);setScont(s.content);}}>EDIT</button>
                    <button className="btn d" style={{fontSize:"7px",padding:"3px 7px"}} onClick={()=>{const na=snips.filter(x=>x.id!==s.id);setSnips(na);lsSet(SNKEY,na);}}>DEL</button>
                  </div>
                </td>
              </tr>
            )) : <tr><td colSpan={5} style={{color:"var(--muted)",fontSize:"9px",letterSpacing:"2px"}}>NO SNIPPETS YET</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════ PAGE BUILDER ══════════════════════════ */
type PBBlock={id:string;type:string;content:string};
const PB_TYPES=["HERO","ABOUT","FEATURES","TEAM","GAMES","BLOG","CTA","FOOTER","CUSTOM"];
function PanelPageBuilder({notify}:{notify:(m:string)=>void}){
  const [canvas,setCanvas]=useState<PBBlock[]>([]);
  const [saved,setSaved]=useState<{id:string;name:string;blocks:PBBlock[]}[]>([]);
  useEffect(()=>setSaved(ls(PBKEY,[])),[]);
  function addBlock(type:string){
    setCanvas(c=>[...c,{id:Date.now().toString(),type,content:type+" content"}]);
  }
  function savePage(){
    const name=prompt("Page name:");
    if(!name)return;
    const existing=saved.findIndex(s=>s.name===name);
    let na;
    if(existing>=0){na=saved.map((s,i)=>i===existing?{...s,blocks:canvas}:s);}
    else{na=[...saved,{id:Date.now().toString(),name,blocks:canvas}];}
    setSaved(na);lsSet(PBKEY,na);notify("PAGE SAVED: "+name.toUpperCase());
  }
  return (
    <div>
      <div className="p-tag">// VISUAL LAYOUT</div>
      <div className="p-title">PAGE <span>BUILDER</span></div>
      <div className="card">
        <div className="card-title">// ADD BLOCKS</div>
        <div className="pb-palette">
          {PB_TYPES.map(t=>(
            <button key={t} className="pb-add-btn" onClick={()=>addBlock(t)}>+ {t}</button>
          ))}
        </div>
        <div className="card-title" style={{marginTop:"4px"}}>// CANVAS — DRAG TO REORDER</div>
        <div className="pb-canvas">
          {canvas.length ? canvas.map(b=>(
            <div key={b.id} className="pb-block">
              <span style={{fontSize:"16px",color:"var(--muted)",cursor:"grab"}}>⠿</span>
              <span style={{fontSize:"8px",letterSpacing:"3px",color:"var(--green)",width:"80px",flexShrink:0}}>{b.type}</span>
              <span style={{fontSize:"10px",color:"var(--muted)",flex:1}}>{b.content}</span>
              <button className="btn d" style={{fontSize:"7px",padding:"3px 7px"}} onClick={()=>setCanvas(c=>c.filter(x=>x.id!==b.id))}>✕</button>
            </div>
          )) : <div style={{textAlign:"center",color:"var(--muted)",fontSize:"9px",letterSpacing:"3px",padding:"30px 0"}}>CLICK BLOCKS ABOVE TO ADD THEM HERE</div>}
        </div>
        <div style={{marginTop:"13px",display:"flex",gap:"10px"}}>
          <button className="btn p" onClick={savePage}>▶ SAVE PAGE LAYOUT</button>
          <button className="btn outline" onClick={()=>setCanvas([])}>CLEAR CANVAS</button>
        </div>
        <div style={{fontSize:"8px",color:"var(--muted)",marginTop:"9px",letterSpacing:"1px",lineHeight:"1.9"}}>PAGE BUILDER CREATES A JSON LAYOUT STORED IN LOCALSTORAGE.</div>
      </div>
      <div className="card">
        <div className="card-title">// SAVED PAGES</div>
        {saved.length ? saved.map(s=>(
          <div key={s.id||s.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 0",borderBottom:"1px solid var(--bord)"}}>
            <div>
              <div style={{fontSize:"11px",letterSpacing:"2px",color:"var(--white)"}}>{s.name}</div>
              <div style={{fontSize:"8px",color:"var(--muted)"}}>{s.blocks.length} BLOCK{s.blocks.length!==1?"S":""}</div>
            </div>
            <div style={{display:"flex",gap:"6px"}}>
              <button className="btn outline" style={{fontSize:"7px",padding:"4px 8px"}} onClick={()=>setCanvas(s.blocks)}>LOAD</button>
              <button className="btn d" style={{fontSize:"7px",padding:"4px 8px"}} onClick={()=>{const na=saved.filter(x=>(x.id||x.name)!==(s.id||s.name));setSaved(na);lsSet(PBKEY,na);}}>DEL</button>
            </div>
          </div>
        )) : <div style={{color:"var(--muted)",fontSize:"9px",letterSpacing:"2px"}}>NO SAVED PAGES</div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════ NAV EDITOR ════════════════════════════ */
type NavItem={id:string;label:string;url:string;target:string;cta:boolean};
function PanelNavEditor({notify}:{notify:(m:string)=>void}){
  const [items,setItems]=useState<NavItem[]>([]);
  const [nl,setNl]=useState("");const [nu,setNu]=useState("");const [nt,setNt]=useState("_self");const [ncta,setNcta]=useState(false);
  useEffect(()=>setItems(ls(NEKEY,[])),[]);
  function add(){
    if(!nl||!nu)return notify("LABEL AND URL REQUIRED");
    const na=[...items,{id:Date.now().toString(),label:nl.toUpperCase(),url:nu,target:nt,cta:ncta}];
    setItems(na);lsSet(NEKEY,na);setNl("");setNu("");setNt("_self");setNcta(false);notify("NAV ITEM ADDED");
  }
  function del(id:string){const na=items.filter(i=>i.id!==id);setItems(na);lsSet(NEKEY,na);}
  return (
    <div>
      <div className="p-tag">// NAVIGATION</div>
      <div className="p-title">NAV <span>EDITOR</span></div>
      <div className="card">
        <div className="card-title">// ADD NAV ITEM</div>
        <div className="frow">
          <div className="fg" style={{margin:0}}><label>LABEL</label><input className="fi" type="text" placeholder="e.g. ABOUT" value={nl} onChange={e=>setNl(e.target.value)}/></div>
          <div className="fg" style={{margin:0}}><label>URL / ANCHOR</label><input className="fi" type="text" placeholder="e.g. #about or /page" value={nu} onChange={e=>setNu(e.target.value)}/></div>
        </div>
        <div className="frow" style={{marginTop:"9px"}}>
          <div className="fg" style={{margin:0}}><label>TARGET</label>
            <select className="fsel" value={nt} onChange={e=>setNt(e.target.value)}>
              <option value="_self">Same Tab</option><option value="_blank">New Tab</option>
            </select>
          </div>
          <div className="fg" style={{margin:0,display:"flex",alignItems:"flex-end"}}>
            <label style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"9px",letterSpacing:"3px",color:"var(--muted)",cursor:"pointer"}}>
              <input type="checkbox" checked={ncta} onChange={e=>setNcta(e.target.checked)}/> STYLE AS CTA BUTTON
            </label>
          </div>
        </div>
        <button className="btn p" style={{marginTop:"11px"}} onClick={add}>▶ ADD ITEM</button>
      </div>
      <div className="card">
        <div className="card-title">// CURRENT NAV ITEMS &nbsp;<span style={{color:"var(--muted)",fontWeight:"normal",fontSize:"8px"}}>(DRAG TO REORDER)</span></div>
        {items.length ? items.map(item=>(
          <div key={item.id} className="nav-item-row">
            <span style={{fontSize:"14px",color:"var(--muted)",cursor:"grab"}}>⠿</span>
            <span style={{fontSize:"10px",color:"var(--white)",flex:1}}>{item.label}</span>
            <span style={{fontSize:"9px",color:"var(--muted)"}}>{item.url}</span>
            {item.cta&&<span className="badge g" style={{fontSize:"7px",padding:"2px 6px"}}>CTA</span>}
            <button className="btn d" style={{fontSize:"7px",padding:"3px 7px"}} onClick={()=>del(item.id)}>✕</button>
          </div>
        )) : <div style={{color:"var(--muted)",fontSize:"9px",letterSpacing:"2px"}}>NO NAV ITEMS</div>}
        <div style={{fontSize:"8px",color:"var(--muted)",marginTop:"12px",letterSpacing:"1px",lineHeight:"1.9"}}>CHANGES SAVED TO LOCALSTORAGE. APPLY TO HTML SOURCE FOR LIVE SITE UPDATE.</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ THEME ═════════════════════════════════ */
type ThemeData={orange:string;gold:string;teal:string;bg:string;headFont:string;bodyFont:string};
const DEFAULT_THEME:ThemeData={orange:"#FF6B35",gold:"#F5A623",teal:"#00C9B8",bg:"#070707",headFont:"Orbitron",bodyFont:"Rajdhani"};
function PanelTheme({notify}:{notify:(m:string)=>void}){
  const [th,setTh]=useState<ThemeData>(DEFAULT_THEME);
  useEffect(()=>{const s=ls<ThemeData|null>(THKEY,null);if(s)setTh({...DEFAULT_THEME,...s});},[]);
  function apply(t:ThemeData){
    setTh(t);
    document.documentElement.style.setProperty("--orange",t.orange);
    document.documentElement.style.setProperty("--gold",t.gold);
    document.documentElement.style.setProperty("--teal",t.teal);
  }
  function saveTheme(){lsSet(THKEY,th);notify("THEME SAVED");}
  function resetTheme(){apply(DEFAULT_THEME);lsSet(THKEY,DEFAULT_THEME);notify("THEME RESET");}
  const fields:[keyof ThemeData,string][]=[["orange","PRIMARY / ORANGE"],["gold","ACCENT / GOLD"],["teal","TEAL / CYAN"],["bg","BACKGROUND"]];
  return (
    <div>
      <div className="p-tag">// VISUAL DESIGN</div>
      <div className="p-title">THEME <span>SETTINGS</span></div>
      <div className="card">
        <div className="card-title">// COLOUR SYSTEM</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
          {fields.map(([key,label])=>(
            <div key={key} className="fg">
              <label>{label}</label>
              <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                <input type="color" value={th[key]} onChange={e=>apply({...th,[key]:e.target.value})}
                  style={{width:"40px",height:"36px",border:"1px solid var(--bord)",borderRadius:"2px",background:"transparent",cursor:"pointer",padding:"2px"}}/>
                <span style={{fontSize:"10px",letterSpacing:"2px",color:"var(--muted)"}}>{th[key]}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{fontSize:"8px",letterSpacing:"3px",color:"var(--green)",margin:"14px 0 8px"}}>PREVIEW</div>
        <div className="theme-preview" style={{background:th.bg,color:th.orange}}>
          <span>SYNTHRIX STUDIO</span>
        </div>
        <div style={{marginTop:"13px",display:"flex",gap:"10px"}}>
          <button className="btn p" onClick={saveTheme}>▶ SAVE THEME</button>
          <button className="btn outline" onClick={resetTheme}>RESET TO DEFAULT</button>
        </div>
      </div>
      <div className="card">
        <div className="card-title">// FONT SELECTOR</div>
        <div className="fg"><label>HEADING FONT</label>
          <select className="fsel" value={th.headFont} onChange={e=>setTh(t=>({...t,headFont:e.target.value}))}>
            {["Orbitron","Rajdhani","Share Tech Mono","Exo 2","Audiowide"].map(f=><option key={f}>{f}</option>)}
          </select>
        </div>
        <div className="fg"><label>BODY FONT</label>
          <select className="fsel" value={th.bodyFont} onChange={e=>setTh(t=>({...t,bodyFont:e.target.value}))}>
            {["Rajdhani","Share Tech Mono","Exo 2","Inter"].map(f=><option key={f}>{f}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ ANALYTICS ════════════════════════════ */
function PanelAnalytics(){
  const an=ls<Record<string,number>>(ANKEY,{});
  const visitors=ls<unknown[]>(EKEY,[]);
  const posts=ls<unknown[]>(PKEY,[]);
  const games=ls<unknown[]>(GKEY,[]);
  const achs=ls<unknown[]>(CKEY,[]);
  const statCards=[
    {v:visitors.length,l:"TOTAL USERS"},{v:posts.length,l:"BLOG POSTS"},
    {v:games.length,l:"GAMES"},{v:achs.length,l:"ACHIEVEMENTS"},
  ];
  const pages=Object.entries(an).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const maxPv=pages[0]?.[1]||1;
  return (
    <div>
      <div className="p-tag">// SITE METRICS</div>
      <div className="p-title">ANALYTICS <span>DASHBOARD</span></div>
      <div className="stat-cards">
        {statCards.map(({v,l})=>(
          <div key={l} className="sc"><div className="sc-v">{v}</div><div className="sc-l">{l}</div></div>
        ))}
      </div>
      <div className="card">
        <div className="card-title">// PAGE VIEWS (TOP PAGES)</div>
        {pages.length ? pages.map(([page,views])=>(
          <div key={page} className="an-bar-row">
            <span className="an-bar-label">{page}</span>
            <div className="an-bar-track"><div className="an-bar-fill" style={{width:`${(views/maxPv)*100}%`}}/></div>
            <span className="an-bar-val">{views}</span>
          </div>
        )) : <div style={{color:"var(--muted)",fontSize:"9px",letterSpacing:"2px"}}>NO ANALYTICS DATA YET</div>}
      </div>
      <div className="card">
        <div className="card-title">// NOTE</div>
        <div style={{fontSize:"9px",color:"var(--muted)",letterSpacing:"1px",lineHeight:"2"}}>
          ■ ANALYTICS DATA IS COLLECTED FROM LOCALSTORAGE — REFLECTS SAME-DEVICE VISITS<br/>
          ■ FOR REAL GLOBAL ANALYTICS: ADD GOOGLE ANALYTICS GA4 SCRIPT TO THE STUDIO PAGE
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ ROLES ═════════════════════════════════ */
function PanelRoles({notify}:{notify:(m:string)=>void}){
  const [admins,setAdmins]=useState<DynAdmin[]>([]);
  const [rlUser,setRlUser]=useState("");const [rlRole,setRlRole]=useState("superadmin");const [rlErr,setRlErr]=useState("");
  useEffect(()=>setAdmins(ls(ADKEY,[])),[]);
  const roleDefs=[
    {cls:"role-badge-sys",label:"SYSTEM",title:"ROOT LEVEL — PROTECTED",desc:"Hardcoded accounts, cannot be deleted. Full access to everything.",note:"SUVOM & TAMAN",border:"rgba(180,140,255,0.30)"},
    {cls:"role-badge-ctrl",label:"CONTROLLER",title:"MASTER CONTROL",desc:"All panels + create/remove admin accounts + full database access",note:"",border:"rgba(255,80,80,0.28)"},
    {cls:"role-badge-sa",label:"SUPER ADMIN",title:"FULL ACCESS",desc:"All panels, all data, danger zone, role assignment",note:"",border:""},
    {cls:"role-badge-ed",label:"EDITOR",title:"CONTENT ACCESS",desc:"Blog, Content Editor, Games, Announcements",note:"",border:""},
    {cls:"role-badge-mo",label:"MODERATOR",title:"LIMITED ACCESS",desc:"Form submissions, Announcements only",note:"",border:""},
  ];
  const levelBadge=(l:string)=>l==="controller"?"role-badge-ctrl":l==="superadmin"?"role-badge-sa":l==="editor"?"role-badge-ed":"role-badge-mo";
  function assignRole(){
    setRlErr("");
    if(!rlUser)return setRlErr("USERNAME REQUIRED");
    const na=admins.map(a=>a.u===rlUser?{...a,level:rlRole}:a);
    setAdmins(na);lsSet(ADKEY,na);notify("ROLE UPDATED: "+rlUser+" → "+rlRole.toUpperCase());
  }
  return (
    <div>
      <div className="p-tag">// ACCESS CONTROL</div>
      <div className="p-title">ROLES <span>&amp; PERMISSIONS</span></div>
      <div className="card">
        <div className="card-title">// ROLE DEFINITIONS</div>
        <div style={{display:"flex",flexDirection:"column",gap:"9px"}}>
          {roleDefs.map(r=>(
            <div key={r.label} className="fb-field-row" style={r.border?{borderColor:r.border}:{}}>
              <span className={`badge ${r.cls}`} style={{fontSize:"8px",letterSpacing:"3px",padding:"4px 10px"}}>{r.label}</span>
              <div style={{flex:1,paddingLeft:"12px"}}>
                <div style={{fontSize:"10px",color:"var(--white)",letterSpacing:"2px"}}>{r.title}</div>
                <div style={{fontSize:"8px",color:"var(--muted)",marginTop:"2px"}}>{r.desc}</div>
              </div>
              {r.note&&<span style={{fontSize:"8px",letterSpacing:"2px",color:"rgba(180,140,255,0.60)"}}>{r.note}</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-title">// ASSIGN ROLE TO EMPLOYEE</div>
        <div className="frow">
          <div className="fg" style={{margin:0}}><label>ADMIN USERNAME</label><input className="fi" type="text" placeholder="e.g. lkplayz" autoComplete="off" value={rlUser} onChange={e=>setRlUser(e.target.value)}/></div>
          <div className="fg" style={{margin:0}}><label>NEW ROLE</label>
            <select className="fsel" value={rlRole} onChange={e=>setRlRole(e.target.value)}>
              <option value="superadmin">SUPER ADMIN</option><option value="controller">CONTROLLER</option>
              <option value="editor">EDITOR</option><option value="moderator">MODERATOR</option>
            </select>
          </div>
        </div>
        <button className="btn p" style={{marginTop:"11px"}} onClick={assignRole}>▶ ASSIGN ROLE</button>
        {rlErr&&<div className="err-msg">{rlErr}</div>}
      </div>
      <div className="card">
        <div className="card-title">// EMPLOYEES WITH ADMIN ACCESS</div>
        {admins.length ? admins.map(a=>(
          <div key={a.id} className="fb-field-row">
            <span style={{fontSize:"10px",color:"var(--green)",fontFamily:"Courier New,monospace",width:"120px"}}>{a.u}</span>
            <span style={{fontSize:"10px",color:"var(--white)",flex:1,paddingLeft:"12px"}}>{a.display}</span>
            <span className={`badge ${levelBadge(a.level)}`} style={{fontSize:"7px",letterSpacing:"2px",padding:"2px 7px"}}>{(a.level||"editor").toUpperCase()}</span>
          </div>
        )) : <div style={{color:"var(--muted)",fontSize:"9px",letterSpacing:"2px"}}>NO ADMIN ACCOUNTS CREATED YET</div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════ DATABASE ══════════════════════════════ */
type Visitor={id:string;displayName:string;email:string;loginCount:number;achievements:Record<string,boolean>;createdAt:number};
function PanelDatabase({notify}:{notify:(m:string)=>void}){
  const [visitors,setVisitors]=useState<Visitor[]>([]);
  const [admins,setAdmins]=useState<DynAdmin[]>([]);
  const [vSearch,setVSearch]=useState("");
  const [aSearch,setASearch]=useState("");
  const [modal,setModal]=useState<{type:string;account:Visitor|DynAdmin|null}>({type:"",account:null});
  useEffect(()=>{setVisitors(ls(EKEY,[]));setAdmins(ls(ADKEY,[]));},[]);
  const levelBadge=(l:string)=>l==="system"?"role-badge-sys":l==="controller"?"role-badge-ctrl":l==="superadmin"?"role-badge-sa":l==="editor"?"role-badge-ed":"role-badge-mo";
  function delVisitor(id:string){if(!confirm("Delete this account?"))return;const na=visitors.filter(v=>v.id!==id);setVisitors(na);lsSet(EKEY,na);notify("ACCOUNT DELETED");}
  function delAdmin(id:string){if(!confirm("Delete this account?"))return;const na=admins.filter(a=>a.id!==id);setAdmins(na);lsSet(ADKEY,na);notify("ACCOUNT DELETED");}
  const fv=vSearch?visitors.filter(v=>(v.displayName||"").toLowerCase().includes(vSearch.toLowerCase())||(v.email||"").toLowerCase().includes(vSearch.toLowerCase())):visitors;
  const hardcoded=ADMIN_DB.map(a=>({id:a.u,u:a.u,display:a.display,passHash:"",level:a.level,createdAt:0,loginCount:0,hardcoded:true}));
  const allAdmins=[...hardcoded,...admins];
  const fa=aSearch?allAdmins.filter(a=>(a.u||"").toLowerCase().includes(aSearch.toLowerCase())||(a.display||"").toLowerCase().includes(aSearch.toLowerCase())):allAdmins;
  return (
    <div>
      <div className="p-tag">// CONTROLLER ACCESS ONLY</div>
      <div className="p-title">DATABASE <span>VIEWER</span></div>
      <div className="db-access-badge">■ RESTRICTED — CONTROLLER CLEARANCE REQUIRED</div>
      <div className="card">
        <div className="card-title">// WEBSITE USER ACCOUNTS &nbsp;<span style={{color:"var(--muted)",fontWeight:"normal",fontSize:"8px"}}>{visitors.length} RECORD{visitors.length!==1?"S":""}</span></div>
        <input className="db-search" type="text" placeholder="Search by name or email..." value={vSearch} onChange={e=>setVSearch(e.target.value)}/>
        <table className="t">
          <thead><tr><th>DISPLAY NAME</th><th>EMAIL</th><th>LOGINS</th><th>ACHIEVEMENTS</th><th>JOINED</th><th></th></tr></thead>
          <tbody>
            {fv.length ? fv.map(v=>(
              <tr key={v.id}>
                <td style={{color:"var(--white)"}}>{v.displayName||"—"}</td>
                <td style={{color:"var(--muted)",fontSize:"9px"}}>{v.email||"—"}</td>
                <td style={{color:"var(--green)"}}>{v.loginCount||0}</td>
                <td style={{color:"var(--orange)"}}>{Object.keys(v.achievements||{}).length}</td>
                <td style={{color:"var(--muted)",fontSize:"8px"}}>{v.createdAt?new Date(v.createdAt).toLocaleDateString("en-GB"):"—"}</td>
                <td>
                  <div style={{display:"flex",gap:"5px"}}>
                    <button className="btn outline" style={{fontSize:"7px",padding:"3px 7px"}} onClick={()=>setModal({type:"visitor",account:v})}>VIEW</button>
                    <button className="btn d" style={{fontSize:"7px",padding:"3px 7px"}} onClick={()=>delVisitor(v.id)}>DEL</button>
                  </div>
                </td>
              </tr>
            )) : <tr><td colSpan={6} style={{color:"var(--muted)",fontSize:"9px",letterSpacing:"2px"}}>{vSearch?"NO MATCHING RECORDS":"NO VISITOR ACCOUNTS YET"}</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="card">
        <div className="card-title">// ADMIN PANEL ACCOUNTS &nbsp;<span style={{color:"var(--muted)",fontWeight:"normal",fontSize:"8px"}}>{allAdmins.length} RECORD{allAdmins.length!==1?"S":""}</span></div>
        <input className="db-search" type="text" placeholder="Search by username or name..." value={aSearch} onChange={e=>setASearch(e.target.value)}/>
        <table className="t">
          <thead><tr><th>USERNAME</th><th>DISPLAY NAME</th><th>LEVEL</th><th>LOGINS</th><th>CREATED</th><th></th></tr></thead>
          <tbody>
            {fa.length ? fa.map((a,i)=>(
              <tr key={i} style={"hardcoded" in a&&a.hardcoded?{background:"rgba(255,80,80,0.04)"}:{}}>
                <td style={{color:"var(--green)",fontFamily:"Courier New,monospace"}}>{a.u}{"hardcoded" in a&&(a as {hardcoded?:boolean}).hardcoded&&<span style={{fontSize:"7px",color:"rgba(255,100,100,0.55)"}}> [SYSTEM]</span>}</td>
                <td style={{color:"var(--white)"}}>{a.display}</td>
                <td><span className={`badge ${levelBadge(a.level)}`} style={{fontSize:"7px",letterSpacing:"2px",padding:"2px 7px"}}>{(a.level||"").toUpperCase()}</span></td>
                <td style={{color:"var(--green)"}}>{a.loginCount||0}</td>
                <td style={{color:"var(--muted)",fontSize:"8px"}}>{"hardcoded" in a&&a.hardcoded?"SYSTEM":a.createdAt?new Date(a.createdAt).toLocaleDateString("en-GB"):"—"}</td>
                <td>{"hardcoded" in a&&a.hardcoded
                  ? <span style={{fontSize:"7px",color:"var(--muted)",letterSpacing:"2px"}}>PROTECTED</span>
                  : <div style={{display:"flex",gap:"5px"}}>
                      <button className="btn outline" style={{fontSize:"7px",padding:"3px 7px"}} onClick={()=>setModal({type:"admin",account:a})}>VIEW</button>
                      <button className="btn d" style={{fontSize:"7px",padding:"3px 7px"}} onClick={()=>delAdmin(a.id)}>DEL</button>
                    </div>
                }</td>
              </tr>
            )) : <tr><td colSpan={6} style={{color:"var(--muted)",fontSize:"9px",letterSpacing:"2px"}}>{aSearch?"NO MATCHING RECORDS":"NO DYNAMIC ADMIN ACCOUNTS"}</td></tr>}
          </tbody>
        </table>
      </div>
      {modal.account&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal({type:"",account:null})}>
          <div className="db-modal-box">
            <div className="db-modal-head">
              <div className="db-modal-title">
                {modal.type==="visitor"
                  ? "// VISITOR ACCOUNT: "+(modal.account as Visitor).displayName
                  : "// ADMIN ACCOUNT: "+(modal.account as DynAdmin).display}
              </div>
              <button className="db-modal-close" onClick={()=>setModal({type:"",account:null})}>✕</button>
            </div>
            <div className="db-modal-body">
              {modal.type==="visitor" ? (()=>{
                const v=modal.account as Visitor;
                const achs=Object.keys(v.achievements||{});
                return (
                  <div>
                    <div className="detail-row"><div className="detail-key">EMAIL</div><div className="detail-val">{v.email||"—"}</div></div>
                    <div className="detail-row"><div className="detail-key">DISPLAY NAME</div><div className="detail-val">{v.displayName||"—"}</div></div>
                    <div className="detail-row"><div className="detail-key">LOGIN COUNT</div><div className="detail-val" style={{color:"var(--green)"}}>{v.loginCount||0}</div></div>
                    <div className="detail-row"><div className="detail-key">CREATED</div><div className="detail-val">{v.createdAt?new Date(v.createdAt).toLocaleString("en-GB"):"—"}</div></div>
                    <div className="detail-row"><div className="detail-key">ACCOUNT ID</div><div className="detail-val" style={{fontFamily:"Courier New,monospace",fontSize:"9px",color:"var(--muted)"}}>{v.id||"—"}</div></div>
                    {achs.length>0&&<div style={{marginTop:"8px"}}><div style={{fontSize:"8px",color:"var(--muted)",marginBottom:"6px"}}>ACHIEVEMENTS ({achs.length})</div>{achs.map(a=><span key={a} style={{display:"inline-block",fontSize:"7px",letterSpacing:"2px",padding:"2px 7px",borderRadius:"2px",background:"rgba(34,197,94,0.10)",border:"1px solid rgba(34,197,94,0.22)",color:"rgba(34,197,94,0.70)",margin:"2px"}}>{a}</span>)}</div>}
                    <button className="btn d" style={{width:"100%",marginTop:"16px"}} onClick={()=>{delVisitor(v.id);setModal({type:"",account:null});}}>■ DELETE THIS ACCOUNT</button>
                  </div>
                );
              })() : (()=>{
                const a=modal.account as DynAdmin;
                return (
                  <div>
                    <div className="detail-row"><div className="detail-key">USERNAME</div><div className="detail-val" style={{color:"var(--green)",fontFamily:"Courier New,monospace"}}>{a.u}</div></div>
                    <div className="detail-row"><div className="detail-key">DISPLAY NAME</div><div className="detail-val">{a.display||"—"}</div></div>
                    <div className="detail-row"><div className="detail-key">ADMIN LEVEL</div><div className="detail-val">{(a.level||"").toUpperCase()}</div></div>
                    <div className="detail-row"><div className="detail-key">LOGIN COUNT</div><div className="detail-val" style={{color:"var(--green)"}}>{a.loginCount||0}</div></div>
                    <div className="detail-row"><div className="detail-key">CREATED</div><div className="detail-val">{a.createdAt?new Date(a.createdAt).toLocaleString("en-GB"):"—"}</div></div>
                    <button className="btn d" style={{width:"100%",marginTop:"16px"}} onClick={()=>{delAdmin(a.id);setModal({type:"",account:null});}}>■ DELETE THIS ACCOUNT</button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════ CONTROLS ══════════════════════════════ */
const TOGGLES=[
  {key:"sx_feat_particles",   label:"PARTICLE EFFECTS",      sub:"Canvas particles on hero section"},
  {key:"sx_feat_collab_notif",label:"COLLAB NOTIFICATION",   sub:"DarkStar × SYNTHRIX popup toast"},
  {key:"sx_feat_achievements",label:"ACHIEVEMENT SYSTEM",     sub:"User achievement unlocking"},
  {key:"sx_feat_idle",        label:"CINEMATIC IDLE MODE",    sub:"Screen dims after 26s inactivity"},
  {key:"sx_feat_ripple",      label:"BUTTON RIPPLE EFFECTS",  sub:"Click ripple animations"},
];
function PanelControls({notify}:{notify:(m:string)=>void}){
  const [togs,setTogs]=useState<Record<string,boolean>>({});
  useEffect(()=>{
    const state:Record<string,boolean>={};
    TOGGLES.forEach(t=>{state[t.key]=localStorage.getItem(t.key)!=="false";});
    setTogs(state);
  },[]);
  function setTog(key:string,val:boolean){
    localStorage.setItem(key,String(val));
    setTogs(t=>({...t,[key]:val}));
    notify(key.replace("sx_feat_","").replace(/_/g," ").toUpperCase()+": "+(val?"ON":"OFF"));
  }
  function clearEmps(){if(!confirm("Clear ALL employee accounts?"))return;localStorage.removeItem(EKEY);notify("EMPLOYEE ACCOUNTS CLEARED");}
  function resetSettings(){TOGGLES.forEach(t=>localStorage.removeItem(t.key));const s:Record<string,boolean>={};TOGGLES.forEach(t=>{s[t.key]=true;});setTogs(s);notify("SETTINGS RESET");}
  return (
    <div>
      <div className="p-tag">// CONFIGURATION</div>
      <div className="p-title">SITE <span>CONTROLS</span></div>
      <div className="card">
        <div className="card-title">// FEATURE TOGGLES</div>
        {TOGGLES.map(t=>(
          <div key={t.key} className="tog-row">
            <div>
              <div className="tog-label">{t.label}</div>
              <div className="tog-sub">{t.sub}</div>
            </div>
            <label style={{position:"relative",width:"40px",height:"20px",flexShrink:0,display:"inline-block"}}>
              <input type="checkbox" checked={togs[t.key]??true} onChange={e=>setTog(t.key,e.target.checked)} style={{opacity:0,width:0,height:0}}/>
              <span style={{
                position:"absolute",inset:0,
                background:togs[t.key]?"rgba(34,197,94,0.32)":"rgba(255,255,255,0.07)",
                border:`1px solid ${togs[t.key]?"rgba(34,197,94,0.52)":"rgba(255,255,255,0.12)"}`,
                borderRadius:"10px",cursor:"pointer",transition:".3s"
              }}/>
              <span style={{
                position:"absolute",width:"14px",height:"14px",borderRadius:"50%",
                background:togs[t.key]?"var(--green)":"#fff",
                top:"2px",left:togs[t.key]?"22px":"2px",transition:".3s"
              }}/>
            </label>
          </div>
        ))}
        <div style={{fontSize:"8px",color:"var(--muted)",marginTop:"12px",letterSpacing:"1px",lineHeight:"2"}}>
          ■ TOGGLES ARE STORED IN LOCALSTORAGE — SAME-DEVICE USERS SEE CHANGES<br/>
          ■ FOR GLOBAL CHANGES VISIBLE TO ALL VISITORS, A CODE UPDATE IS NEEDED
        </div>
      </div>
      <div className="card">
        <div className="card-title">// DANGER ZONE</div>
        <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
          <button className="btn d" onClick={clearEmps}>⚠ CLEAR EMPLOYEE ACCOUNTS</button>
          <button className="btn d" onClick={resetSettings}>⚠ RESET SITE SETTINGS</button>
        </div>
      </div>
    </div>
  );
}
