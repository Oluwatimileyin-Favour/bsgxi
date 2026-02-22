import ApiResponse from "@/app/interfaces/ApiResponse";
import { ApiRouteActions } from "@/app/lib/ApiRouteActions";
import { createMatchday, deleteMatchday, findMatchdayStatsByMatchdayId, updateMatchday, updateMatchdayPlayersTotalStats, updateMatchdayStat } from "@/app/services/db.service";
import determineMOTM from "@/app/util/determineMOTM";
import { Matchday, MatchdayStat } from "@/generated/prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {

    const body = await req.json();

    if(body.action === ApiRouteActions.ACTIVATE_GAMEWEEK){
      const newGameweek: Matchday = body.payload;
      const createdGameweek: Matchday = await createMatchday(newGameweek);
      
      const response: ApiResponse = {
        success: true,
        result: createdGameweek
      };
      return NextResponse.json(response);
    }

    else if(body.action === ApiRouteActions.DELETE_GAMEWEEK){
      const gameweekId = body.payload;
      const deletedGameweek: Matchday =  await deleteMatchday(gameweekId);

      const response: ApiResponse = {
        success: true,
        result: deletedGameweek
      };
      return NextResponse.json(response);
    }

    else if(body.action === ApiRouteActions.CLOSE_GAMEWEEK){
    
      const gameweekId = body.payload;
      const gameweekStats: MatchdayStat[] = await findMatchdayStatsByMatchdayId(gameweekId);

      const motm = determineMOTM(gameweekStats);

      if(motm != -1){

        await updateMatchday(gameweekId, {motm: motm, isactive: false});
              
        const motmGameweekStatIdx = gameweekStats.findIndex(gameweekStat => gameweekStat.player_id === motm);
        if(motmGameweekStatIdx) {
          gameweekStats[motmGameweekStatIdx].points = 4;
          await updateMatchdayStat(gameweekStats[motmGameweekStatIdx].id, {points: 4}); 
        }

        await updateMatchdayPlayersTotalStats(gameweekStats);
      }
      else{
        throw("Error occured in motm calculation")
      }
      
      const response: ApiResponse = {
        success: true
      };
      return NextResponse.json(response);
    }    
  } 
  
  catch (err: unknown) {
    const response: ApiResponse = {
      success: false,
      error: String(err)
    };

    return NextResponse.json(response, { status: 500 });
  }
}