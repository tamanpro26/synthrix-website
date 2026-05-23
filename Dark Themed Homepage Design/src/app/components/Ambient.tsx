import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function Ambient() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Global Grain/Noise */}
      <div 
        className="absolute inset-0 opacity-[0.04] mix-blend-difference"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Slow pulsing ambient light */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-rose-900/20 blur-[120px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-zinc-600/10 blur-[150px]"
      />

      {/* Mouse follower light (subtle) */}
      <motion.div
        className="hidden md:block absolute w-[40vw] h-[40vw] rounded-full bg-rose-900/10 blur-[100px] -translate-x-1/2 -translate-y-1/2"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{
          type: "spring",
          stiffness: 20,
          damping: 15,
          mass: 1
        }}
      />
    </div>
  );
}
