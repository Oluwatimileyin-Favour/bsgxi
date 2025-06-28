'use client'

import { useState } from "react";
import { Gameweek, Gameweekstat, Player } from "@prisma/client";
import Emojis from "../lib/emojis";
import { GameweekType } from "../lib/GameweekTypes";
import UpdateGoalsForm from "./UpdateGoalsForm";
import UpdateMotmNominationForm from "./UpdateMotmNominationForm";

export default function Teamsheet({players, gameweek, gameweekstats}: {players: Player[], gameweek: Gameweek, gameweekstats: Gameweekstat[]}){

    const [selectedPlayerStats, updateSelectedPlayerStats] = useState<Gameweekstat>(gameweekstats[0]);
    const [playerIsSelected, updatePlayerSelectionStatus] = useState<boolean>(false);
    const [nominateForMotmClicked, updateNominateForMotmClickedStatus] = useState<boolean>(false);
    const [enterGoalsClicked, updateEnterGoalsClickedStatus] = useState<boolean>(false);
    
    const selectedPlayer = players.find(player => player.playerID === selectedPlayerStats.playerID);

    const motmPlayerID: number = gameweek.motm ?? -1;

    const teamBlackStats: Gameweekstat[] = gameweekstats.filter(stat => {
        return stat.team === 0
    }) ?? []
    
    const teamWhiteStats: Gameweekstat[] = gameweekstats.filter(stat => {
        return stat.team === 1
    }) ?? []

    const onSelectPlayer = (playerStats: Gameweekstat) => {
        if(gameweek.isactive){
            updateSelectedPlayerStats(playerStats)
            updatePlayerSelectionStatus(!playerIsSelected)
        }
       else {
            alert("Gameweek has been closed")
       }
    }

    const resetState = () => {
        updatePlayerSelectionStatus(false);
        updateEnterGoalsClickedStatus(false);
        updateNominateForMotmClickedStatus(false);
    }

    return (
        <div className="flex justify-center mt-5 w-[95%] lg:max-h-[320px] overflow-y-auto">
            {/* Would show only one of the blocks below depending on the condition met */}

            {
                !playerIsSelected && gameweek.gametype.trim() === GameweekType.Regular &&

                <RegularGameInterface
                    teamBlackStats={teamBlackStats}
                    teamWhiteStats={teamWhiteStats}
                    gameweek={gameweek}
                    players={players}
                    motm={motmPlayerID}
                    onSelectPlayer={onSelectPlayer}
                />
            }

            {
                !playerIsSelected && gameweek.gametype.trim() === GameweekType.Classico &&

                <ClassicoGameInterface
                    gameweekstats={gameweekstats}
                    players={players}
                    motm={motmPlayerID}
                    onSelectPlayer={onSelectPlayer}
                />
            }

            {
                !playerIsSelected && gameweek.gametype.trim() === GameweekType.ThreeTeam &&

                <ThreeTeamGameInterface
                    gameweekstats={gameweekstats}
                    players={players}
                    motm={motmPlayerID}
                    onSelectPlayer={onSelectPlayer}
                />
            }
            
            {
                playerIsSelected && selectedPlayerStats.nominated && !nominateForMotmClicked && !enterGoalsClicked &&

                <ChooseActionMenu
                    updateNominateForMotmClickedStatus={updateNominateForMotmClickedStatus}
                    updateEnterGoalsStatus={updateEnterGoalsClickedStatus}
                    updatePlayerSelectionStatus={updatePlayerSelectionStatus}
                    playerIsSelected={playerIsSelected}
                />
            }

            {
                playerIsSelected && (enterGoalsClicked || !selectedPlayerStats.nominated) &&

                <UpdateGoalsForm
                    selectedPlayer={selectedPlayer}
                    selectedPlayerStats={selectedPlayerStats}
                    resetState={resetState}
                />
            }

            { 
                playerIsSelected && nominateForMotmClicked &&

                <UpdateMotmNominationForm
                    selectedPlayer={selectedPlayer}
                    gameweekID={gameweek.gameweekID}  
                    resetState={resetState} 
                />
            }
        </div>
    )
}


