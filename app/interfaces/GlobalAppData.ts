import { Matchday, MatchdayStat, Player, PlayerSeasonStat } from "@/generated/prisma/client";

export interface GlobalAppData {
    players: Player[],
    matchdays: Matchday[],
    matchdayStats: MatchdayStat[],
    playersSeasonStats: PlayerSeasonStat[]
}