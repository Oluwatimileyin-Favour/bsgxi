import PlayerList from './playerList';
import Gameweek from './Gameweek';
import { Gameweeks, GameweekStats, PrismaClient } from "@prisma/client";
import Teamsheet from "./Teamsheet";
import GoldenBootBoard from "./GoldenBootBoard";
import BallondOrBoard from "./BallondOrBoard";

const prisma = new PrismaClient();

export default async function HomePage() {

    const players = await prisma.players.findMany();
    const gameweeks = await prisma.gameweeks.findMany();

    let lastGameweek = gameweeks.length - 1;
    let teamBlack: GameweekStats[] = []
    let teamWhite: GameweekStats[] = []

    if(lastGameweek >= 0){
        const gameweekStats = await prisma.gameweekStats.findMany({ where: { gameweekID: gameweeks[lastGameweek].gameweekID } })
 
        teamBlack = gameweekStats.filter(stat => {
            return stat.teamID === false
        })
        
        teamWhite = gameweekStats.filter(stat => {
            return stat.teamID === true
        })
    }

    const sortedByGoals = [...players].sort((a, b) => (b.totalgoals || 0) - (a.totalgoals || 0));
    const sortedByPoints = [...players].sort((a, b) => (b.totalpoints || 0) - (a.totalpoints || 0));

    return (
        <>
            { gameweeks.length > 0 &&
                <div className="flex justify-around p-10">
                    <div className="w-[600px]">
                        <h2 className="font-bold text-3xl text-rose-900 mb-2 text-center">Gameweek {lastGameweek}</h2>
                        <p className="text-center font-semibold">{gameweeks[lastGameweek].date.toDateString()}</p>
                        <p className="text-sm mt-3">🟡 Nominated for MOTM. Click on player to vote. Click on self to record goals scored</p>
                        <Teamsheet players={players} gameweek={gameweeks[lastGameweek]} teamBlack={teamBlack} teamWhite={teamWhite}></Teamsheet>
                    </div>   
                    <div className="flex space-x-4">
                        <GoldenBootBoard rankings={sortedByGoals}></GoldenBootBoard>
                        <BallondOrBoard rankings={sortedByPoints}></BallondOrBoard>
                    </div>

                </div>
                
            }

            {
                gameweeks.length === 0 &&
                <div className="flex h-[400px] w-[400px] justify-center items-center p-10">
                    <h2 className="font-bold text-4xl text-rose-900 mb-2 text-center">Season has not begun</h2>
                </div>
            }
        </>
    )
}