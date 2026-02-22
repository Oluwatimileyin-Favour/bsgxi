'use client'

import { PlayerSeasonStat } from "@/generated/prisma/client";
import { useContext, useRef, useState } from "react";
import { GlobalAppDataContext } from "../context/GlobalAppDataContext";
import { GameweekType } from "../lib/GameweekTypes";
import { TeamNumber } from "../lib/teamNumbers";
import { CreateMatchday_Regular } from "../services/admin.service";
import Dropdown from "../ui/Dropdown";

export default function ActivateGameweek({playerList}: { playerList: PlayerSeasonStat[]}) {

    //todo
    //handle activeting other game types

    const [players, updatePlayerList] = useState<PlayerSeasonStat[]>(playerList);
    const [teams, updateTeams] = useState<PlayerSeasonStat[][]>([[],[],[]]);
    const [threeTeamGamePlayers, updateThreeTeamGamePlayers] = useState<PlayerSeasonStat[]>([]);
    const [gameType, updateGameType] = useState<GameweekType>(GameweekType.Regular); 
    const [turn, updateTurn] = useState<TeamNumber>(TeamNumber.Black); 

    const {loggedInPlayer} = useContext(GlobalAppDataContext);

    const gameweekTypes: string[] = Object.values(GameweekType);

    const resetState = () => {
        updatePlayerList(playerList);
        updateTurn(TeamNumber.Black);
        updateTeams([[], [], []]);
        updateThreeTeamGamePlayers([]);
    }

    const handleUpdateGameType = (idx: number) => {
        resetState();

        //map chosen gameweek type from dropdown list to GameweekType value from the enum
        const updatedGameType = Object.keys(GameweekType).find(key => GameweekType[key as keyof typeof GameweekType] === gameweekTypes[idx]);
        updateGameType(GameweekType[updatedGameType as keyof typeof GameweekType]);
    }
    
    const onclickplayer = (chosenPlayer: PlayerSeasonStat) => {
        if(!loggedInPlayer?.is_admin) { alert("Not permitted"); return; }

        const updatePlayers = players.filter(player => player.id != chosenPlayer.id);
        updatePlayerList(updatePlayers);
        
        if(gameType === GameweekType.ThreeTeam){
            const updatedGameweekPlayers = [...threeTeamGamePlayers, chosenPlayer];
            updateThreeTeamGamePlayers(updatedGameweekPlayers)
        } 
        
        else {
            const updatedTeams = [...teams];

            updatedTeams[turn] = [...updatedTeams[turn], chosenPlayer];
            updateTeams(updatedTeams);
        }      
    }

    const onclickChosenPlayer = (chosenPlayer: PlayerSeasonStat, team: number) => { //passing team because this function runs before turn updates 

        if(!loggedInPlayer?.is_admin) { alert("Not permitted"); return; }

        const updatePlayers = [...players, chosenPlayer];
        updatePlayerList(updatePlayers);

        if(gameType === GameweekType.ThreeTeam){
            const updatedGameweekPlayers = threeTeamGamePlayers.filter(player => player.id != chosenPlayer.id);
            updateThreeTeamGamePlayers(updatedGameweekPlayers);
        }

        else {
            const updatedTeams = [...teams];
            updatedTeams[team] = updatedTeams[team].filter(player => player.id != chosenPlayer.id);
            updateTeams(updatedTeams);
        }   
    }

    const saveTeams = async (date: string) => {
        if(!loggedInPlayer?.is_admin) { alert("Not permitted"); return; }

        if(gameType === GameweekType.Regular) {
            await CreateMatchday_Regular(date, teams[TeamNumber.Black], teams[TeamNumber.White]);
        }
        else{
            //await saveTeamSheets(date, gameType, teams[TeamNumber.Black], teams[TeamNumber.White], teams[TeamNumber.Red], threeTeamGamePlayers);
        }
        // router.push('/');
        window.location.reload();
    }

    return (
        <div className="w-[100%] h-[100%] flex flex-col gap-4 items-center lg:flex-row md:justify-around p-10 max-w-[1441px]">

            <div className="flex flex-col gap-4 items-center md:flex-row md:justify-around md:w-[100%] lg:w-[60%]">

                <PlayerList
                    players={players} 
                    onclickplayer={onclickplayer}
                />

                {
                    gameType === GameweekType.Regular &&

                    <RegularGameInterface 
                        turn={turn}
                        updateTurn={updateTurn}
                        teamblack={teams[TeamNumber.Black]}
                        teamwhite={teams[TeamNumber.White]}
                        onclickChosenPlayer={onclickChosenPlayer}
                    />
                    
                }

                {
                    gameType === GameweekType.Classico &&

                    <ClassicoGameInterface 
                        turn={turn}
                        updateTurn={updateTurn}
                        teamblack={teams[TeamNumber.Black]}
                        teamwhite={teams[TeamNumber.White]}
                        teamRed={teams[TeamNumber.Red]}
                        onclickChosenPlayer={onclickChosenPlayer}
                    />
                    
                }

                { 
                    gameType === GameweekType.ThreeTeam &&      

                    <ThreeTeamGameInterface 
                        threeTeamGamePlayers={threeTeamGamePlayers}
                        onclickChosenPlayer={onclickChosenPlayer}
                    />
                }
            </div>

            <AdminControlInterface 
                gameType={gameType} 
                handleUpdateGameType={handleUpdateGameType} 
                saveTeams={saveTeams}
            /> 
        </div>
    )
}


