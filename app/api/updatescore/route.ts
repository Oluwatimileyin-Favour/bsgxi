import { NextResponse } from "next/server";
import { updateGameweek } from "@/app/services/db.service";

export async function POST(req: Request) {
  try {
    const { scores } = await req.json();

    const dataToUpdate = {whitescore: parseInt(scores.whitescore), blackscore: parseInt(scores.blackscore)};
    const updatedGameweek = await updateGameweek(scores.currentGameweek.gameweekID, dataToUpdate);
   
    return NextResponse.json({ success: true, result: updatedGameweek});
  } 
  
  catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}