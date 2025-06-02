import { classicos } from "@prisma/client";
import { ClassicoTableRowData } from "../interfaces/classicoTableRowData";

export function GenerateClassicoTableData(classicos: classicos[]): ClassicoTableRowData[] {

    //TODO
    //can this be cleaned up

    const newbiesStats: ClassicoTableRowData = {name: "Newbies", games: 0, pts: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0};
    const youngbloodStats: ClassicoTableRowData = {name: "Youngblood", games: 0, pts: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0};
    const oldiesStats: ClassicoTableRowData = {name: "Oldies", games: 0, pts: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0};

    classicos.forEach((classico) => {
        if(classico.newbies_goals !== -1){
            newbiesStats.games += 1;
            newbiesStats.goalsFor += classico.newbies_goals ?? 0;
            
            if(classico.oldies_goals != -1){
                newbiesStats.goalsAgainst += classico.oldies_goals ?? 0;

                if((classico.newbies_goals ?? 0) > (classico.oldies_goals ?? 0)){
                    newbiesStats.pts += 3; 
                    newbiesStats.wins += 1;
                }
                else if((classico.newbies_goals ?? 0) === (classico.oldies_goals ?? 0)){
                    newbiesStats.pts += 1; 
                    newbiesStats.draws += 1;
                }
                else{
                    newbiesStats.losses += 1;
                }
            }

            else if(classico.youngblood_goals != -1){
                newbiesStats.goalsAgainst += classico.youngblood_goals ?? 0;

                if((classico.newbies_goals ?? 0) > (classico.youngblood_goals ?? 0)){
                    newbiesStats.pts += 3; 
                    newbiesStats.wins += 1;
                }
                else if((classico.newbies_goals ?? 0) === (classico.youngblood_goals ?? 0)){
                    newbiesStats.pts += 1; 
                    newbiesStats.draws += 1;
                }
                 else{
                    newbiesStats.losses += 1;
                }
            }
        }

        if(classico.youngblood_goals !== -1){
            youngbloodStats.games += 1;
            youngbloodStats.goalsFor += classico.youngblood_goals ?? 0;
            
            if(classico.oldies_goals != -1){
                youngbloodStats.goalsAgainst += classico.oldies_goals ?? 0;

                if((classico.youngblood_goals ?? 0) > (classico.oldies_goals ?? 0)){
                    youngbloodStats.pts += 3; 
                    youngbloodStats.wins += 1;
                }
                else if((classico.youngblood_goals ?? 0) === (classico.oldies_goals ?? 0)){
                    youngbloodStats.pts += 1; 
                    youngbloodStats.draws += 1;
                }
                else{
                    youngbloodStats.losses += 1;
                }
            }

            else if(classico.newbies_goals != -1){
                youngbloodStats.goalsAgainst += classico.newbies_goals ?? 0;

                if((classico.youngblood_goals ?? 0) > (classico.newbies_goals ?? 0)){
                    youngbloodStats.pts += 3; 
                    youngbloodStats.wins += 1;
                }
                else if((classico.youngblood_goals ?? 0) === (classico.newbies_goals ?? 0)){
                    youngbloodStats.pts += 1; 
                    youngbloodStats.draws += 1;
                }
                 else{
                    youngbloodStats.losses += 1;
                }
            }
        }


        if(classico.oldies_goals !== -1){
            oldiesStats.games += 1;
            oldiesStats.goalsFor += classico.oldies_goals ?? 0;
            
            if(classico.youngblood_goals != -1){
                oldiesStats.goalsAgainst += classico.youngblood_goals ?? 0;

                if((classico.oldies_goals ?? 0) > (classico.youngblood_goals ?? 0)){
                    oldiesStats.pts += 3; 
                    oldiesStats.wins += 1;
                }
                else if((classico.oldies_goals ?? 0) === (classico.youngblood_goals ?? 0)){
                    oldiesStats.pts += 1; 
                    oldiesStats.draws += 1;
                }
                else{
                    oldiesStats.losses += 1;
                }
            }

            else if(classico.newbies_goals != -1){
                oldiesStats.goalsAgainst += classico.newbies_goals ?? 0;

                if((classico.oldies_goals ?? 0) > (classico.newbies_goals ?? 0)){
                    oldiesStats.pts += 3; 
                    oldiesStats.wins += 1;
                }
                else if((classico.oldies_goals ?? 0) === (classico.newbies_goals ?? 0)){
                    oldiesStats.pts += 1; 
                    oldiesStats.draws += 1;
                }
                else{
                    oldiesStats.losses += 1;
                }
            }
        }
    })

    return [newbiesStats, youngbloodStats, oldiesStats].sort((a, b) => b.pts - a.pts);
}