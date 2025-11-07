import { Gameweekstat } from "@prisma/client";
import { findMostFrequent } from "./frequencyCalculator";

export default function determineMOTM(gameweekStats: Gameweekstat[]): number {
    const nominatedPlayers: number[] = gameweekStats
        .map(gameweekStat => gameweekStat.nomineeID)
        .filter((nominee): nominee is number => nominee !== null && nominee !== undefined && nominee !== 100);
    
    let motm: number = nominatedPlayers[0] ?? -1;  //set motm (man of the match) to -1 if no one was nominated at all

    if(nominatedPlayers.length > 1){
        motm = findMostFrequent(nominatedPlayers) ?? -1;

        const potentialOtherMotm = findMostFrequent(nominatedPlayers.filter(nominee => nominee != motm)) ?? -1;
        const motmNumVotes = nominatedPlayers.filter(nominee => nominee === motm).length
        const potentialOtherMotmNumVotes = nominatedPlayers.filter(nominee => nominee === potentialOtherMotm ).length

        if(motmNumVotes === potentialOtherMotmNumVotes){
            throw("Multiple MOTMs");
        }
    }

    return motm;
}