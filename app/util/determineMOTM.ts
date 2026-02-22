import { MatchdayStat } from "@/generated/prisma/client";
import { findMostFrequent } from "./frequencyCalculator";
import { DummyPlayer } from "../lib/DummyData";

export default function determineMOTM(gameweekStats: MatchdayStat[]): number {
    const nominatedPlayers: number[] = gameweekStats
        .map(gameweekStat => gameweekStat.nominee_id)
        .filter((nominee): nominee is number => nominee !== null && nominee !== undefined && nominee !== DummyPlayer.id);
    
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