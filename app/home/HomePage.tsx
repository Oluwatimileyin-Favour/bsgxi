'use client'

import {Gameweek, Gameweekstat, Player } from "@prisma/client";
import Teamsheet from "./Teamsheet";
import Emojis from "../lib/emojis";
import { useState } from "react";
import { PlayerWithMonthPoint } from "../interfaces/PlayerWithMonthPoint";
import { isDateInCurrentMonth } from "../util/dateService";
import Slider from "../ui/Slider";
import Leaderboard from "../ui/Leaderboard";
import { LeaderboardConfig } from "../interfaces/LeaderboardConfig";
import GameweekDetails from "./GameweekDetails";
import { LeaderBoardColours } from "../lib/TailwindColours";

export default function HomePage({players, gameweeks, gameweekstats}: {players: Player[], gameweeks: Gameweek[], gameweekstats: Gameweekstat[]}) {

    const lastGameweekIdx: number = gameweeks.length - 1;
    const seasonHasBegun: boolean = lastGameweekIdx >= 0;

    //gameweek (index) selected by user on slider
    const [selectedGameweekIdx, updateSelectedGameweekIdx] = useState(lastGameweekIdx);

    let selectedGameweekStats: Gameweekstat[] = [];
    if (seasonHasBegun) selectedGameweekStats = gameweekstats.filter(gameweekstat => gameweekstat.gameweekID === selectedGameweekIdx);

    const currentMonthGameweeks: Gameweek[] = gameweeks.filter((gameweek) => (
        isDateInCurrentMonth(gameweek.date)
    ))
    
    // list of players with their corresponding points accrued for current month
    const playersWithMonthPoints: PlayerWithMonthPoint[] = players
        .map(player => {
                let points = 0
                currentMonthGameweeks.forEach(gameweek => {
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
        headerText: 'June POTM',
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
                <Leaderboard leaderboardConfig={potmLeaderboardConfig}/>
            </div>
    )
}