'use client'

import { Matchday, MatchdayStat, Player } from "@/generated/prisma/client";
import { useContext, useRef, useState } from "react";
import { GlobalAppDataContext } from "../context/GlobalAppDataContext";
import Emojis from "../lib/emojis";
import { GameweekType } from "../lib/GameweekTypes";
import { UpdateGoals, UpdateMotmNomination } from "../services/player.service";

export default function Teamsheet({selectedGameweekIdx}: {selectedGameweekIdx: number}){

    //todo
    // can replace players with PlayerSeasonStat

    const {players, matchdays, matchdayStats, loggedInPlayer, season} = useContext(GlobalAppDataContext);

    const matchday = matchdays[selectedGameweekIdx];

    let selectedGameweekStats: MatchdayStat[];

    //create getSeasonIdx function
    if(season === 2) {
        selectedGameweekStats = matchdayStats.filter(matchdayStat => matchdayStat.matchday_id === (selectedGameweekIdx + 37));
    }
    else{
        selectedGameweekStats = matchdayStats.filter(matchdayStat => matchdayStat.matchday_id === (selectedGameweekIdx));
    }

    const [selectedPlayerStats, updateSelectedPlayerStats] = useState<MatchdayStat>(selectedGameweekStats[0]);
    const [playerIsSelected, updatePlayerSelectionStatus] = useState<boolean>(false);
    const [nominateForMotmClicked, updateNominateForMotmClickedStatus] = useState<boolean>(false);
    const [enterGoalsClicked, updateEnterGoalsClickedStatus] = useState<boolean>(false);
    
    const selectedPlayer = players.find(player => player.id === selectedPlayerStats.player_id);

    const motmPlayerID: number = matchday.motm ?? -1;

    const teamBlackStats: MatchdayStat[] = selectedGameweekStats.filter(stat => {
        return stat.team === 0
    }) ?? []
    
    const teamWhiteStats: MatchdayStat[] = selectedGameweekStats.filter(stat => {
        return stat.team === 1
    }) ?? []

    const onSelectPlayer = (playerStats: MatchdayStat) => {
        if(loggedInPlayer){
            if(matchday.isactive){
                updateSelectedPlayerStats(playerStats)
                updatePlayerSelectionStatus(!playerIsSelected)
            }
           else {
                alert("Matchday has been closed")
           }
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
                !playerIsSelected && matchday.gametype.trim() === GameweekType.Regular &&

                <RegularGameInterface
                    teamBlackStats={teamBlackStats}
                    teamWhiteStats={teamWhiteStats}
                    gameweek={matchday}
                    players={players}
                    motm={motmPlayerID}
                    onSelectPlayer={onSelectPlayer}
                />
            }

            {
                !playerIsSelected && matchday.gametype.trim() === GameweekType.Classico &&

                <ClassicoGameInterface
                    selectedGameweekStats={selectedGameweekStats}
                    players={players}
                    motm={motmPlayerID}
                    onSelectPlayer={onSelectPlayer}
                />
            }

            {
                !playerIsSelected && matchday.gametype.trim() === GameweekType.ThreeTeam &&

                <ThreeTeamGameInterface
                    selectedGameweekStats={selectedGameweekStats}
                    players={players}
                    motm={motmPlayerID}
                    onSelectPlayer={onSelectPlayer}
                />
            }
            
            {
                playerIsSelected && selectedPlayerStats.shortlisted && !nominateForMotmClicked && !enterGoalsClicked &&

                <ChooseActionMenu
                    updateNominateForMotmClickedStatus={updateNominateForMotmClickedStatus}
                    updateEnterGoalsStatus={updateEnterGoalsClickedStatus}
                    updatePlayerSelectionStatus={updatePlayerSelectionStatus}
                    playerIsSelected={playerIsSelected}
                />
            }

            {
                playerIsSelected && (enterGoalsClicked || !selectedPlayerStats.shortlisted) &&

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
                    gameweekId={matchday.id}  
                    resetState={resetState} 
                />
            }
        </div>
    )
}


