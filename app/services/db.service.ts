"use server"

import { Matchday, MatchdayStat, Player, PlayerSeasonStat } from "@/generated/prisma/client";
import { PlayerSeasonStatUpdate } from "../interfaces/PlayerSeasonStatUpdate";
import { PlayerStatus } from "../lib/PlayerStatus";
import { prisma } from "../lib/prisma";

export async function getPlayerCount() {
    return await prisma.player.count();
}

export async function getMatchDayCountBySeason(season: number) {
    return await prisma.matchday.count({where: {season_id: season}});
}

export async function getMatchDayCount() {
    return await prisma.matchday.count();
}

export async function fetchAllPlayers() {
    return await prisma.player.findMany();
}

export async function fetchAllActivePlayers() {
    return await prisma.player.findMany({where: {status_id: 1}});
}

export async function fetchAllGameweeks() {
    return await prisma.matchday.findMany();
}

export async function fetchAllGameweeksBySeason(seasonId: number) {
    return await prisma.matchday.findMany({where: {season_id: seasonId}});
}

export async function fetchAllGameweekStats() {
    return await prisma.matchdayStat.findMany();
}

export async function fetchAllGameweekStatsBySeason(seasonId: number) {
    return await prisma.matchdayStat.findMany({where: {season_id: seasonId}});
}

export async function fetchAllPlayersSeasonStats(seasonId: number){
    return await prisma.playerSeasonStat.findMany({where: {season_id: seasonId}})
}

export async function fetchAllClassicos() {
    return await prisma.classico.findMany();
}

export async function findPlayerByCode(playerCode: string) {
    return await prisma.player.findUnique({where:{ code: playerCode }});
}

export async function findPlayerByEmail(email: string) {
    return await prisma.player.findFirst({where:{ email: email }});
}

export async function findActivePlayerByEmail(email: string) {
    return await prisma.player.findFirst({where:{ email: email, status_id: PlayerStatus.Active }});
}

export async function findMatchdayStatsByMatchdayId(matchdayId: number) {
    return await prisma.matchdayStat.findMany({ where: { matchday_id: matchdayId } })
}

export async function findGameweekStatsByPlayerIdAndGameweekId(playerId: number, gameweekId: number) {
    return await prisma.matchdayStat.findFirst({
        where: {
          player_id: playerId,
          matchday_id: gameweekId
        }
      })
}

export async function createPlayer(player: Player) {
    return await prisma.player.create({data: player});
}

export async function createMatchday(matchday: Matchday) {
    return await prisma.matchday.create({data: matchday});
}

export async function deleteMatchday(matchdayId: number) {
    deleteStatsForMatchday(matchdayId);

    return await prisma.matchday.delete({
        where: {id: matchdayId}
    })
}

export async function createPlayerSeasonStat(playerSeasonStat: PlayerSeasonStat){
    return await prisma.playerSeasonStat.create({data: playerSeasonStat});
}

export async function createManyMatchdayStats(matchdayStats: MatchdayStat[]) {
    return await prisma.matchdayStat.createMany({data: matchdayStats});
}

export async function deleteStatsForMatchday(matchdayId: number) {
    return await prisma.matchdayStat.deleteMany({
        where: {matchday_id: matchdayId}
    })
}
export async function updatePlayer(playerID: number, dataToUpdate: Partial<Player>) {
    return await prisma.player.update({
                where: { id: playerID },
                data: dataToUpdate
            })
}

export async function updateMultipleplayers(playerIds: number[], dataToUpdate: Partial<Player>) {
    return await prisma.player.updateMany({
                where: { id: {in: playerIds } },
                data: dataToUpdate
            })   
}

export async function updateMatchday(matchdayId: number, dataToUpdate: Partial<Matchday>) {
    return await prisma.matchday.update({
                where: { id: matchdayId },
                data: dataToUpdate
            })
}

export async function updateMatchdayStat(matchdayStatId: number, dataToUpdate: Partial<MatchdayStat>) {
    return await prisma.matchdayStat.update({
                where: { id: matchdayStatId },
                data: dataToUpdate
            })
}

export async function updateGameweekStatsByPlayerIdAndGameweekID(playerIds: number[], gameweekIds: number[],  dataToUpdate: Partial<MatchdayStat>) {
    return await prisma.matchdayStat.updateMany({
                where: {
                    id: { in: playerIds }, 
                    matchday_id: { in: gameweekIds }
                },
                data: dataToUpdate
            })
}


export async function updateGameweekStatsByPlayerIdsAndGameweekID(playerIds: number[], gameweekId: number,  dataToUpdate: Partial<MatchdayStat>) {
    return await prisma.matchdayStat.updateMany({
                where: {
                    player_id: { in: playerIds }, 
                    matchday_id: gameweekId
                },
                data: dataToUpdate
            })
}

export async function updateMatchdayPlayersTotalStats(matchdayStats: MatchdayStat[]) {

    const transactions = matchdayStats.map((stat) =>
          prisma.player.update({
            where: { id: stat.player_id },
            data: { totalgoals: {increment: stat.goals_scored ?? 0},
                    totalpoints: {increment: stat.points ?? 0}
                  },
          })
    );

    await prisma.$transaction(transactions);
}

export async function updateMatchdayPlayersSeasonStats(playerSeasonStatUpdates: PlayerSeasonStatUpdate[]) {

    const transactions = playerSeasonStatUpdates.map((stat) =>
          prisma.playerSeasonStat.update({
            where: { id: stat.id },
            data: { goals: {increment: stat.goals ?? 0},
                    points: {increment: stat.points ?? 0},
                    games_played: {increment: 1}
                  },
          })
    );

    await prisma.$transaction(transactions);
    
}


export async function addPlayersToSeason(playerIds: number[]) {

    const transactions = playerIds.map((playerId) =>
          prisma.playerSeasonStat.createMany({
            data: { player_id: playerId,
                    season_id: 2,
                    goals: 0,
                    points: 0
                  },
          })
    );

    await prisma.$transaction(transactions);
}