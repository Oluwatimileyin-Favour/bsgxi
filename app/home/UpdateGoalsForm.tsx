import { Player, Gameweekstat } from "@prisma/client";
import { RefObject, useRef } from "react";
import generateAdminCode from "../util/generateCode";


export default function UpdateGoalsForm({selectedPlayer, selectedPlayerStats, resetState}: 
    {
    selectedPlayer: Player | undefined,
    selectedPlayerStats: Gameweekstat,
    resetState: () => void,
}) {

    // CONSIDER MOVING FUNCTION FOR DB INTERACTION TO A SERVICE
    // MIGHT USE ONE UNIFIED SERVICE FOR ALL DB INTERACTIONS

    const goalsScoredRef = useRef<HTMLInputElement>(null);
    const playerCodeRef = useRef<HTMLInputElement>(null);
    const updateGoalsRef = useRef<HTMLButtonElement>(null);

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

    if(selectedPlayer?.code.trim() === playerCodeRef.current?.value.trim() || playerCodeRef.current?.value.trim() === generateAdminCode()){
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