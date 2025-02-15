'use client'

import { useState, useRef } from "react";
import generateCode from "../util/generateCode";
import { Player, Gameweek } from "@prisma/client";

export default function ActivateGameweek({playerList, nextGameweek }: { playerList: Player[] , nextGameweek: number}) {

    const [players, updatePlayerList] = useState<Player[]>(playerList);
    const [teamblack, updateTeamBlack] = useState<Player[]>([]);
    const [teamwhite, updateTeamWhite] = useState<Player[]>([]);
    const [whiteTurn, updateTurn] = useState<boolean>(true);
    
    const dateRef = useRef<HTMLInputElement | null>(null);
    const adminCodeRef = useRef<HTMLInputElement>(null);

    const adminCode =  generateCode();
    
    const onclickplayer = (chosenPlayer: Player) => {
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

    const onclickChosenPlayer = (chosenPlayer: Player, team: number) => {
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

        if(dateRef.current?.value === ""){
            alert("Select Date");
            return;
        }

        const gameweek: Gameweek = {
            gameweekID: nextGameweek,
            date: new Date(dateRef.current?.value ?? "") ?? new Date(),
            isactive: true,
            gametype: "Regular",
            whitescore: 0,
            blackscore: 0,
            motm: null
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

        if(adminCodeRef.current?.value != adminCode){
            alert("Incorrect Code");
            return;
        }

        const gameweekInfo = await activateGameweek();
        
        if(!gameweekInfo){
            alert("Error saving teams");
            return;
        }

        const teamInfo = {gameweekID: gameweekInfo.result.gameweekID, whiteteam: teamwhite, blackteam: teamblack}

        try {
            const response = await fetch("/api/attendance", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({teamInfo}),
            });
      
            const data = await response.json();
            if (data.success) {
              alert("Teams saved successfully. Gameweek Activated"); 
              window.location.reload();
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
        <div className="flex flex-col gap-4 items-center md:flex-row md:justify-around w-[100%] p-10">

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
        
            <div className="flex justify-between w-[300px] md:w-[400px] h-[500px] rounded-lg shadow-md bg-gray-100 p-4">
                
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

            <div className="flex flex-col w-[300px] h-[250px] self-center justify-around items-center shadow-md bg-gray-100">

                <input 
                    type="date" 
                    ref={dateRef}
                    placeholder="date"
                    className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-500 transition" 
                />

                <input
                    type="text"
                    id="textInput"
                    ref={adminCodeRef}
                    name="textInput"
                    placeholder="admin code"
                    className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-500"
                />  

                <button className="px-4 py-2 rounded-2xl bg-rose-900 text-white hover:bg-rose-400 transition shadow-md h-20 w-[50%]" onClick={saveteamSheets}>
                    Activate Gameweek
                </button>

            </div>   
        </div>
    )
}