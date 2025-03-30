'use client'

import {Gameweek, Gameweekstat, Player } from "@prisma/client";
import Teamsheet from "./Teamsheet";
import PotmLeaderboard from "./PotmLeaderboard";
import Emojis from "../lib/constants/emojis";
import { useState } from "react";
import { PlayerWithMonthPoint } from "../interfaces/PlayerWithMonthPoint";
import Dropdown from "../ui/Dropdown";
import { isDateInCurrentMonth } from "../util/dateService";

export default function HomePage({players, gameweeks, gameweekstats}: {players: Player[], gameweeks: Gameweek[], gameweekstats: Gameweekstat[]}) {

    const lastGameweekIdx = gameweeks.length - 1;

    const [selectedGameweekIdx, updateSelectedGameweekIdx] = useState(lastGameweekIdx);

    let selectedGameweekStats: Gameweekstat[] = []

    if (lastGameweekIdx >= 0) selectedGameweekStats = gameweekstats.filter(gameweekstat => gameweekstat.gameweekID === selectedGameweekIdx);

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

    return (
            <div className="flex flex-col justify-around items-center lg:flex-row py-4">
                {
                lastGameweekIdx < 0 ? 
                    
                        <div className="flex h-[400px] justify-center items-center p-10">
                            <h2 className="font-bold text-4xl text-rose-900 mb-2 text-center">Season has not begun {Emojis.seasonNotBegunEmoji}</h2>
                        </div>
                    
                    :
                        <div className="md:w-[550px] px-4">
                            <Dropdown menuItems={gameweeks.map((_, index) => `Gameweek ${index + 1}`)} selectedItem={`Gameweek ${selectedGameweekIdx + 1}`} reactToSelection={updateSelectedGameweekIdx} displayTextSize="text-3xl"></Dropdown>
                            <p className="text-center font-semibold">{gameweeks[selectedGameweekIdx].date.toDateString()}</p>
                            <p className="text-center font-semibold">Gametype: {gameweeks[selectedGameweekIdx].gametype}</p>
                            <p className="text-sm mt-3 text-center">{Emojis.motmWinnerEmoji} MOTM. {Emojis.shortlistedPlayerEmoji} Shortlisted for MOTM</p>
                            <p className="text-sm mt-3 text-center">Click on shortlisted player to nominate for MOTM</p>
                            <p className="text-sm mt-3 text-center">Click on self to record goals scored</p>
                            <Teamsheet players={players} gameweek={gameweeks[selectedGameweekIdx]} gameweekstats = {selectedGameweekStats}></Teamsheet>
                        </div>  
                }
                <div className="flex flex-col items-center xs:mt-10 lg:flex-row lg:justify-between">
                    <PotmLeaderboard rankings={sortedPlayersByMonthPoints}></PotmLeaderboard>
                </div>
            </div>
    )
}