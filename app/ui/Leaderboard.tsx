import { LeaderboardConfig } from "../interfaces/LeaderboardConfig";

export default function Leaderboard({leaderboardConfig}: {leaderboardConfig: LeaderboardConfig}){

    return (
      <div className={`w-[350px] shadow-lg rounded-xl p-4 ${leaderboardConfig.darkModeColor} dark:border-4`}>
        <h2 className={`text-2xl font-bold text-center ${leaderboardConfig.lightModeColor} ${leaderboardConfig.darkModeColor} mb-3`}> {leaderboardConfig.headerText} {leaderboardConfig.displayEmoji} </h2>
        <div className="h-[400px] overflow-y-auto">
          <ul className="flex flex-col gap-2">
            {leaderboardConfig.sortedList.map((item, index) => (
              <li 
                key={index} 
                className={`p-2 rounded-lg shadow-sm transition-all 
                  ${index < 3 ? "bg-gray-300 dark:bg-gray-800 font-semibold" : "bg-gray-200 dark:bg-gray-700"}`
                }
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
}