function PlayerList({players, onclickplayer}: {players: PlayerSeasonStat[], onclickplayer: (player: PlayerSeasonStat) => void}) {
    return (
        <div className="w-[300px] min-h-[300px] h-[500px] overflow-y-auto bg-gray-100 p-4 rounded-lg shadow-md dark:border-sky-400 dark:border-4 dark:bg-inherit">
            <h3 className="text-center font-bold text-xl text-rose-900 dark:text-rose-500">Click on player to select</h3>
            <ul className="space-y-2">
                {players.map( (player) => (
                    <li key={player.id} className="p-[10px] rounded-lg hover:bg-sky-400 dark:hover:bg-sky-900 cursor-pointer text-center" onClick={() => onclickplayer(player)}>
                        {player.username}
                    </li>
                ))}
            </ul>
        </div>
    )
}

function RegularGameInterface({turn, updateTurn, teamblack, teamwhite, onclickChosenPlayer} : 
    {
        turn: TeamNumber
        updateTurn: (team: TeamNumber) => void,
        teamblack: PlayerSeasonStat[],
        teamwhite: PlayerSeasonStat[],
        onclickChosenPlayer: (player: PlayerSeasonStat, team: TeamNumber) => void
    }
) {

    return (
        <div className="flex justify-between w-[350px] min-h-[150px] max-h-[500px] md:h-[500px] overflow-y-auto rounded-lg shadow-md bg-gray-100 p-4 dark:border-sky-400 dark:border-4 dark:bg-inherit">
            
            <ul className="hover:cursor-pointer" onClick={() => updateTurn(TeamNumber.Black)}>
                <h3 className={`text-center font-bold text-xl ${turn === TeamNumber.Black? "text-rose-600 dark:text-rose-400" :" text-rose-900 dark:text-rose-500"} `}>Team Black</h3>
                {teamblack.map( (player) => (
                    <li key={player.id} className="p-[10px] rounded-lg hover:bg-red-500 cursor-pointer text-center" onClick={() => onclickChosenPlayer(player, TeamNumber.Black)}>
                        {player.username}
                    </li>
                ))}
            </ul>

            <ul className="hover:cursor-pointer" onClick={() => updateTurn(TeamNumber.White)}>
                <h3 className={`text-center font-bold text-xl  ${turn === TeamNumber.White? "text-rose-600 dark:text-rose-400" :" text-rose-900 dark:text-rose-500"} `}>Team White</h3>
                {teamwhite.map( (player) => (
                    <li key={player.id} className="p-[10px] rounded-lg hover:bg-red-500 cursor-pointer text-center" onClick={() => onclickChosenPlayer(player, TeamNumber.White)}>
                        {player.username}
                    </li>
                ))}
            </ul>
        </div>
    )
}

