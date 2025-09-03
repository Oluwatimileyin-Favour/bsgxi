import { Gameweek, Player } from "@prisma/client";
import generateAdminCode from "../util/generateCode";
import { GameweekType } from "../lib/GameweekTypes";

const adminCode =  generateAdminCode();

async function activateGameweek(date: string, nextGameweek: number, gameType: GameweekType){

    if(date && date === ""){
        alert("Select Date");
        return;
    }

    const gameWeekDate = new Date(date);

    if(!gameWeekDate){
        alert("Invalid Date");
        return;
    }

    const gameweek: Gameweek = {
        gameweekID: nextGameweek,
        date: gameWeekDate,
        isactive: true,
        gametype: gameType,
        whitescore: 0,
        blackscore: 0,
        motm: null
    }
        
    const body = {action: "activateGameweek", payload: gameweek}
    try {
        const response = await fetch("/api/gameweeks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ body}),
        });
    
        const data = await response.json();
        if (data.success) {
            return data
        } 
        else {
            throw(data.error)
        }
    } 
    catch (error) {
        alert("Request failed: " + error);
    }
}

export async function saveTeamSheets(adminCodeValue: string, date: string, nextGameweek: number, gameType: GameweekType, teamBlack: Player[], teamWhite: Player[], teamRed: Player[], threeTeamGamePlayers: Player[]) { 

    if(adminCodeValue != adminCode){
        alert("Incorrect Code");
        return;
    }

    const gameweekInfo = await activateGameweek(date, nextGameweek, gameType);
    
    if(!gameweekInfo){
        alert("Error saving teams");
        return;
    }

    let teamInfo = {};

    if(gameType === GameweekType.Regular){
        teamInfo = {gameweekID: gameweekInfo.result.gameweekID, whiteteam: teamWhite, blackteam: teamBlack};
    }
    else if(gameType === GameweekType.Classico){
        teamInfo = {gameweekID: gameweekInfo.result.gameweekID, whiteteam: teamWhite, blackteam: teamBlack, redteam: teamRed};
    }
    else{ //for threeteam games, put everyone on white team
        teamInfo = {gameweekID: gameweekInfo.result.gameweekID, whiteteam: threeTeamGamePlayers, blackteam: []}
    }
    
    try {
        const response = await fetch("/api/attendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({teamInfo}),
        });
    
        const data = await response.json();
        if (data.success) {
            alert("Teams saved successfully. Gameweek Activated"); 
            window.location.reload();
        } 
        else {
            alert("Error: " + data.error);
        }
    } 
    catch (error) {
        alert("Request failed: " + error);
    }
}