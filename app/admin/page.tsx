import { Player } from '@prisma/client';
import ActivateGameweek from "./ActivateGameweek";
import ManageGameweek from './ManageGameweek';
import { fetchAllPlayers, fetchAllGameweeks, findGameweekStatsByGameweekID } from '../services/db.service';

export const dynamic = 'force-dynamic';

export default async function page(){

    const players = await fetchAllPlayers();
    const gameweeks = await fetchAllGameweeks();

    let lastGameweek: number = 0;
    let lastGameweekIsActive: boolean = false;
    let gameweekPlayers: Player[] = [];
    let nomineeList: Player[] = [];
    let motmNomineesIDs: Set<number> = new Set();
    
    if(gameweeks.length > 0){
        lastGameweek = gameweeks.length - 1;
        lastGameweekIsActive = gameweeks[lastGameweek].isactive;

        const gameweekStats = await findGameweekStatsByGameweekID(gameweeks[lastGameweek].gameweekID);

        const gameweekPlayersIds = gameweekStats.map(gameweekStat => gameweekStat.playerID);
        gameweekPlayers = players.filter(player => gameweekPlayersIds.includes(player.playerID));

        const motmNomineesStats = gameweekStats.filter(gameweekStats => gameweekStats.shortlisted === true);
        motmNomineesIDs = new Set(motmNomineesStats.map(nominee => nominee.playerID));
        nomineeList = gameweekPlayers.filter(player => motmNomineesIDs.has(player.playerID));
    }

    return (
        <div className='flex flex-col justify-center items-center min-h-[100%]'>
            {
                lastGameweekIsActive ?  
                    <ManageGameweek 
                        gameweekPlayerList={gameweekPlayers.filter(player => !motmNomineesIDs.has(player.playerID))} 
                        gameweek={gameweeks[lastGameweek]} 
                        nomineeList={nomineeList}
                    />
                :
                    <ActivateGameweek playerList={players} nextGameweek={gameweeks.length}/>
            }
        </div>
       
    )
}