export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-100/10 pt-24 pb-12 px-6 md:px-12 relative z-10">
      <div className="flex flex-col md:flex-row items-start justify-between gap-16 mb-24">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase text-zinc-100 mb-2">
            Synthrix
          </h2>
          <p className="font-serif italic text-zinc-500">
            Interactive Arts
          </p>
        </div>

        <div className="grid grid-cols-2 gap-16 text-[0.65rem] font-mono tracking-widest uppercase">
          <div className="flex flex-col gap-4">
            <span className="text-zinc-600 mb-4 border-b border-zinc-800 pb-2">Index</span>
            <a href="#" className="text-zinc-400 hover:text-zinc-100 transition-colors">Archive</a>
            <a href="#" className="text-zinc-400 hover:text-zinc-100 transition-colors">Visions</a>
            <a href="#" className="text-zinc-400 hover:text-zinc-100 transition-colors">Manifesto</a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-zinc-600 mb-4 border-b border-zinc-800 pb-2">Network</span>
            <a href="#" className="text-zinc-400 hover:text-zinc-100 transition-colors">X / Twitter</a>
            <a href="#" className="text-zinc-400 hover:text-zinc-100 transition-colors">Discord</a>
            <a href="#" className="text-zinc-400 hover:text-zinc-100 transition-colors">GitHub</a>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-zinc-100/10 text-[0.6rem] font-mono tracking-widest uppercase text-zinc-600">
        <p>SYS.OP. © {new Date().getFullYear()}</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
