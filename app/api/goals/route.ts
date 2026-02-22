import { NextResponse } from "next/server";
import { ApiRouteActions } from "@/app/lib/ApiRouteActions";
import ApiResponse from "@/app/interfaces/ApiResponse";
import { updateMatchdayStat } from "@/app/services/db.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if(body.action === ApiRouteActions.UPDATE_GOALS){

      const {gameweekStatId, goalsScored} =  body.payload;

      if(gameweekStatId === null || goalsScored === null) {
        const response: ApiResponse = {
          success: false,
          error: "Invalid gameweekStatId or goalsScored"
        };
        return NextResponse.json(response, { status: 400 }); 
      }

      const dataToUpdate = { goals_scored: parseInt(goalsScored)};
      const updatedGameweekStat = updateMatchdayStat(gameweekStatId, dataToUpdate);
    
      const response: ApiResponse = {
        success: true,
        result: updatedGameweekStat
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