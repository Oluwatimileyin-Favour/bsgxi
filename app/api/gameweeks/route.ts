import { NextResponse } from "next/server";
import { findMostFrequent } from "@/app/util/frequencyCalculator";
import { createGameweek, findGameweekStatsByGameweekID, updateGameweek, updateGameweekPlayersStats, updateGameweekStat} from "@/app/services/db.service";
import { Gameweekstat } from "@prisma/client";

export async function POST(req: Request) {
  try {

    const { body } = await req.json();

    if(body.action === "activateGameweek"){
      const createdGameweek = await createGameweek(body.payload);

      return NextResponse.json({ success: true, result: createdGameweek });
    }

    else if(body.action === "closeGameweek"){

      const gameweekStats: Gameweekstat[] = await findGameweekStatsByGameweekID(body.payload.gameweekID)

      const nominatedPlayers: number[] = gameweekStats
        .map(gameweekStat => gameweekStat.nomineeID)
        .filter((nominee): nominee is number => nominee !== null && nominee !== undefined && nominee !== 100);
        
      let motm: number = nominatedPlayers[0] ?? -1;  //set motm (man of the match) to -1 if no one was nominated at all

      if(nominatedPlayers.length > 1){
        motm = findMostFrequent(nominatedPlayers) ?? -1;

        const potentialOtherMotm = findMostFrequent(nominatedPlayers.filter(nominee => nominee != motm)) ?? -1;
        const motmNumVotes = nominatedPlayers.filter(nominee => nominee === motm).length
        const potentialOtherMotmNumVotes = nominatedPlayers.filter(nominee => nominee === potentialOtherMotm ).length

        if(motmNumVotes === potentialOtherMotmNumVotes){
          throw("Multiple MOTMs");
        }
      }

      if(motm != -1){

        await updateGameweek(body.payload.gameweekID, {motm: motm, isactive: false});
              
        const motmGameweekStatIdx = gameweekStats.findIndex(gameweekStat => gameweekStat.playerID === motm);
        if(motmGameweekStatIdx) {
          gameweekStats[motmGameweekStatIdx].points = 4;
          await updateGameweekStat(gameweekStats[motmGameweekStatIdx].gameweekStatID, {points: 4}); 
        }

        await updateGameweekPlayersStats(gameweekStats);
      }
      else{
        throw("Error occured in motm calculation")
      }
      
      return NextResponse.json({ success: true});
    }
    
  } catch (error) {
    return NextResponse.json({ success: false, error: error}, { status: 500 });
  }
}