function ClassicoGameInterface({turn, updateTurn, teamblack, teamwhite, teamRed, onclickChosenPlayer}: 
    {
        turn: TeamNumber,
        updateTurn: (team: TeamNumber) => void,
        teamblack: PlayerSeasonStat[],
        teamwhite: PlayerSeasonStat[],
        teamRed: PlayerSeasonStat[],
        onclickChosenPlayer: (player: PlayerSeasonStat, team: TeamNumber) => void
    }
) {

    return (
         <div className="flex justify-between w-[600px] min-h-[150px] max-h-[500px] md:h-[500px] overflow-y-auto rounded-lg shadow-md bg-gray-100 p-4 dark:border-sky-400 dark:border-4 dark:bg-inherit">
                        
            <ul className="hover:cursor-pointer" onClick={() => updateTurn(TeamNumber.Black)}>
                <h3 className={`text-center font-bold text-xl  ${turn === TeamNumber.Black? "text-rose-800 dark:text-rose-400" :" text-rose-900 dark:text-rose-500"} `}>Oldies</h3>
                {teamblack.map( (player) => (
                    <li key={player.id} className="p-[10px] rounded-lg hover:bg-red-500 cursor-pointer text-center" onClick={() => onclickChosenPlayer(player, TeamNumber.Black)}>
                        {player.username}
                    </li>
                ))}
            </ul>

            <ul className="hover:cursor-pointer" onClick={() => updateTurn(TeamNumber.White)}>
                <h3 className={`text-center font-bold text-xl  ${turn === TeamNumber.White? "text-rose-800 dark:text-rose-400" :" text-rose-900 dark:text-rose-500"} `}>Newbies</h3>
                {teamwhite.map( (player) => (
                    <li key={player.id} className="p-[10px] rounded-lg hover:bg-red-500 cursor-pointer text-center" onClick={() => onclickChosenPlayer(player, TeamNumber.White)}>
                        {player.username}
                    </li>
                ))}
            </ul>

            <ul className="hover:cursor-pointer" onClick={() => updateTurn(TeamNumber.Red)}>
                <h3 className={`text-center font-bold text-xl  ${turn === TeamNumber.Red? "text-rose-800 dark:text-rose-400" :" text-rose-900 dark:text-rose-500"} `}>Youngblood</h3>
                {teamRed.map( (player) => (
                    <li key={player.id} className="p-[10px] rounded-lg hover:bg-red-500 cursor-pointer text-center" onClick={() => onclickChosenPlayer(player, TeamNumber.Red)}>
                        {player.username}
                    </li>
                ))}
            </ul>
        </div>
    )
}

function ThreeTeamGameInterface({threeTeamGamePlayers, onclickChosenPlayer}: 
    {
        threeTeamGamePlayers: PlayerSeasonStat[], 
        onclickChosenPlayer: (player: PlayerSeasonStat, team: TeamNumber) => void
    }
) {

    return (
        <div className="flex flex-col rounded-lg shadow-md bg-gray-100 py-4 px-10 min-h-[150px] max-h-[500px] w-[300px] md:h-[500px] overflow-y-auto dark:border-sky-400 dark:border-4 dark:bg-inherit">
            <h3 className="text-center font-bold text-xl text-rose-900 dark:text-rose-500">Gameweek Players</h3>
            <ul>
                {threeTeamGamePlayers.map( (player) => (
                    <li key={player.id} className="p-[10px] rounded-lg hover:bg-red-500 cursor-pointer text-center" onClick={() => onclickChosenPlayer(player,TeamNumber.White)}>
                        {player.username}
                    </li>
                ))}
            </ul>
        </div>
    )
}

function AdminControlInterface({gameType, handleUpdateGameType, saveTeams}: 
    {
        gameType: string, 
        handleUpdateGameType: (idx: number) => void, 
        saveTeams: (date: string) => void
    }
) {

    const dateRef = useRef<HTMLInputElement | null>(null);

    function handleSaveTeams() {
        const gameweekDate: string = (dateRef.current?.value) ?? "";
        saveTeams(gameweekDate);
    }

    return (
        <div className="flex flex-col gap-5 w-[300px] p-2 self-center justify-around items-center shadow-md bg-gray-100 dark:border-sky-400 dark:border-4 dark:bg-inherit">

            <Dropdown menuItems={Object.values(GameweekType)} selectedItem={gameType} reactToSelection={handleUpdateGameType} displayTextSize="text-xl"></Dropdown>

            <input 
                type="date" 
                ref={dateRef}
                className="px-3 py-2 border border-gray-300 dark:border-sky-400 dark:border-2 dark:bg-inherit rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-500 transition" 
            />

            <button className="px-4 py-2 rounded-2xl bg-rose-900 text-white hover:bg-rose-400 transition shadow-md h-20 w-[50%]" onClick={handleSaveTeams}>
                Activate Gameweek
            </button>
        </div>
    )
}