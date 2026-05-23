import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Archive", path: "/" },
    { name: "Visions", path: "/" },
    { name: "Manifesto", path: "/" },
    { name: "Comm", path: "/" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 mix-blend-difference">
      <div className="w-full px-6 md:px-12 h-24 flex items-center justify-between border-b border-zinc-100/10">
        <Link to="/" className="flex flex-col items-start group">
          <span className="text-xl font-black tracking-tighter uppercase text-zinc-100">
            Synthrix
          </span>
          <span className="text-[0.65rem] font-mono tracking-[0.2em] text-zinc-500 uppercase group-hover:text-zinc-300 transition-colors">
            Interactive Arts
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-xs font-mono tracking-[0.1em] uppercase text-zinc-400 hover:text-zinc-100 transition-colors relative group"
            >
              {link.name}
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-rose-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="relative px-6 py-2 text-xs font-mono tracking-widest uppercase text-zinc-100 overflow-hidden group border border-zinc-800 hover:border-zinc-500 transition-colors">
            <span className="relative z-10">Initiate</span>
            <div className="absolute inset-0 bg-zinc-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0" />
            <span className="absolute inset-0 z-10 flex items-center justify-center text-zinc-950 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
              Initiate
            </span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6 stroke-[1.5]" /> : <Menu className="w-6 h-6 stroke-[1.5]" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-0 left-0 w-full bg-zinc-950 flex flex-col items-center justify-center gap-8 z-[-1]"
          >
            {navLinks.map((link, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={link.name}
              >
                <Link
                  to={link.path}
                  className="text-2xl font-serif italic text-zinc-400 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
