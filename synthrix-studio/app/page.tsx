"use client";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

const VALID_TABS: Tab[] = ["home","about","games","downloads","news","blog","join","achievements"];

export default function StudioPage() {
  const [intro, setIntro] = useState(true);
  const [tab, setTab]     = useState<Tab>("home");
  const mainRef           = useRef<HTMLDivElement>(null);

  /* Init from URL hash */
  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as Tab;
    if (VALID_TABS.includes(hash)) setTab(hash);

    const onHash = () => {
      const h = window.location.hash.replace("#", "") as Tab;
      if (VALID_TABS.includes(h)) setTab(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

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

  const switchTab = (t: Tab) => {
    setTab(t);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${t}`);
    }
  };

  return (
    <>
      <Cursor />
      {intro && <Intro onDone={() => setIntro(false)} />}
      <div ref={mainRef} style={{ opacity: intro ? 0 : 1, transition: "opacity 0.5s" }}>
        <Navbar active={tab} onSwitch={switchTab} />
        <main style={{ paddingTop: "96px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.2, 0.9, 0.4, 1] }}
            >
              {tab === "home"         && <HomeView onSwitch={switchTab} />}
              {tab === "about"        && <AboutView />}
              {tab === "games"        && <GamesView />}
              {tab === "downloads"    && <DownloadsView />}
              {tab === "news"         && <NewsView />}
              {tab === "blog"         && <BlogView />}
              {tab === "join"         && <JoinView />}
              {tab === "achievements" && <AchievementsView />}
            </motion.div>
          </AnimatePresence>
        </main>
        <footer className="border-t text-center py-8" style={{ borderColor: "var(--bord)", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "4px", color: "var(--muted)" }}>
          SYNTHRIX STUDIO &nbsp;·&nbsp; BANGLADESH &nbsp;·&nbsp; EST. 2025 &nbsp;·&nbsp; ALL GAMES FREE
        </footer>
      </div>
    </>
  );
}
