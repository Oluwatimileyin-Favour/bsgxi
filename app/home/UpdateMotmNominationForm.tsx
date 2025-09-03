import { Player } from "@prisma/client"
import { RefObject, useRef } from "react"

export default function UpdateMotmNominationForm({selectedPlayer, gameweekID, resetState} : {
    selectedPlayer: Player | undefined,
    gameweekID: number,
    resetState: () => void,
}) {

    //TODO
    // CONSIDER MOVING FUNCTION FOR DB INTERACTION TO A SERVICE

    const playerCodeRef = useRef<HTMLInputElement>(null);
    const handleNominationRef = useRef<HTMLButtonElement>(null);

    return (
        <form
            onSubmit={e => updateMotmNomination(e, handleNominationRef, selectedPlayer, playerCodeRef.current?.value.trim(), gameweekID, resetState, )}
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

async function updateMotmNomination(
    e: React.FormEvent<HTMLFormElement>,
    handleNominationRef: RefObject<HTMLButtonElement | null>,
    nominatedPlayer: Player | undefined,
    playerCode: string | undefined,
    gameweekID: number,
    resetState: () => void,
){

    e.preventDefault();

    if(handleNominationRef.current){
        handleNominationRef.current.style.display = 'none';  //immediately remove button so user doesn't click twice
    }

    const body = {action: "getNominatorAndTheirGameweekStat", payload:  {playerCode, gameweekID}};

    const getNominatorAndTheirGameweekStat = await fetch("/api/nomination", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({body})
    });

    const response = await getNominatorAndTheirGameweekStat.json();
    const nominator = response.result.player;
    const nominatorGameweekstat = response.result.playerGameweekstat;

    if(nominator){
        if(!nominatorGameweekstat){
            alert("Player with entered code cannot vote");
            resetState();
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
                alert("Nomination saved successfully");  
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
       alert("Incorrect code");
    }

    resetState();
}