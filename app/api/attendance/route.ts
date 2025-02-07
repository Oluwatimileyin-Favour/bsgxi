import { NextResponse } from "next/server";
import { Player, PrismaClient} from "@prisma/client";
import { GameweekStat } from "@/app/models/GameweekStat";

const prisma = new PrismaClient();
export const revalidate = 1;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { teamInfo } = await req.json();

    const whiteplayers = teamInfo.whiteteam.map((player: Player) => {
        const gameweekStat: GameweekStat = {gameweekID: teamInfo.gameweekID, playerID: player.playerID, teamID: true, goals_scored: 0, points: 0, nominated: false}
        return gameweekStat;
    })

    const blackplayers = teamInfo.blackteam.map((player: Player) => {
        const gameweekStat: GameweekStat = {gameweekID: teamInfo.gameweekID, playerID: player.playerID, teamID: false, goals_scored: 0, points: 0, nominated: false}
        return gameweekStat;
    })
    
    const gameweekStats = await prisma.gameweekStat.createMany({data: whiteplayers.concat(blackplayers)});
    
    return NextResponse.json({ success: true, result: gameweekStats});
  } 
  catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}