import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma"; 
import { findMostFrequent } from "@/app/util/frequencyCalculator";

export async function POST(req: Request) {
  try {

    const { body } = await req.json();

    if(body.action === "activateGameweek"){
      const createdGameweek = await prisma.gameweek.create(
          {data: body.payload}
      );

      return NextResponse.json({ success: true, result: createdGameweek });
    }

    else if(body.action === "closeGameweek"){

      const gameweekStats = await prisma.gameweekstat.findMany({where: {
        gameweekID: body.payload.gameweekID
      }})

      const nominatedPlayers: number[] = gameweekStats.map(gameweekStat => gameweekStat.nomineeID).filter(nominee => nominee != null);
    
      let motm: number = nominatedPlayers[0] ?? -1;  //set motm (man of the match) to -1 if no one was nominated at all

      if(nominatedPlayers.length > 1){
        motm = findMostFrequent(nominatedPlayers) ?? -1;

        const potentialOtherMotm = findMostFrequent(nominatedPlayers.filter(nominee => nominee != motm)) ?? -1;

        const motmNumVotes = nominatedPlayers.filter(nominee => nominee === motm).length
        const potentialOtherMotmNumVotes = nominatedPlayers.filter(nominee => nominee === potentialOtherMotm ).length

        if(motmNumVotes === potentialOtherMotmNumVotes){
          throw("Multiple MOTMs");
        }
      }

      if(motm != -1){

        await prisma.gameweek.update({
          where: { gameweekID: body.payload.gameweekID },
          data: {
            motm: motm,
            isactive: false
          }
        })
              
        gameweekStats.forEach(async gameweekStat => {  //assign motm 4 points
          if(gameweekStat.playerID === motm){
            gameweekStat.points = 4;

            await prisma.gameweekstat.update({
              where: { gameweekStatID: gameweekStat?.gameweekStatID},
              data: { points: 4 },
            })
          }
        })
     
        //add every player that played goals and points to total
       const transactions = gameweekStats.map((gameweekStat) =>
          prisma.player.update({
            where: { playerID: gameweekStat.playerID },
            data: { totalgoals: {increment: gameweekStat.goals_scored ?? 0},
                    totalpoints: {increment: gameweekStat.points ?? 0}
                  },
          })
        );

        await prisma.$transaction(transactions);
      }
      else{
        throw("Error occured in motm calculation")
      }
      
      return NextResponse.json({ success: true});
    }
    
  } catch (error) {
    return NextResponse.json({ success: false, error: error}, { status: 500 });
  }
}