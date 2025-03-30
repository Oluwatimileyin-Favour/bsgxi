import { NextResponse } from "next/server";
import { Player} from "@prisma/client";
import { GameweekStat } from "@/app/interfaces/GameweekStat";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { teamInfo } = await req.json();

    const whiteplayers = teamInfo.whiteteam.map((player: Player) => {
        const gameweekStat: GameweekStat = {gameweekID: teamInfo.gameweekID, playerID: player.playerID, team: true, goals_scored: 0, points: 1, nominated: false}
        return gameweekStat;
    })

    const blackplayers = teamInfo.blackteam.map((player: Player) => {
        const gameweekStat: GameweekStat = {gameweekID: teamInfo.gameweekID, playerID: player.playerID, team: false, goals_scored: 0, points: 1, nominated: false}
        return gameweekStat;
    })
    
    const gameweekStats = await prisma.gameweekstat.createMany({data: whiteplayers.concat(blackplayers)});
    
    return NextResponse.json({ success: true, result: gameweekStats});
  } 
  catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}