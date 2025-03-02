'use client'

import { useState, useRef } from "react";
import generateCode from "../util/generateCode";
import { Player, Gameweek } from "@prisma/client";
import Dropdown from "../ui/Dropdown";
import { GameweekType } from "../lib/GameweekTypes";

export default function ActivateGameweek({playerList, nextGameweek }: { playerList: Player[] , nextGameweek: number}) {

    const [players, updatePlayerList] = useState<Player[]>(playerList);
    const [teamblack, updateTeamBlack] = useState<Player[]>([]);
    const [teamwhite, updateTeamWhite] = useState<Player[]>([]);
    const [gameweekPlayers, updateGameweekPlayers] = useState<Player[]>([]);
    const [gameType, updateGameType] = useState<string>(GameweekType.Regular); 
    const [whiteTurn, updateTurn] = useState<boolean>(true);
    
    const dateRef = useRef<HTMLInputElement | null>(null);
    const adminCodeRef = useRef<HTMLInputElement>(null);

    const adminCode =  generateCode();

    const gameweekTypes: string[] = Object.values(GameweekType); 

    const resetState = () => {
        updatePlayerList(playerList);
        updateTurn(true);
        updateTeamBlack([]);
        updateTeamWhite([]);
        updateGameweekPlayers([]);
    }

    const handleUpdateGameType = (idx: number) => {
        resetState();
        updateGameType(gameweekTypes[idx]);
    }
    
    const onclickplayer = (chosenPlayer: Player) => {
        const updatePlayers = players.filter(player => player.playerID != chosenPlayer.playerID);
        updatePlayerList(updatePlayers);

        if(gameType === GameweekType.Regular){
            const updateblack = [...teamblack, chosenPlayer];
            const updatewhite = [...teamwhite, chosenPlayer];
    
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

        else if(gameType === GameweekType.ThreeTeam){
            const updatedGameweekPlayers = [...gameweekPlayers, chosenPlayer];
            updateGameweekPlayers(updatedGameweekPlayers)
        }
       
    }

    const onclickChosenPlayer = (chosenPlayer: Player, team?: number) => {
        const updatePlayers = [...players, chosenPlayer];

        updatePlayerList(updatePlayers);

        if(gameType == GameweekType.Regular){
                
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

        else if(gameType === GameweekType.ThreeTeam){
            const updatedGameweekPlayers = gameweekPlayers.filter(player => player.playerID != chosenPlayer.playerID);
            updateGameweekPlayers(updatedGameweekPlayers);
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
            gametype: gameType,
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

        let teamInfo = {gameweekID: gameweekInfo.result.gameweekID, whiteteam: teamwhite, blackteam: teamblack}

        if(gameType === GameweekType.ThreeTeam){
            teamInfo = {gameweekID: gameweekInfo.result.gameweekID, whiteteam: gameweekPlayers, blackteam: []}
        }
        
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

            {
                gameType === GameweekType.Regular &&

                    <div className="flex justify-between w-[300px] md:w-[400px] h-[500px] overflow-y-auto rounded-lg shadow-md bg-gray-100 p-4">
                    
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
                
            }

            { 
                gameType === GameweekType.ThreeTeam &&      

                    <div className="flex flex-col rounded-lg shadow-md bg-gray-100 py-4 px-10 h-[500px] overflow-y-auto">
                        <h3 className="text-center font-bold text-xl text-rose-900">Gameweek Players</h3>
                        <ul>
                            {gameweekPlayers.map( (player) => (
                                <li key={player.code} className="p-[10px] rounded-lg hover:bg-red-500 cursor-pointer text-center" onClick={() => onclickChosenPlayer(player)}>
                                    {player.firstname}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
            }
        
           

            <div className="flex flex-col gap-5 w-[300px] p-2 self-center justify-around items-center shadow-md bg-gray-100">

                <Dropdown menuItems={Object.values(GameweekType)} selectedItem={gameType} reactToSelection={handleUpdateGameType} displayTextSize="text-xl"></Dropdown>

                <input 
                    type="date" 
                    ref={dateRef}
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