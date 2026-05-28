export interface Game {
  slug: string;
  title: string;
  subtitle?: string;
  genre: string;
  engine: string;
  status: "released" | "coming-soon";
  year: string;
  description: string;
  longDesc: string;
  image: string;
  downloadUrl?: string;
  downloadSize?: string;
  isFeatured?: boolean;
  isComingSoon?: boolean;
  type?: "game" | "tool";
  tags: string[];
}

export const GAMES: Game[] = [
  {
    slug: "escape-the-bridge",
    title: "Escape the Bridge",
    subtitle: "Zombie Survival",
    genre: "HORROR SURVIVAL",
    engine: "UNITY",
    status: "released",
    year: "2025",
    description: "Survive the bridge. Outrun the horde. One way out.",
    longDesc: "A pulse-pounding zombie survival horror set on a crumbling bridge as the undead close in from every direction. Every second counts. Every bullet matters.",
    image: "https://img.itch.zone/aW1nLzIyOTExMzU0LnBuZw==/original/EotLYN.png",
    downloadUrl: "https://github.com/tamanpro26/synthrix-game-releases/releases/download/v1.0/ESCAPE.THE.BRIDGE.Zombie.survival.exe",
    downloadSize: "~957 MB",
    isFeatured: true,
    type: "game",
    tags: ["HORROR", "SURVIVAL", "ZOMBIE", "ACTION"],
  },
  {
    slug: "boom",
    title: "BOOM",
    genre: "FPS ACTION",
    engine: "UNITY",
    status: "released",
    year: "2025",
    description: "Fast. Brutal. No mercy.",
    longDesc: "A raw first-person shooter built for speed and chaos. No cutscenes. No hand-holding. Just you and the enemy.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=90",
    downloadUrl: undefined,
    downloadSize: undefined,
    type: "game",
    tags: ["FPS", "ACTION", "SHOOTER"],
  },
  {
    slug: "overdrive",
    title: "OVERDRIVE",
    genre: "ARCADE RACING",
    engine: "UNITY",
    status: "released",
    year: "2025",
    description: "Push the limit. Break the track.",
    longDesc: "An adrenaline-fuelled arcade racer where speed is law. Drift through neon-lit circuits, dodge hazards, and leave the competition burning.",
    image: "https://img.itch.zone/aW1nLzIzNDYxNTI3LmpwZw==/original/NLTnuO.jpg",
    downloadUrl: "https://github.com/tamanpro26/synthrix-game-releases/releases/download/v1.0/OVERDRIVE.zip",
    downloadSize: "~414 MB",
    type: "game",
    tags: ["RACING", "ARCADE", "SPEED"],
  },
  {
    slug: "synthpad-2",
    title: "SYNTHPAD 2.0",
    genre: "DEV TOOL",
    engine: "UNITY",
    status: "released",
    year: "2025",
    description: "A developer notepad built by devs, for devs.",
    longDesc: "SYNTHPAD 2.0 is a lightweight, fast developer notepad with code-formatting support, dark theme, and a clean UI. Built for game devs who need to jot ideas without friction.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=90",
    downloadUrl: "https://github.com/tamanpro26/synthrix-game-releases/releases/download/v1.0/SYNTHPAD.2.1.Setup.exe",
    downloadSize: "63 MB",
    type: "tool",
    tags: ["TOOL", "DEV", "UTILITY"],
  },
  {
    slug: "rhinos-last-protocol",
    title: "Rhino's Last Protocol",
    genre: "SCI-FI SHOOTER",
    engine: "UNREAL ENGINE",
    status: "coming-soon",
    year: "TBA",
    description: "The flagship. Dark. Relentless. Unforgettable.",
    longDesc: "Set in 2087 post-collapse Bangladesh, Rhino's Last Protocol is SYNTHRIX Studio's magnum opus — a cinematic sci-fi shooter with deep narrative, brutal combat, and a world unlike anything in indie gaming.",
    image: "",
    isComingSoon: true,
    type: "game",
    tags: ["SCI-FI", "SHOOTER", "NARRATIVE", "FLAGSHIP"],
  },
];

export function getGame(slug: string) {
  return GAMES.find((g) => g.slug === slug);
}
