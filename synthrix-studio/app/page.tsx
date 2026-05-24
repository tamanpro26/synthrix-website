"use client";
import { useState, useEffect, useRef } from "react";
import Cursor from "@/components/Cursor";
import Intro from "@/components/Intro";
import Navbar from "@/components/Navbar";
import HomeView from "@/components/views/HomeView";
import AboutView from "@/components/views/AboutView";
import GamesView from "@/components/views/GamesView";
import DownloadsView from "@/components/views/DownloadsView";
import NewsView from "@/components/views/NewsView";
import BlogView from "@/components/views/BlogView";
import JoinView from "@/components/views/JoinView";
import AchievementsView from "@/components/views/AchievementsView";

export type Tab =
  | "home" | "about" | "games" | "downloads"
  | "news"  | "blog"  | "join"  | "achievements";

const VIEWS: { id: Tab; label: string }[] = [
  { id: "home",         label: "HOME" },
  { id: "about",        label: "ABOUT" },
  { id: "games",        label: "GAMES" },
  { id: "downloads",    label: "DOWNLOADS" },
  { id: "news",         label: "NEWS" },
  { id: "blog",         label: "BLOG" },
  { id: "join",         label: "JOIN" },
  { id: "achievements", label: "ACHIEVEMENTS" },
];

export default function StudioPage() {
  const [intro, setIntro]   = useState(true);
  const [tab, setTab]       = useState<Tab>("home");
  const mainRef             = useRef<HTMLDivElement>(null);

  /* Reveal observer */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [tab]);

  /* Scroll to top on tab switch */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [tab]);

  const switchTab = (t: Tab) => { setTab(t); };

  return (
    <>
      <Cursor />
      {intro && <Intro onDone={() => setIntro(false)} />}
      <div ref={mainRef} style={{ opacity: intro ? 0 : 1, transition: "opacity 0.5s" }}>
        <Navbar active={tab} onSwitch={switchTab} />
        <main style={{ paddingTop: "96px" }}>
          {tab === "home"         && <HomeView onSwitch={switchTab} />}
          {tab === "about"        && <AboutView />}
          {tab === "games"        && <GamesView />}
          {tab === "downloads"    && <DownloadsView />}
          {tab === "news"         && <NewsView />}
          {tab === "blog"         && <BlogView />}
          {tab === "join"         && <JoinView />}
          {tab === "achievements" && <AchievementsView />}
        </main>
        <footer className="border-t text-center py-8" style={{ borderColor: "var(--bord)", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "4px", color: "var(--muted)" }}>
          SYNTHRIX STUDIO &nbsp;·&nbsp; BANGLADESH &nbsp;·&nbsp; EST. 2025 &nbsp;·&nbsp; ALL GAMES FREE
        </footer>
      </div>
    </>
  );
}
