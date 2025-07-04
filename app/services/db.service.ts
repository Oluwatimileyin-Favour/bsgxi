import { Gameweek, Gameweekstat, Player} from "@prisma/client";
import { prisma } from "../lib/prisma";

export async function fetchAllPlayers() {
    return await prisma.player.findMany();
}

export async function fetchAllGameweeks() {
    return await prisma.gameweek.findMany();
}

export async function fetchAllGameweekStats() {
    return await prisma.gameweekstat.findMany();
}

export async function fetchAllClassicos() {
    return await prisma.classicos.findMany();
}

export async function findGameweekStatsByGameweekID(gameweekID: number) {
    return await prisma.gameweekstat.findMany({ where: { gameweekID: gameweekID } })
}

export async function createGameweek(gameweek: Gameweek) {
    return await prisma.gameweek.create({data: gameweek});
}

export async function createManyGameweekStats(gameweeksList: Gameweekstat[]) {
    return await prisma.gameweekstat.createMany({data: gameweeksList});
}

export async function updatePlayer(playerID: number, dataToUpdate: Partial<Player>) {
    return await prisma.player.update({
                where: { playerID: playerID },
                data: dataToUpdate
            })
}

export async function updateGameweek(gameweekID: number, dataToUpdate: Partial<Gameweek>) {
    return await prisma.gameweek.update({
                where: { gameweekID: gameweekID },
                data: dataToUpdate
            })
}

export async function updateGameweekStat(gameweekStatID: number, dataToUpdate: Partial<Gameweekstat>) {
    return await prisma.gameweekstat.update({
                where: { gameweekStatID: gameweekStatID },
                data: dataToUpdate
            })
}

export async function updateGameweekStatsByPlayerIdAndGameweekID(playerIds: number[], gameweekIds: number[],  dataToUpdate: Partial<Gameweekstat>) {
    return await prisma.gameweekstat.updateMany({
                where: {
                    playerID: { in: playerIds }, 
                    gameweekID: { in: gameweekIds }
                },
                data: dataToUpdate
            })
}

export async function updateGameweekPlayersStats(gameweekStats: Gameweekstat[]) {

    const transactions = gameweekStats.map((gameweekStat) =>
          prisma.player.update({
            where: { playerID: gameweekStat.playerID },
            data: { totalgoals: {increment: gameweekStat.goals_scored ?? 0},
                    totalpoints: {increment: gameweekStat.points ?? 0}
                  },
          })
    );

    await prisma.$transaction(transactions);
}