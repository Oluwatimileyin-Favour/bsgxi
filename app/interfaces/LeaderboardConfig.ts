import { LeaderBoardColours } from "../lib/TailwindColours";

type LeaderBoardColourKey = keyof typeof LeaderBoardColours;

export interface LeaderboardConfig {
    lightModeColor: LeaderBoardColourKey,
    darkModeColor: LeaderBoardColourKey,
    headerText: string,
    displayEmoji?: string,
    sortedList: string[]
}