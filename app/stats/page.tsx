import { LeaderboardConfig } from "../interfaces/LeaderboardConfig";
import Emojis from "../lib/constants/emojis";
import Leaderboard from "../ui/Leaderboard";
import { fetchAllPlayers } from "../services/db.service";

export const dynamic = 'force-dynamic';

export default async function StatsPage(){

    //TODO
    //better way to handle leaderboard colors
    const players = await fetchAllPlayers();

    const sortedPlayersByGoals = [...players].sort((a, b) => (b.totalgoals || 0) - (a.totalgoals || 0));
    const sortedPlayersByPoints = [...players].sort((a, b) => (b.totalpoints || 0) - (a.totalpoints || 0));

    const ballondOrLeaderboardList: string[] = sortedPlayersByPoints.map(player => `${player.firstname} - ${player.totalpoints} pts`);
    const ballondOrLeaderboardConfig: LeaderboardConfig = {
        lightModeColor: "lightModeTextRose",
        darkModeColor: "darkModeBorderRose",
        headerText: "Road to Ballon d'Or",
        displayEmoji: Emojis.ballondorBoardEmoji,
        sortedList: ballondOrLeaderboardList
    };

    const goldenBootLeaderboardList: string[] = sortedPlayersByGoals.map(player => `${player.firstname} - ${player.totalgoals} ${Emojis.goalEmoji}`);
    const goldenBootLeaderboardConfig: LeaderboardConfig = {
        lightModeColor: "lightModeTextSky",
        darkModeColor: "darkModeBorderSky",
        headerText: "Road to Golden Boot",
        displayEmoji: Emojis.goldenBootBoardEmoji,
        sortedList: goldenBootLeaderboardList
    };

    return (
        <div className="flex flex-col p-5 justify-around items-center gap-3 md:flex-row md:justify-center min-h-[100%]">
            <Leaderboard leaderboardConfig={ballondOrLeaderboardConfig}></Leaderboard>
            <Leaderboard leaderboardConfig={goldenBootLeaderboardConfig}></Leaderboard>  
        </div>
    )
}