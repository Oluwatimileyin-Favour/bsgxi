import { MatchdayStat } from "@/generated/prisma/client";
import { fetchAllPlayersSeasonStats, findGameweekStatsByPlayerIdAndGameweekId, updateMatchdayStat } from "./db.service";

export async function UpdateGoals(gameweekStatId: number, goals: number) {
    try {
        const dataToUpdate = { goals_scored: goals};
        await updateMatchdayStat(gameweekStatId, dataToUpdate);
        
        alert("Goals Updated")
    }
    catch(err) {
        alert(err);
    }               
}

export async function UpdateMotmNomination(playerId: number | undefined, nominatedPlayerId: number, matchdayId: number) {
    try{
        if(playerId === undefined && playerId !== 0) throw("Unexpected error. Cannot determine logged in player");

        const playerMatchdayStat: MatchdayStat | null = await findGameweekStatsByPlayerIdAndGameweekId(playerId, matchdayId); 
        
        if(!playerMatchdayStat) throw("Not allowed. You don't seem to have been a part of this match");

        const dataToUpdate: Partial<MatchdayStat> = {nominee_id: nominatedPlayerId};
        await updateMatchdayStat(playerMatchdayStat?.id,  dataToUpdate)

        alert("Nomination Saved")
    }
    catch(err) {
        alert(err);
    }  
}

export async function GetPlayersSeasonStats(seasonId: number){
    try{
        return await fetchAllPlayersSeasonStats(seasonId);
    }
    catch (err) {
        alert(err);
    }
}