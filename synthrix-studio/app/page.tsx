"use client";
import { useState, useEffect, useCallback } from "react";
import Cursor from "@/components/Cursor";
import Intro from "@/components/Intro";
import Navbar from "@/components/Navbar";
import UserAuth, { type SUser, getSession, endSession } from "@/components/UserAuth";
import HomeView from "@/components/views/HomeView";
import AboutView from "@/components/views/AboutView";
import GamesView from "@/components/views/GamesView";
import DownloadsView from "@/components/views/DownloadsView";
import NewsView from "@/components/views/NewsView";
import JoinView from "@/components/views/JoinView";
import BlogView from "@/components/views/BlogView";
import AchievementsView from "@/components/views/AchievementsView";

export type Tab = "home" | "about" | "games" | "downloads" | "news" | "join" | "blog" | "achievements";
const VALID_TABS: Tab[] = ["home","about","games","downloads","news","join","blog","achievements"];

export default function StudioPage() {
  const [ready, setReady]       = useState(false);
  const [tab, setTab]           = useState<Tab>("home");
  const [user, setUser]         = useState<SUser | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => { setUser(getSession()); }, []);

  /* Hash-based navigation */
  useEffect(() => {
    const hash = window.location.hash.replace("#","") as Tab;
    if (VALID_TABS.includes(hash)) setTab(hash);
    const onHash = () => {
      const h = window.location.hash.replace("#","") as Tab;
      if (VALID_TABS.includes(h)) setTab(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  /* Scroll-reveal */
  useEffect(() => {
    let obs: IntersectionObserver | null = null;
    const id = setTimeout(() => {
      obs = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("active"); }),
        { threshold: 0.05 }
      );
      document.querySelectorAll(".reveal,.reveal-left,.reveal-right").forEach((el) => obs!.observe(el));
    }, 80);
    return () => { clearTimeout(id); obs?.disconnect(); };
  }, [tab]);

  /* Scroll to top on tab switch */
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [tab]);

  const switchTab = useCallback((t: Tab) => {
    setTab(t);
    window.history.replaceState(null, "", `#${t}`);
  }, []);

  return (
    <>
      <Cursor />
      {!ready && <Intro onDone={() => setReady(true)} />}
      <div style={{ opacity: ready ? 1 : 0, transition: "opacity 0.5s" }}>
        <Navbar
          active={tab}
          onSwitch={switchTab}
          user={user}
          onLoginClick={() => setAuthOpen(true)}
          onLogout={() => { endSession(); setUser(null); }}
        />
        <main style={{ paddingTop: "68px" }}>
          <HomeView         active={tab === "home"}          onSwitch={switchTab} />
          <AboutView        active={tab === "about"} />
          <GamesView        active={tab === "games"}         onSwitch={switchTab} />
          <DownloadsView    active={tab === "downloads"} />
          <NewsView         active={tab === "news"} />
          <JoinView         active={tab === "join"}          onSwitch={switchTab} />
          <BlogView         active={tab === "blog"} />
          <AchievementsView active={tab === "achievements"} user={user} />
        </main>
        <footer>
          <div className="footer-wm" aria-hidden="true">SYNTHRIX</div>
          <div className="footer-in">
            <div>
              <div className="fl-name">SYNTHRIX STUDIO</div>
              <div className="fl-sub">BORN IN BANGLADESH &nbsp;·&nbsp; EST. 2025</div>
            </div>
            <div className="footer-links">
              {VALID_TABS.map((t) => (
                <a key={t} href={`#${t}`} onClick={(e) => { e.preventDefault(); switchTab(t); }}>
                  {t.toUpperCase()}
                </a>
              ))}
              <a href="https://youtube.com/@synthrixstudio" target="_blank" rel="noopener">YOUTUBE</a>
              <a href="https://discord.gg/eT8RDu4YCU" target="_blank" rel="noopener">DISCORD</a>
            </div>
            <div className="footer-copy">&copy; 2025 SYNTHRIX STUDIO &nbsp;&middot;&nbsp; ALL RIGHTS RESERVED</div>
          </div>
        </footer>
      </div>
      {authOpen && (
        <UserAuth
          onLogin={u => { setUser(u); setAuthOpen(false); }}
          onClose={() => setAuthOpen(false)}
        />
      )}
    </>
  );
}
