'use client'

import { LeaderboardConfig } from "../interfaces/LeaderboardConfig";
import Emojis from "../lib/emojis";
import Leaderboard from "../ui/Leaderboard";
import { LeaderBoardColours } from "../lib/TailwindColours";
import { GlobalAppDataContext } from "../context/GlobalAppDataContext";
import { useContext, useState } from "react";
import { GetPlayersSeasonStats } from "../services/player.service";
import { getAllSeasonYears, getSeasonYear } from "../services/date.service";
import Dropdown from "../ui/Dropdown";

export const dynamic = 'force-dynamic';

export default function StatsPage(){

    //TODO
    //better way to handle leaderboard colors
    const {playersSeasonStats, season, setSeason} = useContext(GlobalAppDataContext);

    const [potmLeaderboardYear, setPotmLeaderboardYear] = useState<string>(getSeasonYear(season).toString());

    function handleYearChange(selectionIdx: number){ //todo do properly

      const selectedYear = getAllSeasonYears()[selectionIdx];
      setPotmLeaderboardYear(selectedYear);

      if(selectedYear === '2025') setSeason(1)
      else setSeason(2)
    }

    const sortedPlayersByGoals = [...playersSeasonStats].sort((a, b) => (b.goals || 0) - (a.goals || 0));
    const sortedPlayersByPoints = [...playersSeasonStats].sort((a, b) => (b.points || 0) - (a.points || 0));

    const ballondOrLeaderboardList: string[] = sortedPlayersByPoints.map(player => `${player.username} - ${player.points} pts`);
    const ballondOrLeaderboardConfig: LeaderboardConfig = {
        lightModeColor: LeaderBoardColours.lightModeTextRose,
        darkModeColor: LeaderBoardColours.darkModeBorderRose,
        headerText: "Road to Ballon d'Bsg",
        displayEmoji: Emojis.ballondorBoardEmoji,
        sortedList: ballondOrLeaderboardList
    };

    const goldenBootLeaderboardList: string[] = sortedPlayersByGoals.map(player => `${player.username} - ${player.goals} ${Emojis.goalEmoji}`);
    const goldenBootLeaderboardConfig: LeaderboardConfig = {
        lightModeColor: LeaderBoardColours.lightModeTextSky,
        darkModeColor: LeaderBoardColours.darkModeBorderSky,
        headerText: "Road to Golden Boot",
        displayEmoji: Emojis.goldenBootBoardEmoji,
        sortedList: goldenBootLeaderboardList
    };

    return (
        <div className="flex flex-col justify-center min-h-[100%] gap-2 py-2">
            {/* <ClassicoTable/> */}
            <Dropdown menuItems={getAllSeasonYears()} selectedItem={potmLeaderboardYear} reactToSelection={handleYearChange} displayTextSize="text-xl"></Dropdown>
            <div className="flex flex-col p-5 justify-around items-center gap-3 md:flex-row md:justify-center">
                <Leaderboard leaderboardConfig={ballondOrLeaderboardConfig}></Leaderboard>
                <Leaderboard leaderboardConfig={goldenBootLeaderboardConfig}></Leaderboard>  
            </div>
        </div>
    )
}