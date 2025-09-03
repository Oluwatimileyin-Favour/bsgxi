'use client'

import { Gameweek, Gameweekstat, Player } from "@prisma/client";
import { useState } from "react";
import { LeaderboardConfig } from "../interfaces/LeaderboardConfig";
import { PlayerWithMonthPoint } from "../interfaces/PlayerWithMonthPoint";
import Emojis from "../lib/emojis";
import { LeaderBoardColours } from "../lib/TailwindColours";
import { getCurrentMonth, getMonthName, isDateInMonth } from "../services/date.service";
import PotmLeaderboard from "../ui/PotmLeaderboard";
import Slider from "../ui/Slider";
import GameweekDetails from "./GameweekDetails";
import Teamsheet from "./Teamsheet";

export default function HomePage({players, gameweeks, gameweekstats}: {players: Player[], gameweeks: Gameweek[], gameweekstats: Gameweekstat[]}) {

    const lastGameweekIdx: number = gameweeks.length - 1;
    const seasonHasBegun: boolean = lastGameweekIdx >= 0;

    //gameweek (index) selected by user on slider
    const [selectedGameweekIdx, updateSelectedGameweekIdx] = useState(lastGameweekIdx);
    const [potmLeaderboardMonth, setPotmLeaderboardMonth] = useState<number>(getCurrentMonth());

    function updatePotmTableData(monthChange: number) {
        // don't allow going past current month
        setPotmLeaderboardMonth(prevMonth => {
            const currentMonth = getCurrentMonth();
            const newMonth = prevMonth + monthChange;
            if (newMonth < 0) return 11;
            if (newMonth > 11) return 0;
            if (newMonth > currentMonth) return currentMonth;
            return newMonth;
        });
    }

    let selectedGameweekStats: Gameweekstat[] = [];
    if (seasonHasBegun) selectedGameweekStats = gameweekstats.filter(gameweekstat => gameweekstat.gameweekID === selectedGameweekIdx);

    const chosenMonthGameweeks: Gameweek[] = gameweeks.filter((gameweek) => (
        isDateInMonth(potmLeaderboardMonth, gameweek.date)
    ))
    
    // list of players with their corresponding points accrued for current month
    const playersWithMonthPoints: PlayerWithMonthPoint[] = players
        .map(player => {
                let points = 0
                chosenMonthGameweeks.forEach(gameweek => {
                    points += gameweekstats.find(gameweekstat => (gameweekstat.gameweekID === gameweek.gameweekID && gameweekstat.playerID === player.playerID))?.points ?? 0
                })
                return {player: player, monthPoints:points}
            });

    const sortedPlayersByMonthPoints: PlayerWithMonthPoint[] = [...playersWithMonthPoints].sort((a, b) => (b.monthPoints || 0) - (a.monthPoints || 0));

    const potmLeaderboardList: string[] = sortedPlayersByMonthPoints.map(playerWithMonthPoints => {
        return `${playerWithMonthPoints.player.firstname} - ${playerWithMonthPoints.monthPoints} pts`}
    );
    const potmLeaderboardConfig: LeaderboardConfig = {
        lightModeColor: LeaderBoardColours.lightModeTextRose,
        darkModeColor: LeaderBoardColours.darkModeBorderRose,
        headerText: `${getMonthName(potmLeaderboardMonth)} POTM`,
        displayEmoji: Emojis.potmLeaderBoardEmoji,
        sortedList: potmLeaderboardList
    };

    return (
            <div className="flex flex-col justify-around items-center lg:flex-row py-4 gap-6 min-h-[100%]">
                {
                !seasonHasBegun ? 
                    
                        <div className="flex h-[400px] justify-center items-center p-10">
                            <h2 className="font-bold text-4xl text-rose-900 dark:text-rose-500 mb-2 text-center">Season has not begun {Emojis.seasonNotBegunEmoji}</h2>
                        </div>
                    
                    :
                        <div className="flex flex-col gap-2 justify-center items-center md:w-[550px] px-2 h-[100%]">
                            <GameweekDetails gameweek={gameweeks[selectedGameweekIdx]}/>
                            <Teamsheet players={players} gameweek={gameweeks[selectedGameweekIdx]} gameweekstats = {selectedGameweekStats}/>
                            <Slider sliderItems={[...gameweeks].map((_, index) => `${index + 1}`)} selectedIdx={selectedGameweekIdx} reactToSelection={updateSelectedGameweekIdx}/>
                        </div>  
                }
                <PotmLeaderboard leaderboardConfig={potmLeaderboardConfig} updateTableData={updatePotmTableData} />
            </div>
    )
}