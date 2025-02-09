'use client'

import { useState, useRef } from "react";
import clsx from "clsx";
import { Gameweek, GameweekStat, Player } from "@prisma/client";

export default function Teamsheet({players, gameweek, teamBlack, teamWhite}: {players: Player[], gameweek: Gameweek, teamBlack: GameweekStat[], teamWhite: GameweekStat[]}){

    const [chosenPlayerStats, updateChosenPlayerStats] = useState<GameweekStat>(teamBlack[0]);
    const [isPlayerSelected, updateSelectionStatus] = useState<boolean>(false);
    const [nominateForMotm, updateNominateForMotmStatus] = useState<boolean>(false);
    const [enterGoals, updateEnterGoalsStatus] = useState<boolean>(false);

    const goalsScoredRef = useRef<HTMLInputElement>(null);
    const playerCodeRef = useRef<HTMLInputElement>(null);
    const updateGoalsRef = useRef<HTMLButtonElement>(null);
    const handleNominationRef = useRef<HTMLButtonElement>(null);
    
    const chosenPlayer = players.find(player => player.playerID === chosenPlayerStats.playerID)

    const motm: number = gameweek.motm ?? -1;

    const handleClick = (stats: GameweekStat) => {
        if(gameweek.isactive){
            updateChosenPlayerStats(stats)
            updateSelectionStatus(!isPlayerSelected)
        }
       else {
            alert("Gameweek has been closed")
       }
    }

    const updateGoals = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if(updateGoalsRef.current){
            updateGoalsRef.current.style.display = 'none';  //immediately remove button so user doesn't click twice
        }

        if(chosenPlayer?.code.trim() === playerCodeRef.current?.value.trim()){
            const goals = {gameweekStatId: chosenPlayerStats.GameweekStatID, goalsScored: goalsScoredRef.current?.value};
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
            alert("Incorrect code")
        }
       
        resetChoices();
    };

    const handleNomination = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if(handleNominationRef.current){
            handleNominationRef.current.style.display = 'none';  //immediately remove button so user doesn't click twice
        }

        const nominator = players.find(player => player.code.trim() === playerCodeRef.current?.value.trim());

        if(nominator){
            const gameweekStat = [...teamBlack, ...teamWhite].find(gameweekStat => gameweekStat.playerID === nominator.playerID);

            if(!gameweekStat){
                alert("Player with entered code cannot vote");
                return;
            }

            const nominationPair = {gameweekStatId: gameweekStat?.GameweekStatID, nomineeId: chosenPlayer?.playerID};

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

        resetChoices();
    };

    const resetChoices = () => {
        updateSelectionStatus(false)
        updateEnterGoalsStatus(false)
        updateNominateForMotmStatus(false)
    }

    return (
        <div className="flex justify-around mt-5">
            {
                !isPlayerSelected && 
                <>
                    <div>
                        <h3 className="text-center font-bold text-xl text-rose-900">Team Black ({gameweek.blackscore} ⚽)</h3>
                        <ul>
                            {teamBlack.map((teamBlackPlayer) => (
                                <li key={teamBlackPlayer.playerID} className={clsx("p-[10px] rounded-lg hover:bg-gray-200 cursor-pointer text-center", teamBlackPlayer.nominated ? "font-semibold text-yellow-500" : "")}
                                    onClick={() => handleClick(teamBlackPlayer)}
                                >
                                   {(teamBlackPlayer.playerID === motm) && <span>👑</span>} {players.find(player => player.playerID === teamBlackPlayer.playerID)?.firstname} - {teamBlackPlayer.goals_scored} ⚽
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                            <h3 className="text-center font-bold text-xl text-rose-900">Team White ({gameweek.whitescore} ⚽)</h3>
                            <ul>
                                {teamWhite.map((teamWhitePlayer) => (
                                    <li key={teamWhitePlayer.playerID} className={clsx("p-[10px] rounded-lg hover:bg-gray-200 cursor-pointer text-center", teamWhitePlayer.nominated ? "font-semibold text-yellow-500" : "")}
                                        onClick={() => handleClick(teamWhitePlayer)}
                                    >
                                        {(teamWhitePlayer.playerID === motm) && <span>👑</span>} {players.find(player => player.playerID === teamWhitePlayer.playerID)?.firstname} - {teamWhitePlayer.goals_scored} ⚽
                                    </li>
                                ))}
                            </ul>
                    </div>
                </>
            }
            
            {
                isPlayerSelected && chosenPlayerStats.nominated && !nominateForMotm && !enterGoals &&

                <div className="flex flex-col h-[250px] items-center">
                    <h2 className="block text-lg font-bold text-red-700 mb-2">What action do you want to take</h2>
                    <button className="px-4 py-2 rounded-2xl bg-blue-500 text-white hover:bg-sky-400 transition shadow-md h-15 w-[50%] my-auto"
                        onClick={() => updateNominateForMotmStatus(true)}
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
                        onClick={() => updateSelectionStatus(!isPlayerSelected)}
                    >
                        Cancel
                    </button>
                </div>

            }
                
            {
                isPlayerSelected && (enterGoals || !chosenPlayerStats.nominated) && 
                <form
                    onSubmit={updateGoals}
                    className="max-w-sm mx-auto bg-white shadow-md rounded-lg p-6"
                    >
                    <div className="mb-4 space-y-2">
                        <label
                        htmlFor="textInput"
                        className="block text-lg font-bold text-red-700 mb-2"
                        >
                        {chosenPlayer?.firstname}
                        </label>
                        <label
                        htmlFor="textInput"
                        className="block text-sm font-medium text-gray-700 mb-2"
                        >
                        how many goals did you score?
                        </label>
                        <input
                        type='number'
                        id="textInput"
                        ref={goalsScoredRef}
                        name="textInput"
                        placeholder="goals"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                         <input
                        type="text"
                        id="textInput"
                        ref={playerCodeRef}
                        name="textInput"
                        placeholder="your code"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        onClick={resetChoices}
                    >
                        Cancel
                    </button>
                </form>
            }

            { isPlayerSelected && nominateForMotm && 
                <form
                    onSubmit={handleNomination}
                    className="max-w-sm mx-auto bg-white shadow-md rounded-lg p-6"
                >
                    <div className="mb-4">
                        <label
                        htmlFor="textInput"
                        className="block text-lg font-bold text-red-700 mb-2"
                        >
                        Are you sure you want to nominate {chosenPlayer?.firstname} for MOTM?
                        </label>
                        <input
                        type="text"
                        id="textInput"
                        ref={playerCodeRef}
                        name="textInput"
                        placeholder="your code"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        onClick={resetChoices}
                    >
                        Cancel
                    </button>
                </form>
            }
        </div>
    )
}