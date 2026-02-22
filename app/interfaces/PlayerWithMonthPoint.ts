import { PlayerSeasonStat } from "@/generated/prisma/client";

export interface PlayerWithMonthPoint {
    player: PlayerSeasonStat,
    monthPoints: number
}