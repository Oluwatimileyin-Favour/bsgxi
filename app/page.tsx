import HomePage from "./home/HomePage";
import { prisma } from "./lib/prisma";

export const dynamic = 'force-dynamic';

export default async function App() {

  const players = await prisma.player.findMany();
  const gameweeks = await prisma.gameweek.findMany();
  const gameweekstats = await prisma.gameweekstat.findMany();

  return (
    <HomePage players={players} gameweeks={gameweeks} gameweekstats={gameweekstats}></HomePage>
  );
}
