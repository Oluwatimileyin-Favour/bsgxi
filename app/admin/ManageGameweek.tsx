'use client'

import { useState, useRef } from "react"
import generateCode from "../util/generateCode";
import { Player, Gameweek } from "@prisma/client";

export default function ManageGameweek({gameweekPlayerList, gameweek, nomineeList, haveNominatedPlayers}: {gameweekPlayerList: Player[], gameweek: Gameweek, nomineeList: Player[], haveNominatedPlayers: boolean}){

    const [nominees, updateNominees] = useState(nomineeList)
    const [gameweekPlayers, updateGameweekPlayers] = useState(gameweekPlayerList);
    const [closeGameweek, updateCloseGameweekStatus] = useState(false);
    const [nominatePlayers, updateNominatePlayersStatus] = useState(false);

    const whiteScoreRef = useRef<HTMLInputElement>(null);
    const blackScoreRef = useRef<HTMLInputElement>(null);
    const adminCodeRef = useRef<HTMLInputElement>(null);
    const closeGameweekRef = useRef<HTMLButtonElement>(null);

    const adminCode =  generateCode();

    const onclickplayer = (player: Player) => {
        if(!haveNominatedPlayers){
            const nomineesUpdate = [...nominees, player];
            const gameweekPlayersUpdate = gameweekPlayers.filter(gameweekPlayer => gameweekPlayer.playerID != player.playerID);
    
            updateNominees(nomineesUpdate);
            updateGameweekPlayers(gameweekPlayersUpdate);
        }
    }

    const onclickChosenPlayer = (nominee: Player) => {
        if(!haveNominatedPlayers){
            const nomineesUpdate = nominees.filter(player => player.playerID != nominee.playerID);
            const gameweekPlayersUpdate = [...gameweekPlayers, nominee];
    
            updateNominees(nomineesUpdate);
            updateGameweekPlayers(gameweekPlayersUpdate);
        }  
    }

    const handleCloseGameweek = async (e: { preventDefault: () => void; }) => {

        if(adminCodeRef.current?.value != adminCode){
            alert("Incorrect Code");
            return;
        }
        
        e.preventDefault();

        if(closeGameweekRef.current){
            closeGameweekRef.current.style.display = 'none';  //immediately remove button so user doesn't click twice
        }
        
        const body = {action: "closeGameweek", payload: gameweek}
        try {
            const response = await fetch("/api/gameweeks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ body}),
            });
        
            const data = await response.json();
            if (data.success) {
                window.location.reload();
                return data
            } 
            else {
                throw(data.error)
            }
        } 
        catch (error) {
          alert("Request failed: " + error);
        }
    }

    const resetChoices = () => {
        updateCloseGameweekStatus(false);
        updateNominatePlayersStatus(false);
    }

    const saveNominations = async (e: { preventDefault: () => void; }) => {

        if(adminCodeRef.current?.value != adminCode){
            alert("Incorrect Code");
            return;
        }

        e.preventDefault();
        
        const body = {action: "adminSelectNominees", payload: nominees};
        try {
            const response = await fetch("/api/nomination", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({body}),
            });
      
            const data = await response.json();
            if (data.success) {
              alert("Nominees saved successfully!");  
              window.location.reload();
            } 
            else {
              alert("Error: " + data.error);
            }
        } 
        catch (error) {
            alert("Request failed: " + error);
        }

        resetChoices();
    }

    const updateFullTimeScore = async (e: React.FormEvent) => {

        if(adminCodeRef.current?.value != adminCode){
            alert("Incorrect Code");
            return;
        }
        
        e.preventDefault();
        const scores = {currentGameweek: gameweek, whitescore: whiteScoreRef.current?.value, blackscore: blackScoreRef.current?.value};
        try {
            const response = await fetch("/api/updatescore", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({scores}),
            });
      
            const data = await response.json();
            if (data.success) {
              alert("Full time score updated successfully!");  
            } 
            else {
              alert("Error: " + data.error);
            }
        } 
        catch (error) {
            alert("Request failed: " + error);
        }
    }

    return (
        <div className="flex flex-col gap-4 lg:flex-row w-[100%] justify-around p-10">

            {
                !closeGameweek && !nominatePlayers &&
                <>
                    {
                        !haveNominatedPlayers &&
                        <div className="h-[500px] overflow-y-auto bg-gray-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-center font-bold text-xl text-rose-900">Click on player to nominate for MOTM</h3>
                            <ul className="space-y-2">
                                {gameweekPlayers.map( (player) => (
                                    <li key={player.code} className="p-[10px] rounded-lg hover:bg-sky-400 cursor-pointer text-center" onClick={() => onclickplayer(player)}>
                                        {player.firstname}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }
                    

                    <div className="flex flex-col justify-between items-center">
                        <ul>
                            <h3 className="text-center font-bold text-xl text-rose-900">Nominees</h3>
                            {nominees.map( (player) => (
                                <li key={player.playerID} className="p-[10px] rounded-lg hover:bg-red-500 cursor-pointer text-center" onClick={() => onclickChosenPlayer(player)}>
                                    {player.firstname}
                                </li>
                            ))}
                        </ul>
                            { !haveNominatedPlayers &&
                                <button className="px-4 py-2 rounded-2xl bg-rose-900 text-white hover:bg-rose-400 transition shadow-md h-10 w-[100px]"
                                    onClick={() => updateNominatePlayersStatus(true)}
                                >
                                    Confirm
                                </button>
                            }   
                    </div>

                    <div className="flex flex-col items-center">
                        <form
                            className="max-w-sm mx-auto bg-white rounded-lg p-6"
                            onSubmit={updateFullTimeScore}
                            method="POST"
                        >
                            <div className="mb-4 space-y-5">
                                <label
                                htmlFor="textInput"
                                className="block text-lg font-bold text-red-700 mb-2"
                                >
                                Update full time score
                                </label>

                                <input
                                type="number"
                                id="textInput"
                                ref={whiteScoreRef}
                                name="textInput"
                                placeholder="team white"
                                defaultValue={gameweek.whitescore ?? 0}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />

                                <input
                                type="number"
                                id="textInput"
                                ref={blackScoreRef}
                                name="textInput"
                                placeholder="team black"
                                defaultValue={gameweek.blackscore ?? 0}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />

                                <input
                                type="text"
                                id="textInput"
                                ref={adminCodeRef}
                                name="textInput"
                                placeholder="admin code"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full my-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Update
                            </button>
                        </form>

                        <button className="px-4 py-2 rounded-2xl bg-rose-900 text-white hover:bg-rose-400 transition shadow-md h-20 w-60 my-auto" 
                            onClick={() => updateCloseGameweekStatus(true)}
                        >
                            Close Gameweek
                        </button>
                    </div>
                </>
               
            }

            {
                nominatePlayers &&

                <div className="flex flex-col gap-4 lg:flex-row h-[500px] w-[700px]">
                        <ul>
                            <h3 className="text-center font-bold text-xl text-rose-900">Nominees</h3>
                            {nominees.map( (player) => (
                                <li key={player.code} className="p-[10px] rounded-lg hover:bg-red-500 cursor-pointer text-center" onClick={() => onclickChosenPlayer(player)}>
                                    {player.firstname}
                                </li>
                            ))}
                        </ul>

                        <form
                            className="max-w-sm mx-auto bg-white rounded-lg p-6"
                            onSubmit={saveNominations}
                            method="POST"
                        >
                            <div className="mb-4">
                                <label
                                htmlFor="textInput"
                                className="block text-lg font-bold text-red-700 mb-2"
                                >
                                Are you sure you want to nominate these players
                                </label>

                                <input
                                type="text"
                                id="textInput"
                                ref={adminCodeRef}
                                name="textInput"
                                placeholder="admin code"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full my-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                I&apos;m sure
                            </button>
                            <button
                                className="w-full my-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                onClick={resetChoices}
                            >
                                Cancel
                            </button>
                        </form>
                </div>
            }
          
            {
                closeGameweek &&

                <form
                    className="max-w-sm mx-auto bg-white shadow-md rounded-lg p-6"
                    onSubmit={handleCloseGameweek}
                >
                    <div className="mb-4">
                        <label
                        htmlFor="textInput"
                        className="block text-lg font-bold text-red-700 mb-2"
                        >
                        Are you sure you want to close the gameweek
                        </label>
                        <input
                            type="text"
                            id="textInput"
                            ref={adminCodeRef}
                            name="textInput"
                            placeholder="admin code"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full my-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ref={closeGameweekRef}
                    >
                        I&apos;m sure
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