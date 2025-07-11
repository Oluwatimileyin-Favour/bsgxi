import { LeaderboardConfig } from "../interfaces/LeaderboardConfig";
import Emojis from "../lib/emojis";
import Leaderboard from "../ui/Leaderboard";
import { fetchAllPlayers } from "../services/db.service";
import ClassicoTable from "./ClassicoTable";
import { LeaderBoardColours } from "../lib/TailwindColours";

export const dynamic = 'force-dynamic';

export default async function StatsPage(){

    //TODO
    //better way to handle leaderboard colors
    //refer to chatgpt chat to fully understand why tailwind can read it with the static object and how to find an alternative workable, cleaner and clearer implementation
    const players = await fetchAllPlayers();

    const sortedPlayersByGoals = [...players].sort((a, b) => (b.totalgoals || 0) - (a.totalgoals || 0));
    const sortedPlayersByPoints = [...players].sort((a, b) => (b.totalpoints || 0) - (a.totalpoints || 0));

    const ballondOrLeaderboardList: string[] = sortedPlayersByPoints.map(player => `${player.firstname} - ${player.totalpoints} pts`);
    const ballondOrLeaderboardConfig: LeaderboardConfig = {
        lightModeColor: LeaderBoardColours.lightModeTextRose,
        darkModeColor: LeaderBoardColours.darkModeBorderRose,
        headerText: "Road to Ballon d'Or",
        displayEmoji: Emojis.ballondorBoardEmoji,
        sortedList: ballondOrLeaderboardList
    };

    const goldenBootLeaderboardList: string[] = sortedPlayersByGoals.map(player => `${player.firstname} - ${player.totalgoals} ${Emojis.goalEmoji}`);
    const goldenBootLeaderboardConfig: LeaderboardConfig = {
        lightModeColor: LeaderBoardColours.lightModeTextSky,
        darkModeColor: LeaderBoardColours.darkModeBorderSky,
        headerText: "Road to Golden Boot",
        displayEmoji: Emojis.goldenBootBoardEmoji,
        sortedList: goldenBootLeaderboardList
    };

    return (
        <div className="flex flex-col justify-center min-h-[100%] gap-2 py-2">
            <ClassicoTable/>
            <div className="flex flex-col p-5 justify-around items-center gap-3 md:flex-row md:justify-center">
                <Leaderboard leaderboardConfig={ballondOrLeaderboardConfig}></Leaderboard>
                <Leaderboard leaderboardConfig={goldenBootLeaderboardConfig}></Leaderboard>  
            </div>
        </div>
    )
}