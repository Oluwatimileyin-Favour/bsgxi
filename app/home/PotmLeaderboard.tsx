import Emojis from "../lib/constants/emojis";
import { PlayerWithMonthPoint } from "../interfaces/PlayerWithMonthPoint";

export default function PotmLeaderboard({rankings}: {rankings: PlayerWithMonthPoint[]}){

    return (
      <div className="w-[350px] shadow-lg rounded-xl p-4">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-3"> April POTM {Emojis.potmLeaderBoardEmoji} </h2>
        <div className="h-[400px] overflow-y-auto">
          <ul className="flex flex-col gap-2">
            {rankings.map((playerWithMonthPoint, index) => (
              <li 
                key={index} 
                className={`p-2 rounded-lg shadow-sm transition-all ${
                  index < 3 ? "bg-gray-200 font-semibold" : "bg-gray-100"
                } fine-pointer:hover:bg-rose-200`}
              >
                {playerWithMonthPoint.player.firstname} - {playerWithMonthPoint.monthPoints} pts
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  
}