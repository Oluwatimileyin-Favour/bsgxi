'use client'

import { Matchday, MatchdayStat, Player, PlayerSeasonStat } from '@/generated/prisma/client';
import { createContext } from 'react';

interface GlobalAppData {
    players: Player[],
    matchdays: Matchday[],
    matchdayStats: MatchdayStat[],
    loggedInPlayer: Player | undefined,
    season: number,
    playersSeasonStats: PlayerSeasonStat[],
    setSeason: (_year: number) => void
}

export const GlobalAppDataContext = createContext<GlobalAppData>({players: [], matchdays: [], matchdayStats: [], loggedInPlayer: undefined, season: 2, playersSeasonStats: [], setSeason : (_year: number) => {}});