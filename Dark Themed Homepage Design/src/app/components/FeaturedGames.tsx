import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const GAMES = [
  {
    id: "01",
    title: "Cyber Void",
    genre: "Kinetic Action",
    desc: "A brutalist exploration of memory and machinery.",
    image: "https://images.unsplash.com/photo-1595065820514-a4181d40f2c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwaGlnaCUyMGZhc2hpb24lMjB0ZWNofGVufDF8fHx8MTc3OTQ0NTAyOHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "02",
    title: "Abyssal Keep",
    genre: "Atmospheric Horror",
    desc: "Descent into the architecture of the mind.",
    image: "https://images.unsplash.com/photo-1504625709867-b4e45e3bb9dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnV0YWxpc3QlMjBkYXJrJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3OTQ0NTAyOHww&ixlib=rb-4.1.0&q=80&w=1080",
  }
];

export function FeaturedGames() {
  return (
    <section className="py-32 relative w-full border-t border-zinc-100/10">
      <div className="px-6 md:px-12 w-full">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-100/10 pb-8">
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-zinc-100">
            Current <br /> <span className="font-serif italic font-normal text-zinc-500 lowercase">Visions</span>
          </h2>
          <div className="text-[0.65rem] font-mono tracking-widest text-zinc-500 uppercase text-right max-w-xs">
            Uncompromising aesthetics. Punishing loops.
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-0 md:border-l md:border-zinc-100/10">
          {GAMES.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: i * 0.2 }}
              className="group relative flex flex-col md:border-r md:border-b-0 border-b border-zinc-100/10 p-6 md:p-12"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden mb-8 bg-zinc-900">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="w-full h-full"
                >
                  <ImageWithFallback
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                  />
                </motion.div>
                {/* Decorative overlay lines */}
                <div className="absolute inset-0 border border-zinc-100/10 m-4 pointer-events-none mix-blend-overlay" />
              </div>

              {/* Typography / Details */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono tracking-widest text-zinc-500 mb-4">
                    [{game.id}]
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter uppercase text-zinc-100 mb-2 group-hover:text-rose-700 transition-colors">
                    {game.title}
                  </h3>
                  <p className="font-serif italic text-zinc-400">
                    {game.desc}
                  </p>
                </div>
                <div className="text-[0.6rem] font-mono tracking-widest uppercase text-zinc-600 rotate-90 origin-right translate-y-4">
                  {game.genre}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
