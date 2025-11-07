import { LeaderboardConfig } from "../interfaces/LeaderboardConfig";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

export default function PotmLeaderboard({leaderboardConfig, updateTableData}: {leaderboardConfig: LeaderboardConfig, updateTableData: (month: number) => void}){

    return (
      <div className={`w-[350px] shadow-lg rounded-xl p-4 ${leaderboardConfig.darkModeColor} dark:border-4 dark:w-[360px]`}>
        <h2 className={`flex items-center justify-around text-2xl min-w-[300px] font-bold text-center ${leaderboardConfig.lightModeColor} ${leaderboardConfig.darkModeColor} mb-3`}>
            <span className="flex justify-center w-[35px] p-2 rounded-lg text-center shrink-0 fine-pointer:hover:bg-rose-200 cursor-pointer" onClick={() => updateTableData(-1)}><HiOutlineChevronLeft /> </span>
            {leaderboardConfig.headerText} {leaderboardConfig.displayEmoji} 
            <span className="flex justify-center w-[35px] p-2 rounded-lg text-center shrink-0 fine-pointer:hover:bg-rose-200 cursor-pointer" onClick={() => updateTableData(1)}><HiOutlineChevronRight/> </span>
        </h2>
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