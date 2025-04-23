import { Player } from "@prisma/client";

export default function BallondOrBoard({rankings}: {rankings: Player[]}){

    return (
      <div className="w-[350px] shadow-lg rounded-xl p-4 dark:border-rose-500 dark:border-4">
        <h2 className="text-2xl font-bold text-center text-rose-500 mb-3">Road to Ballon d&apos;Or 🏆</h2>
        <div className="h-[400px] overflow-y-auto">
          <ul className="flex flex-col gap-2">
            {rankings.map((player, index) => (
              <li 
                key={index} 
                className={`p-2 rounded-lg shadow-sm transition-all ${
                  index < 3 ? "bg-gray-200 dark:bg-gray-800 font-semibold" : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                {player.firstname} - {player.totalpoints} pts
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  
}