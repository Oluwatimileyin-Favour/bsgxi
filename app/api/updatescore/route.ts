import { NextResponse } from "next/server";
import ApiResponse from "@/app/interfaces/ApiResponse";
import { Matchday } from "@/generated/prisma/client";
import { updateMatchday } from "@/app/services/db.service";

export async function POST(req: Request) {
  try {
    const {gameweekId, whitescore, blackscore}  = await req.json();

    const dataToUpdate: Partial<Matchday> = {whitescore, blackscore};
    
    const updatedGameweek: Matchday = await updateMatchday(gameweekId, dataToUpdate);
   
    const response: ApiResponse = {
      success: true,
      result: updatedGameweek
    };
    return NextResponse.json(response);
  } 
  
  catch (err: unknown) {
    const response: ApiResponse = {
      success: false,
      error: String(err)
    };
    return NextResponse.json(response, { status: 500 });
  }
}