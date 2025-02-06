import { Player } from "@prisma/client";

export default function GoldenBootBoard({rankings}: {rankings: Player[]}){

        return (
          <div className="w-[350px] bg-white shadow-lg rounded-xl p-4">
            <h2 className="text-2xl font-bold text-center text-sky-500 mb-3">Road to Golden Boot</h2>
            <div className="h-[400px] overflow-y-auto">
              <ul className="space-y-2">
                {rankings.map((player, index) => (
                  <li 
                    key={index} 
                    className={`flex justify-between items-center p-2 rounded-lg shadow-sm transition-all ${
                      index < 3 ? "bg-gray-200 font-semibold" : "bg-gray-100"
                    } hover:bg-rose-200 hover:scale-105`}
                  >
                    {player.firstname} - {player.totalgoals} ⚽
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      
}