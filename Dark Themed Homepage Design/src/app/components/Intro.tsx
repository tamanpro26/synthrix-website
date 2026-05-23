import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export function Intro({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const sequence = async () => {
      // Stage 1: SYSTEM BOOT
      await new Promise(r => setTimeout(r, 800));
      setStage(1);
      // Stage 2: SYNTHRIX massive reveal
      await new Promise(r => setTimeout(r, 1200));
      setStage(2);
      // Stage 3: Fade out
      await new Promise(r => setTimeout(r, 1500));
      onComplete();
    };
    sequence();
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        key="intro-container"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, filter: "blur(20px)" }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950 text-zinc-100 overflow-hidden"
      >
        {/* Ambient grain in intro */}
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZ3JpdHR5JTIwYWJzdHJhY3QlMjB0ZXh0dXJlfGVufDF8fHx8MTc3OTQzMjA0MHww&ixlib=rb-4.1.0&q=80&w=1080')] mix-blend-overlay pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {stage === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs font-mono tracking-[0.3em] text-zinc-500 uppercase"
            >
              [ SYS.INIT_SEQUENCE ]
            </motion.div>
          )}

          {stage >= 1 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, letterSpacing: "0.1em" }}
              animate={{ scale: 1, opacity: 1, letterSpacing: "0.2em" }}
              exit={{ scale: 1.1, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-8xl font-black tracking-tighter uppercase flex items-center gap-4"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">
                Synthrix
              </span>
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-rose-700 font-serif italic text-3xl md:text-7xl lowercase tracking-normal"
              >
                studio
              </motion.span>
            </motion.div>
          )}

          {stage >= 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-20 text-[0.65rem] font-mono tracking-[0.2em] text-zinc-600 uppercase"
            >
              Establishing neural link...
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
