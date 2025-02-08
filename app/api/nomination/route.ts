import { NextResponse } from "next/server";
import { Player } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { body } = await req.json();

    if(body.action === "adminSelectNominees"){
      const playerIds = body.payload.map((nominee: Player) => nominee.playerID);
      const updatedRecords = await prisma.gameweekStat.updateMany({
        where: {
          playerID: { in: playerIds } 
        },
        data: {
          nominated: true,
          points: 2
        }
    });
    
      return NextResponse.json({ success: true, message: updatedRecords});
    }

    else if(body.action === "playerSelectNominee"){
      

      const updatedMotmNomination = await prisma.gameweekStat.update({
        where: {
          GameweekStatID: body.payload.gameweekStatId
        },
        data: {
          nomineeID: body.payload.nomineeId
        }
      });
    
      return NextResponse.json({ success: true, message: updatedMotmNomination});
    }
    
  } 
  
  catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}