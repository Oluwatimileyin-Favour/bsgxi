// type LeaderBoardColourKey = keyof typeof LeaderBoardColours;

export interface LeaderboardConfig {
    lightModeColor: string,
    darkModeColor: string,
    headerText: string,
    displayEmoji?: string,
    sortedList: string[]
}