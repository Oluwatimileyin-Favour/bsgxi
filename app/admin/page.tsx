import { Player } from '@prisma/client';
import ActivateGameweek from "./ActivateGameweek";
import ManageGameweek from './ManageGameweek';
import { prisma } from '../lib/prisma';

export const dynamic = 'force-dynamic';

export default async function page(){

    const allplayers = await prisma.player.findMany();
    const gameweeks = await prisma.gameweek.findMany();

    let lastGameweek: number = 0;
    let lastGameweekIsActive: boolean = false;
    let gameweekPlayers: Player[] = [];
    let nomineeList: Player[] = [];
    let haveNominatedPlayers: boolean = false;
    
    if(gameweeks.length > 0){
        lastGameweek = gameweeks.length - 1;
        lastGameweekIsActive = gameweeks[lastGameweek].isactive;

        const gameweekStats = await prisma.gameweekstat.findMany({ where: { gameweekID: gameweeks[lastGameweek].gameweekID } })
        const gameweekPlayersIds = gameweekStats.map(gameweekStat => gameweekStat.playerID);
    
        gameweekPlayers = allplayers.filter(player => gameweekPlayersIds.includes(player.playerID));

        const nominees = gameweekStats.filter(gameweekStats => gameweekStats.nominated === true);
        const nomineesIDs = [...new Set(nominees.map(nominee => nominee.playerID))]
        nomineeList = gameweekPlayers.filter(player => nomineesIDs.includes(player.playerID));
        if(nomineeList.length > 0){
            haveNominatedPlayers = true;
        }
    }

    return (
        <div className='flex justify-center items-center min-h-[100%]'>
            {
                lastGameweekIsActive ?  
                    <ManageGameweek gameweekPlayerList={gameweekPlayers} gameweek={gameweeks[lastGameweek]} nomineeList={nomineeList} haveNominatedPlayers={haveNominatedPlayers}></ManageGameweek>
                :
                    <ActivateGameweek playerList={allplayers} nextGameweek={gameweeks.length}></ActivateGameweek>
            }
        </div>
       
    )
}