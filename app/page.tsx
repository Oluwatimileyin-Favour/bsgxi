import HomePage from "./home/HomePage";
import {fetchAllGameweeks, fetchAllGameweekStats, fetchAllPlayers} from "./services/db.service";

export const dynamic = 'force-dynamic';

export default async function App() {

  const players = await fetchAllPlayers(); 
  const gameweeks = await fetchAllGameweeks();
  const gameweekstats = await fetchAllGameweekStats();

  return (
    <HomePage players={players} gameweeks={gameweeks} gameweekstats={gameweekstats}></HomePage>
  );
}
