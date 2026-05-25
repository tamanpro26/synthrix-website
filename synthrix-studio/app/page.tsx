"use client";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Cursor from "@/components/Cursor";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import AudioPlayer from "@/components/AudioPlayer";
import HomeView from "@/components/views/HomeView";
import GamesView from "@/components/views/GamesView";
import LoreView from "@/components/views/LoreView";
import NewsView from "@/components/views/NewsView";
import ContactView from "@/components/views/ContactView";
import SiteFooter from "@/components/SiteFooter";

export type Tab = "home" | "games" | "lore" | "news" | "contact";
const VALID_TABS: Tab[] = ["home", "games", "lore", "news", "contact"];

export default function StudioPage() {
  const [loaded, setLoaded] = useState(false);
  const [dark, setDark]     = useState(true);
  const [tab, setTab]       = useState<Tab>("home");

  /* Apply dark class to body */
  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  /* Init tab from URL hash */
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

  /* Scroll-reveal observer */
  useEffect(() => {
    let obs: IntersectionObserver | null = null;
    const id = setTimeout(() => {
      obs = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("active"); }),
        { threshold: 0.05 }
      );
      document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => obs!.observe(el));
    }, 420);
    return () => { clearTimeout(id); obs?.disconnect(); };
  }, [tab]);

  /* Scroll to top on tab switch */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [tab]);

  const switchTab = useCallback((t: Tab) => {
    setTab(t);
    window.history.replaceState(null, "", `#${t}`);
  }, []);

  return (
    <>
      <Cursor />
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s" }}>
        <Navbar active={tab} onSwitch={switchTab} dark={dark} onToggleDark={() => setDark(d => !d)} />
        <main style={{ paddingTop: "52px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            >
              {tab === "home"    && <HomeView onSwitch={switchTab} />}
              {tab === "games"   && <GamesView onSwitch={switchTab} />}
              {tab === "lore"    && <LoreView onSwitch={switchTab} />}
              {tab === "news"    && <NewsView />}
              {tab === "contact" && <ContactView />}
            </motion.div>
          </AnimatePresence>
        </main>
        <SiteFooter />
        <AudioPlayer />
      </div>
    </>
  );
}
