import { ApiRouteActions } from "@/app/lib/ApiRouteActions";
import { findGameweekStatsByPlayerIdAndGameweekId, findPlayerByCode, updateGameweekStat, updateGameweekStatsByPlayerIdsAndGameweekID } from "@/app/services/db.service";
import { Gameweekstat, Player } from "@prisma/client";
import { NextResponse } from "next/server";
import ApiResponse from "@/app/interfaces/ApiResponse";

export async function POST(req: Request) {
  try { 
    const body  = await req.json();

    if(body.action === ApiRouteActions.ADMIN_SELECT_NOMINEES){
      const {playerIds, gameweekId} = body.payload;
      const dataToUpdate: Partial<Gameweekstat> = {shortlisted: true, points: 2};

      if(gameweekId === null || playerIds === null) {
        const response: ApiResponse = {
          success: false,
          error: "Invalid gameweekId or playerIds"
        };
        return NextResponse.json(response, { status: 400 }); 
      }
      
      const res = await updateGameweekStatsByPlayerIdsAndGameweekID(playerIds, gameweekId, dataToUpdate);
    
      const response: ApiResponse = {
        success: true,
        result: `${res.count} nominees updated successfully`
      };
      return NextResponse.json(response);
    }

    else if(body.action === ApiRouteActions.PLAYER_NOMINATE){
      const {gameweekStatId, nomineeId} = body.payload;

      if(gameweekStatId === null || nomineeId === null) {
        const response: ApiResponse = {
          success: false,
          error: "Invalid gameweekStatId or nomineeId"
        };
        return NextResponse.json(response, { status: 400 }); 
      }

      const dataToUpdate: Partial<Gameweekstat> = {nomineeID: nomineeId};

      const updatedGameweekStat = await updateGameweekStat(gameweekStatId,  dataToUpdate)

      const response: ApiResponse = {
        success: true,
        result: updatedGameweekStat
      };
      return NextResponse.json(response);
    }

    else if(body.action === ApiRouteActions.GET_PLAYER_AND_GAMEWEEKSTAT){
      const { playerCode, gameweekId } = body.payload;

      if(playerCode === null || gameweekId === null) {
        const response: ApiResponse = {
          success: false,
          error: "Invalid player code or gameweek ID"
        };
        return NextResponse.json(response, { status: 400 }); 
      }

      const player: Player | null = await findPlayerByCode(playerCode);

      if(!player) {
        const response: ApiResponse = {
          success: false,
          error: "Player not found"
        };
        return NextResponse.json(response, { status: 404 }); 
      }

      const playerGameweekstat: Gameweekstat | null = await findGameweekStatsByPlayerIdAndGameweekId(player.playerID, gameweekId); 

      if (playerGameweekstat) {
        const response: ApiResponse = {
          success: true,
          result: {player, playerGameweekstat}
        };
        return NextResponse.json(response);
      }
      else {
        const response: ApiResponse = {
          success: false,
          error: "Error fetching player and their gameweekstat"
        };
        return NextResponse.json(response, { status: 404 }); 
      }
    }

    else if(body.action === ApiRouteActions.REMOVE_NOMINEES){
      const playerIds: number[] = body.payload.playerIds;
      const gameweekId: number = body.payload.gameweekId;
      const dataToUpdate: Partial<Gameweekstat> = {shortlisted: false, points: 1};

      const updatedGameweekStats = await updateGameweekStatsByPlayerIdsAndGameweekID(playerIds, gameweekId, dataToUpdate);

      const response: ApiResponse = {
        success: true,
        result: updatedGameweekStats
      };
      return NextResponse.json(response);
    }
  } 
  
  catch (err: unknown) {
    const response: ApiResponse = {
      success: false,
      error: String(err)
    };
    return NextResponse.json(response, { status: 500 });
  }
}