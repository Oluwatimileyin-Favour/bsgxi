import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { scores } = await req.json();

    const updatedGameweek = await prisma.gameweeks.update({
        where: { gameweekID: scores.currentGameweek.gameweekID }, 
        data: { whitescore: parseInt(scores.whitescore),
            blackscore: parseInt(scores.blackscore)
         },
      });
   

    return NextResponse.json({ success: true, result: updatedGameweek});
  } 
  
  catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}