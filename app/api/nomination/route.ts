import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { body } = await req.json();

    if(body.action === "adminSelectNominees"){
      const playerids = body.nominees.map(nominee => nominee.playerID);

      const updatedRecords = await prisma.gameweekStats.updateMany({
        where: {
          playerID: { in: playerids } 
        },
        data: {
          nominated: true 
        }
    });
    
      return NextResponse.json({ success: true, message: updatedRecords});
    }

    else if(body.action === "playerSelectNominee"){
      

      const updatedMotmNomination = await prisma.gameweekStats.update({
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
    console.log(error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}