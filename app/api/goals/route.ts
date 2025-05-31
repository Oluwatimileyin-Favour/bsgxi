import { NextResponse } from "next/server";
import { updateGameweekStat } from "@/app/services/db.service";

export async function POST(req: Request) {
  try {
    const { goals } = await req.json();
    
    const dataToUpdate = { goals_scored: parseInt(goals.goalsScored)};
    const updatedGameweekStat = updateGameweekStat(goals.gameweekStatId, dataToUpdate);
  
    return NextResponse.json({ success: true, result: updatedGameweekStat});
  } 
  
  catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}