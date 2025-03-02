'use client'

import {Gameweek, Gameweekstat, Player } from "@prisma/client";
import Teamsheet from "./Teamsheet";
import PotmLeaderboard from "./PotmLeaderboard";
import Emojis from "../lib/constants/emojis";
import { useState } from "react";
import { PlayerWithMonthPoint } from "../models/PlayerWithMonthPoint";
import Dropdown from "../ui/Dropdown";

export default function HomePage({players, gameweeks, gameweekstats}: {players: Player[], gameweeks: Gameweek[], gameweekstats: Gameweekstat[]}) {

    const lastGameweekIdx = gameweeks.length - 1;

    const [selectedGameweekIdx, updateSelectedGameweekIdx] = useState(lastGameweekIdx);

    let gameweekStats: Gameweekstat[] = []

    if (lastGameweekIdx >= 0) gameweekStats = gameweekstats.filter(gameweekstat => gameweekstat.gameweekID === selectedGameweekIdx);

    function isDateInCurrentMonth(date: Date): boolean {
        const now = new Date();
        return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    }

    const currentMonthGameweeks = gameweeks.filter((gameweek) => (
        isDateInCurrentMonth(gameweek.date)
    ))

    const playersWithMonthPoints: PlayerWithMonthPoint[] = players.map(player => {
            let points = 0
            currentMonthGameweeks.forEach(gameweek => {
                points += gameweekstats.find(gameweekstat => (gameweekstat.gameweekID === gameweek.gameweekID && gameweekstat.playerID === player.playerID))?.points ?? 0
            })
            return {player: player, monthPoint:points}
    });

    const sortedPlayersByMonthPoints: PlayerWithMonthPoint[] = [...playersWithMonthPoints].sort((a, b) => (b.monthPoint || 0) - (a.monthPoint || 0));

    return (
            <div className="flex flex-col justify-around items-center lg:flex-row py-4">
                {
                    (gameweeks.length === 0 &&
                        <div className="flex h-[400px] justify-center items-center p-10">
                            <h2 className="font-bold text-4xl text-rose-900 mb-2 text-center">Season has not begun {Emojis.seasonNotBegunEmoji}</h2>
                        </div>
                    )
                    || 
                    (
                        <div className="md:w-[550px] px-4">
                            <Dropdown menuItems={gameweeks.map((_, index) => `Gameweek ${index + 1}`)} selectedItem={`Gameweek ${selectedGameweekIdx + 1}`} reactToSelection={updateSelectedGameweekIdx} displayTextSize="text-3xl"></Dropdown>
                            <p className="text-center font-semibold">{gameweeks[selectedGameweekIdx].date.toDateString()}</p>
                            <p className="text-center font-semibold">Gametype: {gameweeks[selectedGameweekIdx].gametype}</p>
                            <p className="text-sm mt-3 text-center">{Emojis.motmWinnerEmoji} MOTM. {Emojis.shortlistedPlayerEmoji} Shortlisted for MOTM</p>
                            <p className="text-sm mt-3 text-center">Click on shortlisted player to nominate for MOTM</p>
                            <p className="text-sm mt-3 text-center">Click on self to record goals scored</p>
                            <Teamsheet players={players} gameweek={gameweeks[selectedGameweekIdx]} gameweekstats = {gameweekStats}></Teamsheet>
                        </div>  
                    )
                }
                <div className="flex flex-col items-center xs:mt-10 lg:flex-row lg:justify-between">
                    <PotmLeaderboard rankings={sortedPlayersByMonthPoints}></PotmLeaderboard>
                </div>
            </div>
    )
}