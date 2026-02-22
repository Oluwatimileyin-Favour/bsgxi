import { Matchday, MatchdayStat, PlayerSeasonStat } from "@/generated/prisma/client";
import { PlayerSeasonStatUpdate } from "../interfaces/PlayerSeasonStatUpdate";
import { GameweekType } from "../lib/GameweekTypes";
import { TeamNumber } from "../lib/teamNumbers";
import determineMOTM from "../util/determineMOTM";
import { addPlayersToSeason, createManyMatchdayStats, createMatchday, deleteMatchday, fetchAllPlayersSeasonStats, findMatchdayStatsByMatchdayId, getMatchDayCount, updateGameweekStatsByPlayerIdsAndGameweekID, updateMatchday, updateMatchdayPlayersSeasonStats, updateMatchdayStat, updateMultipleplayers } from "./db.service";
import { DummyPlayer } from "../lib/DummyData";


export async function CreateMatchday_Regular(date: string, teamBlack: PlayerSeasonStat[], teamWhite: PlayerSeasonStat[]) {
    
    if(date && date === ""){
        alert("Select Date");
        return;
    }

    const gameWeekDate = new Date(date);

    if(!gameWeekDate){
        alert("Invalid Date");
        return;
    }

    let newMatchday: Matchday | null = null;

    try {
        const numOfMatchdays: number = await getMatchDayCount();
        
        const matchday: Matchday = {
            id: numOfMatchdays + 1,    //TODO UPDATE
            season_id: 2,
            date: gameWeekDate,
            isactive: true,
            gametype: GameweekType.Regular,
            whitescore: 0,
            blackscore: 0,
            motm: null
        }
        
        newMatchday = await createMatchday(matchday);

        const blackPlayersStats = teamBlack?.map((player: PlayerSeasonStat) => {
            const matchdayStat: Partial<MatchdayStat> = {matchday_id: newMatchday?.id, season_id: 2, player_id: player.player_id, team: TeamNumber.Black, goals_scored: 0,  nominee_id: DummyPlayer.id, points: 1, shortlisted: false}
            return matchdayStat;
        }) ?? []

        const whitePlayersStats = teamWhite?.map((player: PlayerSeasonStat) => {
            const matchdayStat: Partial<MatchdayStat> = {matchday_id: newMatchday?.id, season_id: 2, player_id: player.player_id, team: TeamNumber.White, goals_scored: 0, nominee_id: DummyPlayer.id, points: 1, shortlisted: false}
            return matchdayStat;
        }) ?? []

        await createManyMatchdayStats(blackPlayersStats.concat(whitePlayersStats) as MatchdayStat[]);
    } 

    catch(err) {

        if(newMatchday) deleteMatchday(newMatchday.id);

        alert(err);
    }   
}

export async function UpdateMotmShortlist(matchdayId: number, removedNomineesIds: number[], nomineesIds: number[]){
    try{
        if(removedNomineesIds.length > 0) {
            const dataToUpdate: Partial<MatchdayStat> = {shortlisted: false, points: 1};
            await updateGameweekStatsByPlayerIdsAndGameweekID(removedNomineesIds, matchdayId, dataToUpdate);       
        }

        const dataToUpdate: Partial<MatchdayStat> = {shortlisted: true, points: 2};
        await updateGameweekStatsByPlayerIdsAndGameweekID(nomineesIds, matchdayId, dataToUpdate);

        alert("MOTM Shortlist Updated")
    }

    catch(err) {
        alert(err);
    }   
}

export async function UpdateFullTimeScore(matchdayId: number, whitescore: number, blackscore: number) {
    try {
        const dataToUpdate: Partial<Matchday> = {whitescore, blackscore};
        await updateMatchday(matchdayId, dataToUpdate);

        alert("Score updated")
    }
    catch(err) {
        alert(err);
    }   
}

export async function CloseMatchday(matchdayId: number, seasonId: number) {

    try {
        const matchdayStats: MatchdayStat[] = await findMatchdayStatsByMatchdayId(matchdayId);
        const playersSeasonStats: PlayerSeasonStat[] = await fetchAllPlayersSeasonStats(seasonId);
        
        const motm = determineMOTM(matchdayStats);

        if(motm === -1) throw("Error occured in motm calculation. Likely no clear winner")
         
        const motmGameweekStatIdx = matchdayStats.findIndex(stat => stat.player_id === motm) ?? -1;

        if(motmGameweekStatIdx !== -1) {
            matchdayStats[motmGameweekStatIdx].points = 4;
            await updateMatchdayStat(matchdayStats[motmGameweekStatIdx].id, {points: 4}); 
        }

        const playerSeasonStatUpdates: PlayerSeasonStatUpdate[] =  matchdayStats.map((stat) => {
            return {
                id: playersSeasonStats.find(stat => stat.player_id === stat.player_id)?.id,
                goals: stat.goals_scored ?? 0,
                points: stat.points ?? 0
            }
        })

        await updateMatchdayPlayersSeasonStats(playerSeasonStatUpdates);
        await updateMatchday(matchdayId, {motm: motm, isactive: false});
    } 

    catch(err) {
        alert(err);
    } 
}

export async function DeleteMatchday(matchdayId: number) {
    try {
        await deleteMatchday(matchdayId)
    }
    catch(err){
        alert(err);
    }   
}

export async function AddPlayersToSeason(playerIds: number[]) {
    try{
        await addPlayersToSeason(playerIds);
        alert("Players sucessfully added to current season")
    }
    catch(err){
        alert(err);
    }
}

export async function MakePlayersActive(playerIds: number[]) {
    try{
        await updateMultipleplayers(playerIds, {status_id: 1});
        alert("Players Status Updated");
    }
    catch(err) {
        alert(err);
    }
}