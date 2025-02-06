import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { goals } = await req.json();
    
    const updatedGameweekStat = await prisma.gameweekStats.update({
        where: { GameweekStatID: goals.gameweekStatId}, 
        data: { goals_scored: parseInt(goals.goalsScored)},
      });
  
    return NextResponse.json({ success: true, result: updatedGameweekStat});
  } 
  
  catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}