'use client'

import { Gameweek, Player } from "@prisma/client";
import { useRef, useState } from "react";
import { adminCloseGameweek, updateFullTimeScore, updateMotmShortlist } from "../services/api.service";

    //TODO
    // replace window.location.reload()
    
export default function ManageGameweek({gameweekPlayerList, gameweek, nomineeList}: {gameweekPlayerList: Player[], gameweek: Gameweek, nomineeList: Player[]}){

    const [nominees, updateNominees] = useState(nomineeList);
    const [removedNominees, updateRemovedNominees] = useState<Player[]>([]);
    const [gameweekPlayers, updateGameweekPlayers] = useState(gameweekPlayerList);
    const [closeGameweekClicked, setCloseGameweekClicked] = useState(false);

    const adminCodeRef = useRef<HTMLInputElement>(null);

    const onClickPlayer = (player: Player) => {
        const nomineesUpdate = [...nominees, player];
        const gameweekPlayersUpdate = gameweekPlayers.filter(gameweekPlayer => gameweekPlayer.playerID != player.playerID);

        updateNominees(nomineesUpdate);
        updateGameweekPlayers(gameweekPlayersUpdate);
    }

    const onclickNominatedPlayer = (nominee: Player) => {
        const nomineesUpdate = nominees.filter(player => player.playerID != nominee.playerID);
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
        const removedNomineesIds = removedNominees.map(player => player.playerID);
        const nomineesIds = nominees.map(player => player.playerID);
        const adminCodeValue = adminCodeRef.current?.value ?? "";

        e.preventDefault();
        await updateMotmShortlist(adminCodeValue, removedNomineesIds, nomineesIds, gameweek.gameweekID);
        window.location.reload();
    }

    return (
        <div className="flex flex-col w-full lg:flex-row justify-between gap-4 p-10">

            {
                !closeGameweekClicked &&

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
                                <li key={player.playerID} className="p-[10px] rounded-lg hover:bg-red-500 cursor-pointer text-center" onClick={() => onclickNominatedPlayer(player)}>
                                    {player.firstname}
                                </li>
                            ))}
                        </ul>

                        <form 
                            onSubmit={handleMotmShortlistUpdate}
                            className="flex flex-col gap-3"
                        >
                            <input
                                type="text"
                                id="textInput"
                                ref={adminCodeRef}
                                placeholder="admin code"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />

                            <button className="px-4 py-2 rounded-2xl bg-rose-900 text-white hover:bg-rose-400 transition shadow-md h-10"
                                onClick={() => {}}
                            >
                                Update Nominees
                            </button>
                        </form>
                                                    
                    </div>

                    <div className="flex flex-col items-center gap-6">

                        <UpdateFullTimeScoreForm gameweek={gameweek} />

                        <button className="px-4 py-2 rounded-2xl bg-rose-900 dark:bg-red-500 text-white hover:bg-rose-400 transition shadow-md h-20 w-60 my-auto" 
                            onClick={() => setCloseGameweekClicked(true)}
                        >
                            Close Gameweek
                        </button>
                    </div>    
                </>   
            }
          
            {
                closeGameweekClicked &&

                <CloseGameweekConfirmationForm 
                    resetChoices={resetChoices} 
                    gameweek={gameweek} 
                />
            }           
        </div>
    )
}


function UpdateFullTimeScoreForm({gameweek}: {gameweek: Gameweek}) {

    const adminCodeRef = useRef<HTMLInputElement>(null);
    const whiteScoreRef = useRef<HTMLInputElement>(null);
    const blackScoreRef = useRef<HTMLInputElement>(null);

    const handleUpdateFullTimeScore = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const adminCodeValue = adminCodeRef.current?.value ?? "";
        const whiteScore = parseInt(whiteScoreRef.current?.value ?? "0");
        const blackScore = parseInt(blackScoreRef.current?.value ?? "0");
        updateFullTimeScore(adminCodeValue, gameweek.gameweekID, whiteScore, blackScore);
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
                className="block text-lg font-bold text-red-700 dark:text-rose-500 mb-2"
                >
                Update full time score
                </label>

                <input
                type="number"
                id="textInput"
                ref={blackScoreRef}
                name="textInput"
                placeholder="team black"
                defaultValue={gameweek.blackscore ?? 0}
                className="w-full px-3 py-2 border border-gray-300 dark:border-red-400 dark:bg-inherit rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <input
                type="number"
                id="textInput"
                ref={whiteScoreRef}
                name="textInput"
                placeholder="team white"
                defaultValue={gameweek.whitescore ?? 0}
                className="w-full px-3 py-2 border border-gray-300 dark:border-red-400 dark:bg-inherit rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <input
                type="text"
                id="textInput"
                ref={adminCodeRef}
                name="textInput"
                placeholder="admin code"
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

function CloseGameweekConfirmationForm({resetChoices, gameweek}: {resetChoices: () => void, gameweek: Gameweek}) {

    const adminCodeRef = useRef<HTMLInputElement>(null);
    const closeGameweekRef = useRef<HTMLButtonElement>(null);

    return (
        <form
            className="max-w-sm mx-auto dark:border-red-500 dark:border-4 dark:bg-inherit  shadow-md rounded-lg p-6"
            onSubmit={() => adminCloseGameweek(adminCodeRef.current?.value ?? "", gameweek.gameweekID)}
        >
            <div className="mb-4">
                <label
                htmlFor="textInput"
                className="block text-lg font-bold text-red-700 dark:text-rose-500 mb-2"
                >
                Are you sure you want to close the gameweek
                </label>
                <input
                    type="text"
                    id="textInput"
                    ref={adminCodeRef}
                    name="textInput"
                    placeholder="admin code"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-red-400 dark:bg-inherit rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
    )
}