'use client'

import { useState, useRef, RefObject } from "react";
import { Gameweek, Gameweekstat, Player } from "@prisma/client";
import Emojis from "../lib/emojis";
import { GameweekType } from "../lib/GameweekTypes";

export default function Teamsheet({players, gameweek, gameweekstats}: {players: Player[], gameweek: Gameweek, gameweekstats: Gameweekstat[]}){

    const [selectedPlayerStats, updateSelectedPlayerStats] = useState<Gameweekstat>(gameweekstats[0]);
    const [playerIsClicked, updatePlayerSelectionStatus] = useState<boolean>(false);
    const [nominateForMotmClicked, updateNominateForMotmClickedStatus] = useState<boolean>(false);
    const [enterGoals, updateEnterGoalsStatus] = useState<boolean>(false);

    const goalsScoredRef = useRef<HTMLInputElement>(null);
    const playerCodeRef = useRef<HTMLInputElement>(null);
    
    const updateGoalsRef = useRef<HTMLButtonElement>(null);
    const handleNominationRef = useRef<HTMLButtonElement>(null);
    
    const selectedPlayer = players.find(player => player.playerID === selectedPlayerStats.playerID);

    //person who is nominating a player for MOTM and their gameweek stats
    const nominator = players.find(player => player.code.trim() === playerCodeRef.current?.value.trim());
    const nominatorGameweekstat = gameweekstats.find(stat => stat.playerID === nominator?.playerID);

    const motm: number = gameweek.motm ?? -1;

    const teamBlackStats: Gameweekstat[] = gameweekstats.filter(stat => {
        return stat.team === 0
    }) ?? []
    
    const teamWhiteStats: Gameweekstat[] = gameweekstats.filter(stat => {
        return stat.team === 1
    }) ?? []

    const onSelectPlayer = (playerStats: Gameweekstat) => {
        if(gameweek.isactive){
            updateSelectedPlayerStats(playerStats)
            updatePlayerSelectionStatus(!playerIsClicked)
        }
       else {
            alert("Gameweek has been closed")
       }
    }

    const resetState = () => {
        updatePlayerSelectionStatus(false)
        updateEnterGoalsStatus(false)
        updateNominateForMotmClickedStatus(false)
    }

    return (
        <div className="flex justify-center mt-5 w-[95%] lg:max-h-[320px] overflow-y-auto">
            {/* Would show only one of the blocks below depending on the condition met */}
            
            {
                !playerIsClicked && gameweek.gametype.trim() === GameweekType.Regular &&

                <RegularGameInterface
                    teamBlackStats={teamBlackStats}
                    teamWhiteStats={teamWhiteStats}
                    gameweek={gameweek}
                    players={players}
                    motm={motm}
                    onSelectPlayer={onSelectPlayer}
                />
            }

            {
                !playerIsClicked && gameweek.gametype.trim() === GameweekType.Classico &&

                <ClassicoGameInterface
                    gameweekstats={gameweekstats}
                    players={players}
                    motm={motm}
                    onSelectPlayer={onSelectPlayer}
                />
            }

            {
                !playerIsClicked && gameweek.gametype.trim() === GameweekType.ThreeTeam &&

                <ThreeTeamGameInterface
                    gameweekstats={gameweekstats}
                    players={players}
                    motm={motm}
                    onSelectPlayer={onSelectPlayer}
                />
            }
            
            {
                playerIsClicked && selectedPlayerStats.nominated && !nominateForMotmClicked && !enterGoals &&

                <ChooseActionMenu
                    updateNominateForMotmClickedStatus={updateNominateForMotmClickedStatus}
                    updateEnterGoalsStatus={updateEnterGoalsStatus}
                    updatePlayerSelectionStatus={updatePlayerSelectionStatus}
                    playerIsClicked={playerIsClicked}
                />
            }

            {
                playerIsClicked && (enterGoals || !selectedPlayerStats.nominated) &&

                <UpdateGoalsForm
                    goalsScoredRef={goalsScoredRef}
                    playerCodeRef={playerCodeRef}
                    updateGoalsRef={updateGoalsRef}
                    resetState={resetState}
                    selectedPlayer={selectedPlayer}
                    selectedPlayerStats={selectedPlayerStats}
                />

            }

            { 
                playerIsClicked && nominateForMotmClicked &&

               <UpdateMotmNominationForm
                    handleNominationRef={handleNominationRef}
                    playerCodeRef={playerCodeRef}
                    selectedPlayer={selectedPlayer}
                    resetState={resetState}
                    nominator={nominator}
                    nominatorGameweekstat={nominatorGameweekstat}
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


function ChooseActionMenu({updateNominateForMotmClickedStatus, updateEnterGoalsStatus, updatePlayerSelectionStatus, playerIsClicked}: {
    updateNominateForMotmClickedStatus: (status: boolean) => void,
    updateEnterGoalsStatus: (status: boolean) => void,
    updatePlayerSelectionStatus: (status: boolean) => void,
    playerIsClicked: boolean
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
                onClick={() => updatePlayerSelectionStatus(!playerIsClicked)}
            >
                Cancel
            </button>
        </div>
    )
}


function UpdateGoalsForm({goalsScoredRef, playerCodeRef, updateGoalsRef, resetState, selectedPlayer, selectedPlayerStats}: 
    {
    goalsScoredRef: RefObject<HTMLInputElement | null>,
    playerCodeRef: RefObject<HTMLInputElement | null>,
    updateGoalsRef: RefObject<HTMLButtonElement | null>,
    resetState: () => void,
    selectedPlayer: Player | undefined,
    selectedPlayerStats: Gameweekstat
}) {
    return (
        <form
            onSubmit={e => updateGoals(e, updateGoalsRef, goalsScoredRef, playerCodeRef, selectedPlayerStats, selectedPlayer, resetState)}
            className="max-w-sm mx-auto dark:border-sky-400 dark:border-2 shadow-md rounded-lg p-6"
        >
            <div className="mb-4 space-y-2">
                <label
                    htmlFor="textInput"
                    className="block text-lg font-bold text-red-700 dark:text-sky-400 mb-2"
                >
                {selectedPlayer?.firstname}
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-sky-400 dark:bg-inherit rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                    type="text"
                    id="textInput"
                    ref={playerCodeRef}
                    name="textInput"
                    placeholder="your code"
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


function UpdateMotmNominationForm({selectedPlayer, handleNominationRef, playerCodeRef, resetState, nominator, nominatorGameweekstat} : {
    selectedPlayer: Player | undefined,
    handleNominationRef: RefObject<HTMLButtonElement | null>,
    playerCodeRef: RefObject<HTMLInputElement | null>,
    resetState: () => void,
    nominator: Player | undefined,
    nominatorGameweekstat: Gameweekstat | undefined
}) {
    return (
        <form
            onSubmit={e => updateMotmNomination(e, handleNominationRef, selectedPlayer, resetState, nominator, nominatorGameweekstat)}
            className="max-w-sm mx-auto shadow-md rounded-lg p-6 dark:border-sky-400 dark:border-2"
        >
            <div className="mb-4">
                <label
                htmlFor="textInput"
                className="block text-lg font-bold text-red-700 dark:text-sky-400 mb-2"
                >
                Are you sure you want to nominate {selectedPlayer?.firstname} for MOTM?
                </label>
                <input
                type="text"
                id="textInput"
                ref={playerCodeRef}
                name="textInput"
                placeholder="your code"
                className="w-full px-3 py-2 border border-gray-300 dark:border-sky-400 dark:bg-inherit rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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


async function updateGoals(
    e: React.FormEvent<HTMLFormElement>,
    updateGoalsRef: RefObject<HTMLButtonElement | null>,
    goalsScoredRef: RefObject<HTMLInputElement | null>,
    playerCodeRef: RefObject<HTMLInputElement | null>,
    selectedPlayerStats: Gameweekstat,
    selectedPlayer: Player | undefined,
    resetState: () => void
) {
    e.preventDefault();

    if(updateGoalsRef.current){
        updateGoalsRef.current.style.display = 'none';  //immediately remove button so user doesn't click twice
    }

    if(selectedPlayer?.code.trim() === playerCodeRef.current?.value.trim()){
        const goals = {gameweekStatId: selectedPlayerStats.gameweekStatID, goalsScored: goalsScoredRef.current?.value};
        try {
            const response = await fetch("/api/goals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({goals}),
            });
        
            const data = await response.json();
            if (data.success) {
                alert("Goals updated successfully!");  
                window.location.reload();
            } 
            else {
                alert("Error: " + data.error);
            }
        } 
        catch (error) {
            alert("Error: " + error);
        }
    }
    else {
        alert("Incorrect code. Please try again.");
    }

    resetState();
}


async function updateMotmNomination(e: React.FormEvent<HTMLFormElement>,
    handleNominationRef: RefObject<HTMLButtonElement | null>,
    nominatedPlayer: Player | undefined,
    resetState: () => void,
    nominator: Player | undefined,
    nominatorGameweekstat: Gameweekstat | undefined,
){

    e.preventDefault();

    if(handleNominationRef.current){
        handleNominationRef.current.style.display = 'none';  //immediately remove button so user doesn't click twice
    }

    if(nominator){
        if(!nominatorGameweekstat){
            alert("Player with entered code cannot vote");
            return;
        }

        const nominationPair = {gameweekStatId: nominatorGameweekstat?.gameweekStatID, nomineeId: nominatedPlayer?.playerID};

        const body = {action: "playerSelectNominee", payload: nominationPair}; 
        
        try {
            const response = await fetch("/api/nomination", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({body}),
            });
        
            const data = await response.json();
            if (data.success) {
                alert("Nomination saved successfully!");  
            } 
            else {
                alert("Error: " + data.error);
            }
        } 
        catch (error) {
            alert("Error: " + error);
        }
    }

    else {
        alert("Incorrect code")
    }

    resetState();
}