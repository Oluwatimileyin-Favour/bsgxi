'use client'

import ActivateGameweek from "./ActivateGameweek";
import ManageGameweek from './ManageGameweek';
import { useContext } from 'react';
import { GlobalAppDataContext } from '../context/GlobalAppDataContext';
import { MatchdayStat, Player } from "@/generated/prisma/client";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function page(){

    //TODO
    //move everything under line 26 into the relevant component and do not pass props

    // can centralize blocking non-admin from seeing the page at all here

    const {players, playersSeasonStats, matchdays, matchdayStats, loggedInPlayer} = useContext(GlobalAppDataContext);

    let lastGameweek: number = 0;
    let lastGameweekIsActive: boolean = false;
    let gameweekPlayers: Player[] = [];
    let nomineeList: Player[] = [];
    let motmNomineesIDs: Set<number> = new Set();
    
    if(matchdays.length > 0){
        lastGameweek = matchdays.length - 1;
        lastGameweekIsActive = matchdays[lastGameweek].isactive;

        const gameweekStats : MatchdayStat[] = matchdayStats.filter(stat => stat.matchday_id === matchdays[lastGameweek].id);

        const gameweekPlayersIds = gameweekStats.map((stat: MatchdayStat) => stat.player_id);
        gameweekPlayers = players.filter(player => gameweekPlayersIds.includes(player.id));

        const motmNomineesStats = gameweekStats.filter(stat => stat.shortlisted);
        motmNomineesIDs = new Set(motmNomineesStats.map(nomineeStat => nomineeStat.player_id));
        nomineeList = gameweekPlayers.filter(player => motmNomineesIDs.has(player.id));
    }

    return (
        <div className='flex flex-col justify-center items-center min-h-[100%]'>

            {
                loggedInPlayer?.is_admin &&
                <button className="px-4 py-2 rounded-2xl bg-rose-900 text-white hover:bg-rose-400 transition shadow-md h-10">
                    <Link href={'/admin/players'}>
                        Manage Players
                    </Link>
                </button>
            }           
            
            {
                lastGameweekIsActive ?  
                    <ManageGameweek 
                        gameweekPlayerList={gameweekPlayers.filter(player => !motmNomineesIDs.has(player.id))} 
                        gameweek={matchdays[lastGameweek]} 
                        nomineeList={nomineeList}
                    />
                :
                    <ActivateGameweek playerList={playersSeasonStats}/>
            }
        </div>
       
    )
}