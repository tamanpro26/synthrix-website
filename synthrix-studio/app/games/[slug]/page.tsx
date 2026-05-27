import { notFound } from "next/navigation";
import { GAMES, getGame } from "@/lib/games";
import GamePageContent from "@/components/views/GamePageContent";
import type { Metadata } from "next";

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) return { title: "Game Not Found" };
  return {
    title: `${game.title} — SYNTHRIX Studio`,
    description: game.longDesc,
  };
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();
  return <GamePageContent game={game} />;
}
