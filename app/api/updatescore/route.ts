import { NextResponse } from "next/server";
import { updateGameweek } from "@/app/services/db.service";
import { Gameweek } from "@prisma/client";
import ApiResponse from "@/app/interfaces/ApiResponse";

export async function POST(req: Request) {
  try {
    const {gameweekId, whitescore, blackscore}  = await req.json();

    const dataToUpdate: Partial<Gameweek> = {whitescore, blackscore};
    
    const updatedGameweek: Gameweek = await updateGameweek(gameweekId, dataToUpdate);
   
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