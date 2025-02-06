import { NextResponse } from "next/server";
import { GameweekStats, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { teamInfo } = await req.json();

    const whiteplayers = teamInfo.whiteteam.map(player => {
        const gameweekStat: GameweekStats = {gameweekID: teamInfo.gameweekID, playerID: player.playerID, teamID: true, goals_scored: 0, points: 0, nominated: false}
        return gameweekStat;
    })

    const blackplayers = teamInfo.blackteam.map(player => {
        const gameweekStat: GameweekStats = {gameweekID: teamInfo.gameweekID, playerID: player.playerID, teamID: false, goals_scored: 0, points: 0, nominated: false}
        return gameweekStat;
    })
    
    const gameweekStats = await prisma.gameweekStats.createMany({data: whiteplayers.concat(blackplayers)});
    
    return NextResponse.json({ success: true, result: gameweekStats});
  } 
  catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}