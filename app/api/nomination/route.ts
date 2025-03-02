import { NextResponse } from "next/server";
import { Player } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { body } = await req.json();

    if(body.action === "adminSelectNominees"){
      const playerIds = body.payload.nominees.map((nominee: Player) => nominee.playerID);
      const updatedRecords = await prisma.gameweekstat.updateMany({
        where: {
          playerID: { in: playerIds },
          gameweekID: body.payload.gameweek.gameweekID
        },
        data: {
          nominated: true,
          points: 2
        }
    });
    
      return NextResponse.json({ success: true, message: updatedRecords});
    }

    else if(body.action === "playerSelectNominee"){
      

      const updatedMotmNomination = await prisma.gameweekstat.update({
        where: {
          gameweekStatID: body.payload.gameweekStatId
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