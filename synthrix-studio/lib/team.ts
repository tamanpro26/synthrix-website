export type Unit = "SYNDICATE" | "PROTOCOL" | "FRONTIER" | "DIVISION" | "AXIS" | "MENTOR";

export interface Member {
  id: string;
  name: string;
  skill: string;
  unit: Unit;
  rp?: number;
  badge?: string;
  isFounder?: boolean;
}

export const UNIT_COLORS: Record<Unit, string> = {
  SYNDICATE: "#FF6B35",
  PROTOCOL:  "#00C9B8",
  FRONTIER:  "#8B5CF6",
  DIVISION:  "#F5A623",
  AXIS:      "#EC4899",
  MENTOR:    "#6B7280",
};

export const TEAM: Member[] = [
  { id: "founder", name: "SUVOM KUNDU",   skill: "FOUNDER · LEAD GAME DEV · UNITY", unit: "PROTOCOL", rp: 999, badge: "FOUNDER & DIRECTOR", isFounder: true },
  { id: "taman",   name: "TAMAN",         skill: "CO-FOUNDER · WEB DEV · AI SYSTEMS", unit: "PROTOCOL", rp: 500, badge: "CO-FOUNDER", isFounder: true },
  { id: "mentor",  name: "SKYARK",        skill: "SENIOR ADVISOR",                    unit: "MENTOR" },
  { id: "#101",    name: "LK PLAYZ",      skill: "GAME DEV · UNITY",                 unit: "SYNDICATE" },
  { id: "#102",    name: "WILD",          skill: "WEB DEV · NEXT.JS / REACT",        unit: "PROTOCOL", rp: 30, badge: "SOLE WEB DEVELOPER" },
  { id: "#103",    name: "HASAN-AYUB",    skill: "GAME DEV · UNITY",                 unit: "SYNDICATE" },
  { id: "#104",    name: "SURVIVAL74",    skill: "3D MODELLING · ASSET CREATION",    unit: "FRONTIER" },
  { id: "#105",    name: "PIYUSH",        skill: "GAME DEV · UNITY",                 unit: "SYNDICATE" },
  { id: "#106",    name: "PRANKEY",       skill: "GAME DESIGNER · LEVEL DESIGN",     unit: "DIVISION", badge: "SOLE GAME DESIGNER" },
  { id: "#107",    name: "UNITYVERSE",    skill: "GAME DEV · UNITY",                 unit: "FRONTIER" },
  { id: "#108",    name: "LAZY ZONE",     skill: "GAME DEV · UNITY",                 unit: "FRONTIER" },
  { id: "#109",    name: "CHILL GUY",     skill: "GAME DEV · UNITY",                 unit: "SYNDICATE" },
  { id: "#110",    name: "LIGHT",         skill: "GAME DEV · UNITY",                 unit: "PROTOCOL" },
  { id: "#111",    name: "SHADOWREN21",   skill: "GAME DEV · UNITY",                 unit: "AXIS" },
  { id: "#112",    name: "IGNITEASCND",   skill: "GAME DEV · UNITY",                 unit: "PROTOCOL" },
  { id: "#113",    name: "JOTEEN1856",    skill: "GAME DEV · UNITY",                 unit: "AXIS" },
  { id: "#114",    name: "PRASOON",       skill: "GAME DEV · UNITY",                 unit: "AXIS" },
  { id: "#115",    name: "LEGENDHAPPYZ",  skill: "GAME DEV · UNITY",                 unit: "AXIS", rp: 2 },
  { id: "#116",    name: "UI_DANIAL",     skill: "GAME DEV · UNITY",                 unit: "SYNDICATE" },
  { id: "#117",    name: "FANG YUAN",     skill: "ARTIST · VISUAL DESIGN",           unit: "SYNDICATE" },
  { id: "#118",    name: "ZAMYAMTENZ124", skill: "GAME DEV · UNITY · SOCIAL MEDIA",  unit: "DIVISION" },
  { id: "#119",    name: "PRINCE_DBX",    skill: "VOICE ARTIST · AUDIO",             unit: "AXIS" },
];