function RegularGameInterface ({teamBlackStats, teamWhiteStats, gameweek, players, motm, onSelectPlayer}: 
    {
        teamBlackStats: MatchdayStat[], 
        teamWhiteStats: MatchdayStat[], 
        gameweek: Matchday, 
        players: Player[], 
        motm: number, 
        onSelectPlayer: (stats: MatchdayStat) => void
    }  
){

    return (
        <>
            <div className="flex-1 text-center">
                <h3 className="font-bold text-xl text-rose-900 dark:text-rose-500">Team Black {<span className="hidden md:inline">({gameweek.blackscore} {Emojis.goalEmoji})</span>}</h3>
                <h3 className="font-bold text-xl text-rose-900 dark:text-rose-500 md:hidden">{gameweek.blackscore} {Emojis.goalEmoji}</h3>
                <ul className="flex flex-col gap-y-4 mt-2">
                    {teamBlackStats.map((teamBlackPlayerStat) => (
                        <li key={teamBlackPlayerStat.id} className="rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer font-medium"
                            onClick={() => onSelectPlayer(teamBlackPlayerStat)}
                        >
                            {(teamBlackPlayerStat.player_id === motm) && <span>{Emojis.motmWinnerEmoji}</span>} 
                            {(teamBlackPlayerStat.id != motm && teamBlackPlayerStat.shortlisted) && <span>{Emojis.shortlistedPlayerEmoji}</span>} 
                            {players.find(player => player.id === teamBlackPlayerStat.player_id)?.firstname} 
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
                        <li key={teamWhiteStatsPlayer.id} className="rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer font-medium"
                            onClick={() => onSelectPlayer(teamWhiteStatsPlayer)}
                        >
                            {(teamWhiteStatsPlayer.player_id === motm) && <span>{Emojis.motmWinnerEmoji}</span>} 
                            {(teamWhiteStatsPlayer.id != motm && teamWhiteStatsPlayer.shortlisted) && <span>{Emojis.shortlistedPlayerEmoji}</span>} 
                            {players.find(player => player.id === teamWhiteStatsPlayer.player_id)?.firstname} 
                            {(teamWhiteStatsPlayer.goals_scored ?? 0) > 0 && <span>- {teamWhiteStatsPlayer.goals_scored} {Emojis.goalEmoji}</span>}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}


function ClassicoGameInterface ({selectedGameweekStats, players, motm, onSelectPlayer}: 
    {
        selectedGameweekStats: MatchdayStat[], 
        players: Player[], 
        motm: number, 
        onSelectPlayer: (stats: MatchdayStat) => void
    }  
){
    return (
        <div className="flex flex-col items-center">
            <h3 className="font-bold text-xl text-rose-900"> Classico Players</h3>
            <ul className="grid grid-cols-2 gap-4 mt-4">
                {selectedGameweekStats.map((gameweekPlayerStat) => (
                    <li key={gameweekPlayerStat.id} className="rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer font-medium text-center"
                        onClick={() => onSelectPlayer(gameweekPlayerStat)}
                    >
                        {(gameweekPlayerStat.team === 0) && <span>{Emojis.oldiesEmoji}</span>}  
                        {(gameweekPlayerStat.team === 1) && <span>{Emojis.newbiesEmoji}</span>} 
                        {(gameweekPlayerStat.team === 2) && <span>{Emojis.youngbloodEmoji}</span>} 
                        {(gameweekPlayerStat.player_id === motm) && <span>{Emojis.motmWinnerEmoji}</span>} 
                        {(gameweekPlayerStat.player_id != motm && gameweekPlayerStat.shortlisted) && <span>{Emojis.shortlistedPlayerEmoji}</span>} 
                        {players.find(player => player.id === gameweekPlayerStat.player_id)?.firstname} 
                        {(gameweekPlayerStat.goals_scored ?? 0) > 0 && <span>- {gameweekPlayerStat.goals_scored} {Emojis.goalEmoji}</span>} 
                    </li>
                ))}
            </ul>
        </div>
    )
}


function ThreeTeamGameInterface ({selectedGameweekStats, players, motm, onSelectPlayer}: 
    {  
        selectedGameweekStats: MatchdayStat[], 
        players: Player[], 
        motm: number, 
        onSelectPlayer: (stats: MatchdayStat) => void
    }  
){
    return (
        <div className="flex flex-col items-center">
            <h3 className="font-bold text-xl text-rose-900"> Gameweek Players</h3>
            <ul className="grid grid-cols-2 gap-4 mt-4">
                {selectedGameweekStats.map((gameweekPlayerStat) => (
                    <li key={gameweekPlayerStat.id} className="rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer font-medium text-center"
                        onClick={() => onSelectPlayer(gameweekPlayerStat)}
                    >
                        {(gameweekPlayerStat.player_id === motm) && <span>{Emojis.motmWinnerEmoji}</span>} 
                        {(gameweekPlayerStat.player_id != motm && gameweekPlayerStat.shortlisted) && <span>{Emojis.shortlistedPlayerEmoji}</span>} 
                        {players.find(player => player.id === gameweekPlayerStat.player_id)?.firstname} 
                        {(gameweekPlayerStat.goals_scored ?? 0) > 0 && <span>- {gameweekPlayerStat.goals_scored} {Emojis.goalEmoji}</span>} 
                    </li>
                ))}
            </ul>
        </div>
    )
}


function ChooseActionMenu({updateNominateForMotmClickedStatus, updateEnterGoalsStatus, updatePlayerSelectionStatus, playerIsSelected}: 
    {
        updateNominateForMotmClickedStatus: (status: boolean) => void,
        updateEnterGoalsStatus: (status: boolean) => void,
        updatePlayerSelectionStatus: (status: boolean) => void,
        playerIsSelected: boolean
    }
){

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

export function UpdateGoalsForm({selectedPlayer, selectedPlayerStats, resetState}: 
    {
        selectedPlayer: Player | undefined,
        selectedPlayerStats: MatchdayStat,
        resetState: () => void,
    }
){
    const goalsScoredRef = useRef<HTMLInputElement>(null);
    const updateGoalsRef = useRef<HTMLButtonElement>(null);

    const {loggedInPlayer} = useContext(GlobalAppDataContext);

    const handleUpdateGoals = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const goals = parseInt(goalsScoredRef.current?.value ?? "0");
        const matchdayStatId = selectedPlayerStats.id;

        if(selectedPlayerStats.player_id === loggedInPlayer?.id) await UpdateGoals(matchdayStatId, goals);
        else alert("Not allowed")
        
        window.location.reload();
    }

    return (
        <form
            onSubmit={e => handleUpdateGoals(e)}
            className="max-w-sm mx-auto dark:border-sky-400 dark:border-2 shadow-md rounded-lg p-6"
        >
            <div className="mb-4 space-y-2">
                <label
                    htmlFor="textInput"
                    className="block text-lg font-bold text-red-700 dark:text-sky-400 mb-2"
                >
                {selectedPlayer?.username}
                </label>
                <label
                    htmlFor="textInput"
                    className="block text-sm font-medium text-gray-700 dark:text-sky-700 mb-2"
                >
                    how many goals did you score?
                </label>
                <input
                    type='number'
                    id="textInput"
                    ref={goalsScoredRef}
                    name="textInput"
                    placeholder="goals"
                    defaultValue={selectedPlayerStats.goals_scored ?? 0}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-sky-400 dark:bg-inherit rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <button
                type="submit"
                className="w-full my-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ref={updateGoalsRef}
            >
                Save
            </button>
            <button
                className="w-full my-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={resetState}
            >
                Cancel
            </button>
        </form>
    )
}

export function UpdateMotmNominationForm({selectedPlayer, gameweekId, resetState} : 
    {
        selectedPlayer: Player | undefined,
        gameweekId: number,
        resetState: () => void,
    }
){
    const handleNominationRef = useRef<HTMLButtonElement>(null);

    const {loggedInPlayer} = useContext(GlobalAppDataContext);

    const handleUpdateMotmNomination = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const nominatedPlayerId = selectedPlayer?.id ?? -1;
        
        await UpdateMotmNomination(loggedInPlayer?.id, nominatedPlayerId, gameweekId);

        window.location.reload();
    }

    return (
        <form
            onSubmit={e => handleUpdateMotmNomination(e)}
            className="max-w-sm mx-auto shadow-md rounded-lg p-6 dark:border-sky-400 dark:border-2"
        >
            <div className="mb-4">
                <label
                htmlFor="textInput"
                className="block text-lg font-bold text-red-700 dark:text-sky-400 mb-2"
                >
                Are you sure you want to nominate {selectedPlayer?.firstname} for MOTM?
                </label>
            </div>
            <button
                type="submit"
                className="w-full my-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ref={handleNominationRef}
            >
                Save
            </button>
            <button
                className="w-full my-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={resetState}
            >
                Cancel
            </button>
        </form>
    )
}