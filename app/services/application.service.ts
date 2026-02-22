"use server"

import { Player, Matchday, MatchdayStat, PlayerSeasonStat } from "@/generated/prisma/client";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { updatePlayer, getPlayerCount, createPlayer, fetchAllPlayers, fetchAllGameweeksBySeason, fetchAllGameweekStatsBySeason, fetchAllPlayersSeasonStats, createPlayerSeasonStat } from "./db.service";
import { PlayerStatus } from "../lib/PlayerStatus";
import { GlobalAppData } from "../interfaces/GlobalAppData";


export async function DeleteSession() {

    await (await cookies()).delete('Guest');
    // await (await cookies()).delete('next-auth.callback-url');
    // // await (await cookies()).delete('next-auth.csrf-token');
    await (await cookies()).delete('next-auth.session-token');
}


export async function LinkAccounts(player: Player){

    const session = await getServerSession(authOptions);

    try{
        if(session && session.user && session.user.email){
            player.email = session.user.email;
    
            if(session.user.image) player.profile_picture = session.user.image ?? "";
    
            player.date_registered = new Date;
    
            player.status_id = PlayerStatus.Active;
    
            const updatedPlayer = await updatePlayer(player.id, player);
    
            const playerSeasonStat: Partial<PlayerSeasonStat> = {
                username: updatedPlayer.username,
                season_id: 2,
                player_id: updatedPlayer.id,
                goals: 0,
                points: 0,
                games_played: 0
            }

            await createPlayerSeasonStat(playerSeasonStat as PlayerSeasonStat);

        }
    }

    catch(err) {
        alert(err);
    }
}

export async function RegisterNewPlayer(_username: string){

    try{
        const session = await getServerSession(authOptions);
    
        const nextId: number = await getPlayerCount();
    
        if(!nextId) throw "Unexpected Error";
    
        const newPlayer: Player = 
        {  
            username: _username,
            firstname: _username,
            email: session?.user?.email ?? null,
            code: `cd${nextId+1}`, //tochange
            status_id: PlayerStatus.Inactive,
            date_registered: new Date,
            profile_picture: session?.user?.image ?? null
        } as Player
    
        const player = await createPlayer(newPlayer);

        const playerSeasonStat: Partial<PlayerSeasonStat> = {
                username: player.username,
                season_id: 2,
                player_id: player.id,
                goals: 0,
                points: 0,
                games_played: 0
            }

        await createPlayerSeasonStat(playerSeasonStat as PlayerSeasonStat);
    }
    catch(err){
        alert(err);
    }

}

export async function FetchAppData(season: number): Promise<GlobalAppData | undefined> {

    try{
        const players = await fetchAllPlayers();
        const matchdays = await fetchAllGameweeksBySeason(season);
        const matchdayStats = await fetchAllGameweekStatsBySeason(season);
        const playersSeasonStats = await fetchAllPlayersSeasonStats(season);

        return {players, matchdays, matchdayStats, playersSeasonStats};
    }

    catch{
        return undefined;
    }
}