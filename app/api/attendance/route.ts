import { NextResponse } from "next/server";
import { Gameweekstat, Player} from "@prisma/client";
import { createManyGameweekStats } from "@/app/services/db.service";

export async function POST(req: Request) {
  try {
    const { teamInfo } = await req.json();

     const blackplayers = teamInfo.blackteam.map((player: Player) => {
        const gameweekStat: Partial<Gameweekstat> = {gameweekID: teamInfo.gameweekID, playerID: player.playerID, team: 0, goals_scored: 0,  nomineeID: 100, points: 1, nominated: false}
        return gameweekStat;
    }) ?? []

    const whiteplayers = teamInfo.whiteteam.map((player: Player) => {
        const gameweekStat: Partial<Gameweekstat> = {gameweekID: teamInfo.gameweekID, playerID: player.playerID, team: 1, goals_scored: 0, nomineeID: 100, points: 1, nominated: false}
        return gameweekStat;
    }) ?? []

    const redplayers = teamInfo.redteam.map((player: Player) => {
        const gameweekStat: Partial<Gameweekstat> = {gameweekID: teamInfo.gameweekID, playerID: player.playerID, team: 2, goals_scored: 0,  nomineeID: 100, points: 1, nominated: false}
        return gameweekStat;
    }) ?? []
    
    const gameweekStats = await createManyGameweekStats(blackplayers.concat(whiteplayers).concat(redplayers));
    
    return NextResponse.json({success: true, result: gameweekStats});
  } 
  catch (error) {
    return NextResponse.json({success: false, error: error}, { status: 500 });
  }
}