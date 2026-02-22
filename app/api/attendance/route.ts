import { NextResponse } from "next/server";
import { createManyMatchdayStats } from "@/app/services/db.service";
import { TeamNumber } from "@/app/lib/teamNumbers";
import { ApiRouteActions } from "@/app/lib/ApiRouteActions";
import ApiResponse from "@/app/interfaces/ApiResponse";
import { MatchdayStat, Player } from "@/generated/prisma/client";
import { DummyPlayer } from "@/app/lib/DummyData";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if(body.action === ApiRouteActions.SAVE_TEAMS_ATTENDANCE){

      const {gameweekId, whiteteam, blackteam, redteam = []} = body.payload;

      console.error(body.payload);

      const blackPlayersStats = blackteam?.map((player: Player) => {
          const gameweekStat: Partial<MatchdayStat> = {matchday_id: gameweekId, season_id: 2, player_id: player.id, team: TeamNumber.Black, goals_scored: 0,  nominee_id: DummyPlayer.id, points: 1, shortlisted: false}
          return gameweekStat;
      }) ?? []

      const whitePlayersStats = whiteteam?.map((player: Player) => {
          const gameweekStat: Partial<MatchdayStat> = {matchday_id: gameweekId, season_id: 2, player_id: player.id, team: TeamNumber.White, goals_scored: 0, nominee_id: DummyPlayer.id, points: 1, shortlisted: false}
          return gameweekStat;
      }) ?? []

      const redPlayersStats = redteam?.map((player: Player) => {
          const gameweekStat: Partial<MatchdayStat> = {matchday_id: gameweekId, season_id: 2, player_id: player.id, team: TeamNumber.Red, goals_scored: 0,  nominee_id: DummyPlayer.id, points: 1, shortlisted: false}
          return gameweekStat;
      }) ?? []
      
      await createManyMatchdayStats(blackPlayersStats.concat(whitePlayersStats).concat(redPlayersStats));;
      
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