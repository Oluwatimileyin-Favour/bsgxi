import { Matchday, MatchdayStat, Player, PlayerSeasonStat } from "@/generated/prisma/client";
import { ReactNode } from "react";

export interface GlobalAppDataContextProps {
    players: Player[],
    matchdays: Matchday[],
    matchdayStats: MatchdayStat[],
    loggedInPlayer: Player | undefined,
    playersSeasonStats: PlayerSeasonStat[],
    children: ReactNode
} 