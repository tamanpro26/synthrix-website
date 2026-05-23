import { createBrowserRouter, Outlet } from "react-router";
import { useState, useEffect } from "react";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Intro } from "./components/Intro";
import { Ambient } from "./components/Ambient";
import { AnimatePresence } from "motion/react";

function Root() {
  const [introDone, setIntroDone] = useState(false);

  // Fallback to ensure app loads if animation gets stuck
  useEffect(() => {
    const timer = setTimeout(() => setIntroDone(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-rose-900/50 font-sans relative">
      <AnimatePresence>
        {!introDone && <Intro onComplete={() => setIntroDone(true)} />}
      </AnimatePresence>

      <Ambient />
      
      {/* We keep the main app mounted but fade it in subtly or let it rest behind the intro */}
      <div className={`relative z-10 transition-opacity duration-1000 ${introDone ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-sm font-mono tracking-widest text-zinc-500">[ 404 - SYSTEM OFFLINE ]</h1>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "*", Component: NotFound },
    ],
  },
]);
