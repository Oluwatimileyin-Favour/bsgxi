import { NextResponse } from "next/server";
import { Gameweekstat, Player} from "@prisma/client";
import { createManyGameweekStats } from "@/app/services/db.service";
import { TeamNumber } from "@/app/lib/teamNumbers";
import { ApiRouteActions } from "@/app/lib/ApiRouteActions";
import ApiResponse from "@/app/interfaces/ApiResponse";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if(body.action === ApiRouteActions.SAVE_TEAMS_ATTENDANCE){

      const {gameweekId, whiteteam, blackteam, redteam = []} = body.payload;

      const blackPlayersStats = blackteam?.map((player: Player) => {
          const gameweekStat: Partial<Gameweekstat> = {gameweekID: gameweekId, playerID: player.playerID, team: TeamNumber.Black, goals_scored: 0,  nomineeID: 100, points: 1, shortlisted: false}
          return gameweekStat;
      }) ?? []

      const whitePlayersStats = whiteteam?.map((player: Player) => {
          const gameweekStat: Partial<Gameweekstat> = {gameweekID: gameweekId, playerID: player.playerID, team: TeamNumber.White, goals_scored: 0, nomineeID: 100, points: 1, shortlisted: false}
          return gameweekStat;
      }) ?? []

      const redPlayersStats = redteam?.map((player: Player) => {
          const gameweekStat: Partial<Gameweekstat> = {gameweekID: gameweekId, playerID: player.playerID, team: TeamNumber.Red, goals_scored: 0,  nomineeID: 100, points: 1, shortlisted: false}
          return gameweekStat;
      }) ?? []
      
      await createManyGameweekStats(blackPlayersStats.concat(whitePlayersStats).concat(redPlayersStats));;
      
      const response: ApiResponse = {success: true};
      return NextResponse.json(response, {status: 200});
    }
  } 
  catch (err: unknown) {

    console.error(err);
    return NextResponse.json(
      {
        success: false,
        error: err,
      },
      { status: 500 }
    );
  }
}