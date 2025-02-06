import { Players, PrismaClient } from '@prisma/client';
import ActivateGameweek from "./ActivateGameweek";
import ManageGameweek from './ManageGameweek';

const prisma = new PrismaClient();

export default async function page(){

    const allplayers = await prisma.players.findMany();
    const gameweeks = await prisma.gameweeks.findMany();

    let lastGameweek = 0;
    let lastGameweekIsActive = false;
    let gameweekPlayers:Players = [];
    let nomineeList: Players = [];
    let nominatedPlayers = false;
    
    if(gameweeks.length > 0){
        lastGameweek = gameweeks.length - 1;
        lastGameweekIsActive = gameweeks[lastGameweek].isactive;

        const gameweekStats = await prisma.gameweekStats.findMany({ where: { gameweekID: gameweeks[lastGameweek].gameweekID } })
        const gameweekPlayersIds = gameweekStats.map(gameweekStat => gameweekStat.playerID);
    
        gameweekPlayers = allplayers.filter(player => gameweekPlayersIds.includes(player.playerID));

        const nominees = gameweekStats.filter(gameweekStats => gameweekStats.nominated === true);
        const nomineesIDs = [...new Set(nominees.map(nominee => nominee.playerID))]
        nomineeList = gameweekPlayers.filter(player => nomineesIDs.includes(player.playerID));
        if(nomineeList.length > 0){
            nominatedPlayers = true;
        }
    }

    return (
        <div className="flex justify-around">
            {
                !lastGameweekIsActive &&
                <ActivateGameweek playerList={allplayers} nextGameweek={gameweeks.length}></ActivateGameweek>
            }
           
            {
                lastGameweekIsActive &&
                <ManageGameweek gameweekPlayerList={gameweekPlayers} gameweek={gameweeks[lastGameweek]} nomineeList={nomineeList} nominatedPlayers={nominatedPlayers}></ManageGameweek>
            }
        </div>
       
    )
}