function RegularGameInterface ({teamBlackStats, teamWhiteStats, gameweek, players, motm, onSelectPlayer}: {teamBlackStats: Gameweekstat[], teamWhiteStats: Gameweekstat[], gameweek: Gameweek, players: Player[], motm: number, onSelectPlayer: (stats: Gameweekstat) => void}  ) {
    return (
        <>
            <div className="flex-1 text-center">
                <h3 className="font-bold text-xl text-rose-900 dark:text-rose-500">Team Black {<span className="hidden md:inline">({gameweek.blackscore} {Emojis.goalEmoji})</span>}</h3>
                <h3 className="font-bold text-xl text-rose-900 dark:text-rose-500 md:hidden">{gameweek.blackscore} {Emojis.goalEmoji}</h3>
                <ul className="flex flex-col gap-y-4 mt-2">
                    {teamBlackStats.map((teamBlackPlayerStat) => (
                        <li key={teamBlackPlayerStat.playerID} className="rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer font-medium"
                            onClick={() => onSelectPlayer(teamBlackPlayerStat)}
                        >
                            {(teamBlackPlayerStat.playerID === motm) && <span>{Emojis.motmWinnerEmoji}</span>} 
                            {(teamBlackPlayerStat.playerID != motm && teamBlackPlayerStat.nominated) && <span>{Emojis.shortlistedPlayerEmoji}</span>} 
                            {players.find(player => player.playerID === teamBlackPlayerStat.playerID)?.firstname} 
                            {(teamBlackPlayerStat.goals_scored ?? 0) > 0 && <span>- {teamBlackPlayerStat.goals_scored} {Emojis.goalEmoji}</span>} 
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex-1 text-center">
                <h3 className="font-bold text-xl text-rose-900 dark:text-rose-500">Team White {<span className="hidden md:inline">({gameweek.whitescore} {Emojis.goalEmoji})</span>}</h3>
                <h3 className="font-bold text-xl text-rose-900 dark:text-rose-500 md:hidden">{gameweek.whitescore} {Emojis.goalEmoji}</h3>
                <ul className="flex flex-col gap-y-4 mt-2">
                    {teamWhiteStats.map((teamWhiteStatsPlayer) => (
                        <li key={teamWhiteStatsPlayer.playerID} className="rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer font-medium"
                            onClick={() => onSelectPlayer(teamWhiteStatsPlayer)}
                        >
                            {(teamWhiteStatsPlayer.playerID === motm) && <span>{Emojis.motmWinnerEmoji}</span>} 
                            {(teamWhiteStatsPlayer.playerID != motm && teamWhiteStatsPlayer.nominated) && <span>{Emojis.shortlistedPlayerEmoji}</span>} 
                            {players.find(player => player.playerID === teamWhiteStatsPlayer.playerID)?.firstname} 
                            {(teamWhiteStatsPlayer.goals_scored ?? 0) > 0 && <span>- {teamWhiteStatsPlayer.goals_scored} {Emojis.goalEmoji}</span>}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}


function ClassicoGameInterface ({gameweekstats, players, motm, onSelectPlayer}: {gameweekstats: Gameweekstat[], players: Player[], motm: number, onSelectPlayer: (stats: Gameweekstat) => void}  ) {
    return (
        <div className="flex flex-col items-center">
            <h3 className="font-bold text-xl text-rose-900"> Classico Players</h3>
            <ul className="grid grid-cols-2 gap-4 mt-4">
                {gameweekstats.map((gameweekPlayer) => (
                    <li key={gameweekPlayer.playerID} className="rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer font-medium text-center"
                        onClick={() => onSelectPlayer(gameweekPlayer)}
                    >
                        {(gameweekPlayer.team === 0) && <span>{'⬛'}</span>}  
                        {(gameweekPlayer.team === 1) && <span>{'⬜'}</span>} 
                        {(gameweekPlayer.team === 2) && <span>{'🟥'}</span>} 
                        {(gameweekPlayer.playerID === motm) && <span>{Emojis.motmWinnerEmoji}</span>} 
                        {(gameweekPlayer.playerID != motm && gameweekPlayer.nominated) && <span>{Emojis.shortlistedPlayerEmoji}</span>} 
                        {players.find(player => player.playerID === gameweekPlayer.playerID)?.firstname} 
                        {(gameweekPlayer.goals_scored ?? 0) > 0 && <span>- {gameweekPlayer.goals_scored} {Emojis.goalEmoji}</span>} 
                    </li>
                ))}
            </ul>
        </div>
    )
}


function ThreeTeamGameInterface ({gameweekstats, players, motm, onSelectPlayer}: {gameweekstats: Gameweekstat[], players: Player[], motm: number, onSelectPlayer: (stats: Gameweekstat) => void}  ) {
    return (
        <div className="flex flex-col items-center">
            <h3 className="font-bold text-xl text-rose-900"> Gameweek Players</h3>
            <ul className="grid grid-cols-2 gap-4 mt-4">
                {gameweekstats.map((gameweekPlayer) => (
                    <li key={gameweekPlayer.playerID} className="rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer font-medium text-center"
                        onClick={() => onSelectPlayer(gameweekPlayer)}
                    >
                        {(gameweekPlayer.playerID === motm) && <span>{Emojis.motmWinnerEmoji}</span>} 
                        {(gameweekPlayer.playerID != motm && gameweekPlayer.nominated) && <span>{Emojis.shortlistedPlayerEmoji}</span>} 
                        {players.find(player => player.playerID === gameweekPlayer.playerID)?.firstname} 
                        {(gameweekPlayer.goals_scored ?? 0) > 0 && <span>- {gameweekPlayer.goals_scored} {Emojis.goalEmoji}</span>} 
                    </li>
                ))}
            </ul>
        </div>
    )
}


function ChooseActionMenu({updateNominateForMotmClickedStatus, updateEnterGoalsStatus, updatePlayerSelectionStatus, playerIsSelected}: {
    updateNominateForMotmClickedStatus: (status: boolean) => void,
    updateEnterGoalsStatus: (status: boolean) => void,
    updatePlayerSelectionStatus: (status: boolean) => void,
    playerIsSelected: boolean
}) {

    return (
        <div className="flex flex-col h-[250px] items-center">
            <h2 className="block text-lg font-bold text-red-700 mb-2">What action do you want to take</h2>
            <button className="px-4 py-2 rounded-2xl bg-blue-500 text-white hover:bg-sky-400 transition shadow-md h-15 w-[50%] my-auto"
                onClick={() => updateNominateForMotmClickedStatus(true)}
            >
                Nominate for MOTM
            </button>
            <button className="px-4 py-2 rounded-2xl bg-blue-500 text-white hover:bg-sky-400 transition shadow-md h-15 w-[50%] my-auto"
                onClick={() => updateEnterGoalsStatus(true)}
            >
                Enter <em>your</em> goals
            </button>
            <button
                className="w-full my-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={() => updatePlayerSelectionStatus(!playerIsSelected)}
            >
                Cancel
            </button>
        </div>
    )
}