import { Matchday } from "@/generated/prisma/client";
import { useContext, useState } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import { GlobalAppDataContext } from "../context/GlobalAppDataContext";
import { LeaderboardConfig } from "../interfaces/LeaderboardConfig";
import { PlayerWithMonthPoint } from "../interfaces/PlayerWithMonthPoint";
import Emojis from "../lib/emojis";
import { LeaderBoardColours } from "../lib/TailwindColours";
import { getAllSeasonYears, getCurrentMonth, getMonthName, getSeasonYear, isDateInMonth } from "../services/date.service";
import Dropdown from "../ui/Dropdown";

export default function PotmLeaderboard(){

  //TODO  
  //clean this up

    const {playersSeasonStats, matchdays, matchdayStats, season, setSeason} = useContext(GlobalAppDataContext);

    const [potmLeaderboardMonth, setPotmLeaderboardMonth] = useState<number>(getCurrentMonth());
    const [potmLeaderboardYear, setPotmLeaderboardYear] = useState<string>(getSeasonYear(season).toString());

    function updatePotmTableData(monthChange: number) {
        // don't allow going past current month
        setPotmLeaderboardMonth(prevMonth => {
            const newMonth = prevMonth + monthChange;
            if (newMonth < 0) return 11;
            if (newMonth > 11) return 0;
            return newMonth;
        });
    }

    function handleYearChange(selectionIdx: number){ //todo do properly

      const selectedYear = getAllSeasonYears()[selectionIdx];
      setPotmLeaderboardYear(selectedYear);

      if(selectedYear === '2025') setSeason(1)
      else setSeason(2)
    }

    const chosenMonthGameweeks: Matchday[] = matchdays.filter((matchday) => (
        isDateInMonth(Number(potmLeaderboardYear), potmLeaderboardMonth, matchday.date)
    ))
    
    // list of players with their corresponding points accrued for current month
    const playersWithMonthPoints: PlayerWithMonthPoint[] = playersSeasonStats
        .map(playerSeasonStat => {
                let points = 0
                chosenMonthGameweeks.forEach(matchday => {
                    points += matchdayStats.find(matchdayStat => (matchdayStat.matchday_id === matchday.id && matchdayStat.player_id === playerSeasonStat.player_id))?.points ?? 0
                })
                return {player: playerSeasonStat, monthPoints:points}
            });

    const sortedPlayersByMonthPoints: PlayerWithMonthPoint[] = [...playersWithMonthPoints].sort((a, b) => (b.monthPoints || 0) - (a.monthPoints || 0));

    const potmLeaderboardList: string[] = sortedPlayersByMonthPoints.map(playerWithMonthPoints => {
        return `${playerWithMonthPoints.player.username} - ${playerWithMonthPoints.monthPoints} pts`}
    );
    const leaderboardConfig: LeaderboardConfig = {
        lightModeColor: LeaderBoardColours.lightModeTextRose,
        darkModeColor: LeaderBoardColours.darkModeBorderRose,
        headerText: `${getMonthName(potmLeaderboardMonth)} POTM`,
        displayEmoji: Emojis.potmLeaderBoardEmoji,
        sortedList: potmLeaderboardList
    };
  

    return (
      <div className={`w-[350px] shadow-lg rounded-xl p-4 ${leaderboardConfig.darkModeColor} dark:border-4 dark:w-[360px]`}>
        <Dropdown menuItems={getAllSeasonYears()} selectedItem={potmLeaderboardYear} reactToSelection={handleYearChange} displayTextSize="text-xl"></Dropdown>
        <h2 className={`flex items-center justify-around text-2xl min-w-[300px] font-bold text-center ${leaderboardConfig.lightModeColor} ${leaderboardConfig.darkModeColor} mb-3`}>
            <span className="flex justify-center w-[35px] p-2 rounded-lg text-center shrink-0 fine-pointer:hover:bg-rose-200 cursor-pointer" onClick={() => updatePotmTableData(-1)}><HiOutlineChevronLeft /> </span>
            {leaderboardConfig.headerText} {leaderboardConfig.displayEmoji} 
            <span className="flex justify-center w-[35px] p-2 rounded-lg text-center shrink-0 fine-pointer:hover:bg-rose-200 cursor-pointer" onClick={() => updatePotmTableData(1)}><HiOutlineChevronRight/> </span>
        </h2>
        <div className="h-[400px] overflow-y-auto">
          <ul className="flex flex-col gap-2">
            {leaderboardConfig.sortedList.map((item, index) => (
              <li 
                key={index} 
                className={`p-2 rounded-lg shadow-sm transition-all 
                  ${index < 3 ? "bg-gray-300 dark:bg-gray-800 font-semibold" : "bg-gray-200 dark:bg-gray-700"}`
                }
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
}