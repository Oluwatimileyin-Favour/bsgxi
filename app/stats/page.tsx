import GoldenBootBoard from "./GoldenBootBoard"
import BallondOrBoard from "./BallondOrBoard"
import { prisma } from "../lib/prisma";

export const dynamic = 'force-dynamic';

export default async function StatsPage(){

    const players = await prisma.player.findMany();

    const sortedPlayersByGoals = [...players].sort((a, b) => (b.totalgoals || 0) - (a.totalgoals || 0));
    const sortedPlayersByPoints = [...players].sort((a, b) => (b.totalpoints || 0) - (a.totalpoints || 0));

    return (
        <div className="flex flex-col p-5 justify-around items-center gap-3 md:flex-row md:justify-center h-[100%]">
            <BallondOrBoard rankings={sortedPlayersByPoints}></BallondOrBoard>
            <GoldenBootBoard rankings={sortedPlayersByGoals}></GoldenBootBoard>  
        </div>
    )
}