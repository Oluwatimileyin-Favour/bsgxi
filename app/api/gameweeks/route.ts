import ApiResponse from "@/app/interfaces/ApiResponse";
import { ApiRouteActions } from "@/app/lib/ApiRouteActions";
import { createGameweek, deleteGameweek, findGameweekStatsByGameweekID, updateGameweek, updateGameweekPlayersTotalStats, updateGameweekStat } from "@/app/services/db.service";
import determineMOTM from "@/app/util/determineMOTM";
import { Gameweek, Gameweekstat } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {

    const body = await req.json();

    if(body.action === ApiRouteActions.ACTIVATE_GAMEWEEK){
      const newGameweek: Gameweek = body.payload;
      const createdGameweek: Gameweek = await createGameweek(newGameweek);
      
      const response: ApiResponse = {
        success: true,
        result: createdGameweek
      };
      return NextResponse.json(response);
    }

    else if(body.action === ApiRouteActions.DELETE_GAMEWEEK){
      const gameweekId = body.payload;
      const deletedGameweek: Gameweek =  await deleteGameweek(gameweekId);

      const response: ApiResponse = {
        success: true,
        result: deletedGameweek
      };
      return NextResponse.json(response);
    }

    else if(body.action === ApiRouteActions.CLOSE_GAMEWEEK){
    
      const gameweekId = body.payload;
      const gameweekStats: Gameweekstat[] = await findGameweekStatsByGameweekID(gameweekId);

      const motm = determineMOTM(gameweekStats);

      if(motm != -1){

        await updateGameweek(gameweekId, {motm: motm, isactive: false});
              
        const motmGameweekStatIdx = gameweekStats.findIndex(gameweekStat => gameweekStat.playerID === motm);
        if(motmGameweekStatIdx) {
          gameweekStats[motmGameweekStatIdx].points = 4;
          await updateGameweekStat(gameweekStats[motmGameweekStatIdx].gameweekStatID, {points: 4}); 
        }

        await updateGameweekPlayersTotalStats(gameweekStats);
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