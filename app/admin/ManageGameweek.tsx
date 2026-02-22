'use client'

import { Matchday, Player } from "@/generated/prisma/client";
import { useContext, useRef, useState } from "react";
import { GlobalAppDataContext } from "../context/GlobalAppDataContext";
import { CloseMatchday, DeleteMatchday, UpdateFullTimeScore, UpdateMotmShortlist } from "../services/admin.service";

export default function ManageGameweek({gameweekPlayerList, gameweek, nomineeList}: {gameweekPlayerList: Player[], gameweek: Matchday, nomineeList: Player[]}){

    //todo
    //line 160

    const {loggedInPlayer} = useContext(GlobalAppDataContext);

    const [nominees, updateNominees] = useState(nomineeList);
    const [removedNominees, updateRemovedNominees] = useState<Player[]>([]);
    const [gameweekPlayers, updateGameweekPlayers] = useState(gameweekPlayerList);
    const [closeGameweekClicked, setCloseGameweekClicked] = useState(false);
    const [deleteGameweekClicked, setDeleteGameweekClicked] = useState(false);

    const onClickPlayer = (player: Player) => {

        if(!loggedInPlayer?.is_admin) { alert("Not permitted"); return; }
    
        const nomineesUpdate = [...nominees, player];
        const gameweekPlayersUpdate = gameweekPlayers.filter(gameweekPlayer => gameweekPlayer.id != player.id);

        updateNominees(nomineesUpdate);
        updateGameweekPlayers(gameweekPlayersUpdate);
    }

    const onclickNominatedPlayer = (nominee: Player) => {
        if(!loggedInPlayer?.is_admin) { alert("Not permitted"); return; }
        
        const nomineesUpdate = nominees.filter(player => player.id != nominee.id);
        const gameweekPlayersUpdate = [...gameweekPlayers, nominee];

        updateNominees(nomineesUpdate);
        updateRemovedNominees([...removedNominees, nominee])
        updateGameweekPlayers(gameweekPlayersUpdate);
    }

    const resetChoices = () => {
        setCloseGameweekClicked(false);
        updateNominees(nomineeList);
        updateRemovedNominees([]);
        updateGameweekPlayers(gameweekPlayerList);
    }

    const handleMotmShortlistUpdate = async (e: { preventDefault: () => void; }) => {
        const removedNomineesIds = removedNominees.map(player => player.id);
        const nomineesIds = nominees.map(player => player.id);

        e.preventDefault();

        if(loggedInPlayer?.is_admin) await UpdateMotmShortlist(gameweek.id, removedNomineesIds, nomineesIds);
        window.location.reload();
    }

    return (
        <div className="flex flex-col w-full lg:flex-row justify-between gap-4 p-10">

            {
                !closeGameweekClicked && !deleteGameweekClicked &&

                <>
                    <div className="h-[500px] overflow-y-auto bg-gray-100 dark:border-red-500 dark:border-4 dark:bg-inherit p-4 rounded-lg shadow-md">
                        <h3 className="text-center font-bold text-xl text-rose-900 dark:text-rose-500">Click on player to nominate for MOTM</h3>
                        <ul className="space-y-2">
                            {gameweekPlayers.map( (player) => (
                                <li key={player.code} className="p-[10px] rounded-lg hover:bg-sky-400 cursor-pointer text-center" onClick={() => onClickPlayer(player)}>
                                    {player.firstname}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col justify-between items-center">
                        <ul>
                            <h3 className="text-center font-bold text-xl text-rose-900 dark:text-rose-500">MOTM Nominees</h3>
                            {nominees.map( (player) => (
                                <li key={player.id} className="p-[10px] rounded-lg hover:bg-red-500 cursor-pointer text-center" onClick={() => onclickNominatedPlayer(player)}>
                                    {player.firstname}
                                </li>
                            ))}
                        </ul>

                        <form 
                            onSubmit={handleMotmShortlistUpdate}
                            className="flex flex-col gap-3"
                        >                      

                            <button className="px-4 py-2 rounded-2xl bg-rose-900 text-white hover:bg-rose-400 transition shadow-md h-10"
                                onClick={() => {}}
                            >
                                Update Nominees
                            </button>
                        </form>
                                                    
                    </div>

                    <div className="flex flex-col items-center gap-6">

                        <UpdateFullTimeScoreForm matchday={gameweek} />

                        <button className="px-4 py-2 rounded-2xl bg-rose-900 dark:bg-red-500 text-white hover:bg-rose-400 transition shadow-md h-14 w-60 my-auto" 
                            onClick={() => setDeleteGameweekClicked(true)}
                        >
                            Delete Gameweek
                        </button>

                        <button className="px-4 py-2 rounded-2xl bg-rose-900 dark:bg-red-500 text-white hover:bg-rose-400 transition shadow-md h-14 w-60 my-auto" 
                            onClick={() => setCloseGameweekClicked(true)}
                        >
                            Close Gameweek
                        </button>
                    </div>    
                </>   
            }
          
            {
                closeGameweekClicked && loggedInPlayer?.is_admin &&

                <CloseGameweekConfirmationForm 
                    resetChoices={resetChoices} 
                    matchday={gameweek} 
                />
            } 

            {
                deleteGameweekClicked && loggedInPlayer?.is_admin &&

                <DeleteGameweekConfirmationForm 
                    resetChoices={resetChoices} 
                    matchday={gameweek} 
                />
            }           
        </div>
    )
}


function UpdateFullTimeScoreForm({matchday}: {matchday: Matchday}) {

    const whiteScoreRef = useRef<HTMLInputElement>(null);
    const blackScoreRef = useRef<HTMLInputElement>(null);

    const {loggedInPlayer} = useContext(GlobalAppDataContext);

    const handleUpdateFullTimeScore = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const whiteScore = parseInt(whiteScoreRef.current?.value ?? "0");
        const blackScore = parseInt(blackScoreRef.current?.value ?? "0");
        if (loggedInPlayer?.is_admin){
            await UpdateFullTimeScore(matchday.id, whiteScore, blackScore);
            window.location.reload(); // change to context update
        }
    }


    return (
        <form
            className="max-w-sm mx-auto dark:border-red-500 dark:border-4 dark:bg-inherit rounded-lg p-6"
            onSubmit={handleUpdateFullTimeScore}
            method="POST"
        >
            <div className="mb-4 space-y-5">
                <label
                htmlFor="textInput"
                className="block text-lg font-bold text-rose-900 dark:text-rose-500 mb-2"
                >
                Update full time score
                </label>

                <input
                type="number"
                id="textInput"
                ref={blackScoreRef}
                name="textInput"
                placeholder="team black"
                defaultValue={matchday.blackscore ?? 0}
                className="w-full px-3 py-2 border border-gray-300 dark:border-red-400 dark:bg-inherit rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <input
                type="number"
                id="textInput"
                ref={whiteScoreRef}
                name="textInput"
                placeholder="team white"
                defaultValue={matchday.whitescore ?? 0}
                className="w-full px-3 py-2 border border-gray-300 dark:border-red-400 dark:bg-inherit rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <button
                type="submit"
                className="w-full my-2 bg-blue-500 dark:bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 dark:hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Update
            </button>
        </form>
    )
}

function CloseGameweekConfirmationForm({resetChoices, matchday}: {resetChoices: () => void, matchday: Matchday}) {

    const closeGameweekRef = useRef<HTMLButtonElement>(null);

    const {season} = useContext(GlobalAppDataContext);

    async function handleCloseGameweek(e: { preventDefault: () => void; }) {
         e.preventDefault();
        const matchdayId: number  = matchday.id;

        await CloseMatchday(matchdayId, season);
        window.location.reload();
    }

    return (
        <form
            className="max-w-sm mx-auto dark:border-red-500 dark:border-4 dark:bg-inherit shadow-md rounded-lg p-6"
            onSubmit={handleCloseGameweek}
        >
            <div className="mb-4">
                <label
                htmlFor="textInput"
                className="block text-lg font-bold text-red-700 dark:text-rose-500 mb-2"
                >
                Are you sure you want to close the gameweek
                </label>
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
    )
}


function DeleteGameweekConfirmationForm({resetChoices, matchday}: {resetChoices: () => void, matchday: Matchday}) {

    const adminCodeRef = useRef<HTMLInputElement>(null);
    const closeGameweekRef = useRef<HTMLButtonElement>(null);

    const {loggedInPlayer} = useContext(GlobalAppDataContext);

    async function handleDeleteGameweek() {
        const matchdayId: number  = matchday.id;

        if(loggedInPlayer?.is_admin) await DeleteMatchday(matchdayId);
    }

    return (
        <form
            className="max-w-sm mx-auto dark:border-red-500 dark:border-4 dark:bg-inherit shadow-md rounded-lg p-6"
            onSubmit={handleDeleteGameweek}
        >
            <div className="mb-4">
                <label
                htmlFor="textInput"
                className="block text-lg font-bold text-red-700 dark:text-rose-500 mb-2"
                >
                THIS WILL DELETE THE GAMEWEEK. IT IS NOT REVERSIBLE
                </label>
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
    )
}