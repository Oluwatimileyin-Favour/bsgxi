import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { goals } = await req.json();
    
    const updatedGameweekStat = await prisma.gameweekstat.update({
        where: { gameweekStatID: goals.gameweekStatId}, 
        data: { goals_scored: parseInt(goals.goalsScored)},
      });
  
    return NextResponse.json({ success: true, result: updatedGameweekStat});
  } 
  
  catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}