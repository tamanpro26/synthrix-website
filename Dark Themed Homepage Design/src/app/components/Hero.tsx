import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Abstract Background Imagery with continuous slow motion */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 1, 0]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 z-0"
      >
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1608501821300-4f99e58bba77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGZsdWlkJTIwZGFyayUyMG1hY3JvfGVufDF8fHx8MTc3OTQ0NTAyOHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Abstract dark fluid"
          className="w-full h-full object-cover opacity-60 grayscale-[50%]"
        />
        {/* Gradients to merge into the black background */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-zinc-950" />
      </motion.div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full px-6 md:px-12 flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-[12vw] leading-[0.8] font-black tracking-tighter uppercase text-zinc-100 mix-blend-overlay opacity-90 text-center flex flex-col items-center">
            <span>Forge</span>
            <span className="font-serif italic text-[14vw] text-zinc-300 font-normal tracking-normal lowercase -mt-[4vw]">
              Realities
            </span>
          </h1>
        </motion.div>

        {/* Brutalist details */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 flex flex-col gap-24 text-[0.6rem] font-mono tracking-widest text-zinc-500 uppercase rotate-180"
          style={{ writingMode: 'vertical-rl' }}
        >
          <span>V.1.0.4 // Build</span>
          <span>Sys.Ops Active</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute right-6 md:right-12 bottom-24 text-[0.65rem] font-mono tracking-[0.2em] text-zinc-500 uppercase max-w-[200px] text-right"
        >
          <p>We build interactive experiences where your choices bleed into the narrative.</p>
        </motion.div>
      </div>

      {/* Scrolling Marquee Bottom */}
      <div className="absolute bottom-0 w-full border-t border-zinc-100/10 bg-zinc-950/50 backdrop-blur-md py-3 overflow-hidden z-20">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex whitespace-nowrap gap-8 text-xs font-mono tracking-widest uppercase text-zinc-500"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8">
              <span>Enter The Void</span>
              <span className="w-1 h-1 bg-rose-700 rounded-full" />
              <span>New Release</span>
              <span className="w-1 h-1 bg-zinc-700 rounded-full" />
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
