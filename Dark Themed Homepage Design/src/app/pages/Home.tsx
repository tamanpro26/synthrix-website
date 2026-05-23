import { Hero } from "../components/Hero";
import { FeaturedGames } from "../components/FeaturedGames";
import { motion } from "motion/react";

export function Home() {
  return (
    <div className="w-full">
      <Hero />
      <Manifesto />
      <FeaturedGames />
    </div>
  );
}

function Manifesto() {
  const lines = [
    "We reject the sanitized.",
    "We embrace the atmospheric.",
    "Interaction as art. Art as interaction."
  ];

  return (
    <section className="py-32 md:py-48 relative w-full flex items-center justify-center">
      <div className="w-full max-w-4xl px-6 relative z-10 flex flex-col items-center text-center">
        <div className="text-[0.65rem] font-mono tracking-[0.3em] text-zinc-500 uppercase mb-16">
          [ The Doctrine ]
        </div>

        <div className="space-y-4 md:space-y-8 w-full">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: i * 0.2 }}
              className="overflow-hidden"
            >
              <h2 className="text-2xl md:text-5xl font-black tracking-tighter uppercase text-zinc-300">
                {line}
              </h2>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-24 w-px h-32 bg-gradient-to-b from-zinc-500 to-transparent"
        />
      </div>
    </section>
  );
}
