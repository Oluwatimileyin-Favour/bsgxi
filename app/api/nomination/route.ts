import { NextResponse } from "next/server";
import { Player } from "@prisma/client";
import { updateGameweekStat, updateGameweekStatsByPlayerIdAndGameweekID} from "@/app/services/db.service";

export async function POST(req: Request) {
  try {
    const { body } = await req.json();

    if(body.action === "adminSelectNominees"){
      const playerIds = body.payload.nominees.map((nominee: Player) => nominee.playerID);
      const gameweekIds: number[] = [body.payload.gameweek.gameweekID];
      const dataToUpdate = {nominated: true, points: 2};
      const updatedGameweekStats = await updateGameweekStatsByPlayerIdAndGameweekID(playerIds, gameweekIds, dataToUpdate);
    
      return NextResponse.json({ success: true, message: updatedGameweekStats});
    }

    else if(body.action === "playerSelectNominee"){
      const updatedMotmNomination = await updateGameweekStat(body.payload.gameweekStatId,  {nomineeID: body.payload.nomineeId})

      return NextResponse.json({ success: true, message: updatedMotmNomination});
    }
    
  } 
  
  catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}