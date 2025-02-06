'use client'

import { Gameweeks } from "@prisma/client";
import { useState, useRef } from "react";


export default function ActivateGameweek({playerList, nextGameweek}) {

    const [players, updatePlayerList] = useState(playerList);
    const [teamblack, updateTeamBlack] = useState([]);
    const [teamwhite, updateTeamWhite] = useState([]);
    const [whiteTurn, updateTurn] = useState([true]);
    
    const dateRef = useRef<HTMLInputElement | null>(null);

    const onclickplayer = (chosenPlayer) => {
        const updatePlayers = players.filter(player => player.playerID != chosenPlayer.playerID);
        const updateblack = [...teamblack, chosenPlayer];
        const updatewhite = [...teamwhite, chosenPlayer];

        updatePlayerList(updatePlayers);

        if(whiteTurn) {
            updateTeamWhite(updatewhite);
        }
        else {
            updateTeamBlack(updateblack);
        }
        
        if(teamwhite.length > teamblack.length){
            updateTurn(false);
        }
        else if(teamblack.length > teamwhite.length){
            updateTurn(true);
        }
        else{
            updateTurn(!whiteTurn);
        }
    }

    const onclickChosenPlayer = (chosenPlayer, team) => {
        const updatePlayers = [...players, chosenPlayer];

        updatePlayerList(updatePlayers);

        if(team === 0){
            const updatewhite = teamwhite.filter(player => player.playerID != chosenPlayer.playerID);
            updateTeamWhite(updatewhite);
            updateTurn(true);
        }
        else {
            const updateblack = teamblack.filter(player => player.playerID != chosenPlayer.playerID);
            updateTeamBlack(updateblack);
            updateTurn(false);
        }
    }

    const activateGameweek = async () => {

        const gameweek: Gameweeks = {
            gameweekID: nextGameweek,
            date: new Date(dateRef.current?.value) ?? new Date(),
            isactive: true,
            gametype: "Regular",
            whitescore: 0,
            blackscore: 0
        }
            
        const body = {action: "activateGameweek", payload: gameweek}
        try {
            const response = await fetch("/api/gameweeks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ body}),
            });
        
            const data = await response.json();
            if (data.success) {
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


    const saveteamSheets = async () => {

        const gameweekInfo = await activateGameweek();

        const teamInfo = {gameweekID: gameweekInfo.createdGameweek.gameweekID, whiteteam: teamwhite, blackteam: teamblack}

        try {
            const response = await fetch("/api/attendance", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({teamInfo}),
            });
      
            const data = await response.json();
            if (data.success) {
              alert("Teams saved successfully!");  
            } 
            else {
              console.error("Error:", data.error);
            }
        } 
        catch (error) {
            alert("Request failed: " + error);
        }
    }
    

    return (
        <div className="flex justify-around w-[100%] p-10">

            <div className="w-[300px] h-[500px] overflow-y-auto bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 className="text-center font-bold text-xl text-rose-900">Click on player to select</h3>
                <ul className="space-y-2">
                    {players.map( (player) => (
                        <li key={player.code} className="p-[10px] rounded-lg hover:bg-sky-400 cursor-pointer text-center" onClick={() => onclickplayer(player)}>
                            {player.firstname}
                        </li>
                    ))}
                </ul>
            </div>
        
            <div className="flex justify-between w-[400px] h-[500px] rounded-lg shadow-md bg-gray-100 p-4">
                
                <ul>
                    <h3 className="text-center font-bold text-xl text-rose-900">Team White</h3>
                    {teamwhite.map( (player) => (
                        <li key={player.code} className="p-[10px] rounded-lg hover:bg-red-500 cursor-pointer text-center" onClick={() => onclickChosenPlayer(player, 0)}>
                            {player.firstname}
                        </li>
                    ))}
                </ul>

                <ul>
                    <h3 className="text-center font-bold text-xl text-rose-900">Team Black</h3>
                    {teamblack.map( (player) => (
                        <li key={player.code} className="p-[10px] rounded-lg hover:bg-red-500 cursor-pointer text-center" onClick={() => onclickChosenPlayer(player, 1)}>
                            {player.firstname}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-col space-y-10 w-[400px] h-[250px] self-center justify-around items-center shadow-md bg-gray-100">

                <input 
                    type="date" 
                    ref={dateRef}
                    className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-500 transition" 
                />

                <button className="px-4 py-2 rounded-2xl bg-rose-900 text-white hover:bg-rose-400 transition shadow-md h-20 w-[50%] my-auto" onClick={saveteamSheets}>
                    Activate Gameweek
                </button>

            </div>   
        </div>
    )
}