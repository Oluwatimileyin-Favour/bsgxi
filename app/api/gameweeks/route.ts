import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma"; 
import { findMostFrequent } from "@/app/util/frequencyCalculator";

export const revalidate = 1;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {

    const { body } = await req.json();

    if(body.action === "activateGameweek"){
      const createdGameweek = await prisma.gameweek.create(
          {data: body.payload.gameweek}
      );

      return NextResponse.json({ success: true, result: createdGameweek });
    }

    else if(body.action === "closeGameweek"){

      const gameweekStats = await prisma.gameweekStat.findMany({where: {
        gameweekID: body.payload.gameweekID
      }})

      let nominees = gameweekStats.map(gameweekStat => gameweekStat.nomineeID);
      nominees = nominees.filter(nominee => nominee != null)

      const goalsTransactions = gameweekStats.map((gameweekStat) =>
        prisma.player.update({
          where: { playerID: gameweekStat.playerID },
          data: { totalgoals: {increment: gameweekStat.goals_scored ?? 0} },
        })
      );

      await prisma.$transaction(goalsTransactions);

      const pointsTransactions = gameweekStats.map((gameweekStat) =>
        prisma.player.update({
          where: { playerID: gameweekStat.playerID },
          data: { totalpoints: {increment: gameweekStat.points ?? 0} },
        })
      );

      await prisma.$transaction(pointsTransactions);
      
      const motm = findMostFrequent(nominees);

      if(motm){
          await prisma.gameweek.update({
            where: { gameweekID: body.payload.gameweekID },
            data: {motm: motm}
          })

          const nomineeSet = [...new Set(nominees)]
          
          nomineeSet.map(async (nominee) => {
            const gameweekStatId = gameweekStats.find(gameweekStat => gameweekStat.playerID == nominee)
            if(nominee != motm){
              await prisma.gameweekStat.update({
                where: { GameweekStatID: gameweekStatId?.GameweekStatID },
                data: { points: 1 },
              })
            }
            else{
              await prisma.gameweekStat.update({
                where: { GameweekStatID: gameweekStatId?.GameweekStatID },
                data: { points: 3 },
              })
            }
        });

        await prisma.gameweek.update({
          where: { gameweekID: body.payload.gameweekID },
          data: {isactive: false}
        })
      }
      return NextResponse.json({ success: true});
    }
    
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}