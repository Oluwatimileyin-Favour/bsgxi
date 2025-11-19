import { Gameweek, Player } from "@prisma/client";
import { ApiRouteActions } from "../lib/ApiRouteActions";
import { GameweekType } from "../lib/GameweekTypes";
import generateAdminCode from "../util/generateCode";
import { sendPostRequest } from "./http.service";
import ApiResponse from "../interfaces/ApiResponse";

const adminCode =  generateAdminCode();

//TODO
//Show specific error for multiple MOTM

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
    
    try {
        const body = {action: ApiRouteActions.ACTIVATE_GAMEWEEK, payload: gameweek}
        const res = await sendPostRequest("/api/gameweeks", body);
        if (res.success) {
            return res.result;
        } 
        else {
            throw("resuest to activate a new gameweek failed");
        }
    } 

    catch {
        alert("There was an issue with activating a new gameweek");
    }
}

export async function adminDeleteGameweek(adminCodeValue: string, gameweekId: number, shouldAlert: boolean = true) {
    if(adminCodeValue != adminCode){
        alert("Incorrect Code");
        return;
    }

    try {
        const body = {action: ApiRouteActions.DELETE_GAMEWEEK, payload: gameweekId};
        
        const res = await sendPostRequest("/api/gameweeks", body);
        if (res.success) {
            alert("Deleted gameweek successfully");
        } else {
            alert("Error: " + res.error);
        }
    }

    catch{
        if(shouldAlert) alert("There was an issue deleting the gameweek");
    }   
}

export async function saveTeamSheets(adminCodeValue: string, date: string, nextGameweek: number, gameType: GameweekType, teamBlack: Player[], teamWhite: Player[], teamRed: Player[], threeTeamGamePlayers: Player[]) { 

    if(adminCodeValue != adminCode){
        alert("Incorrect Code");
        return;
    }

    const newGameweek = await activateGameweek(date, nextGameweek, gameType);
    
    if(!newGameweek){
        alert("Error saving teams");
        return;
    }
    
    try {
        let teamInfo = {};

        if(gameType === GameweekType.Regular){
            teamInfo = {gameweekId: newGameweek.gameweekID, whiteteam: teamWhite, blackteam: teamBlack};
        }
        else if(gameType === GameweekType.Classico){
            teamInfo = {gameweekId: newGameweek.gameweekID, whiteteam: teamWhite, blackteam: teamBlack, redteam: teamRed};
        }
        else if(gameType === GameweekType.ThreeTeam){ //for threeteam games, put everyone on white team
            teamInfo = {gameweekId: newGameweek.gameweekID, whiteteam: threeTeamGamePlayers, blackteam: []}
        }
        
        const body = {action: ApiRouteActions.SAVE_TEAMS_ATTENDANCE, payload: teamInfo};
        const res: ApiResponse = await sendPostRequest("/api/attendance", body);

        if (res.success) {
            alert("Teams saved successfully. Gameweek Activated");
        } else {
            alert("Error: " + res.error);
        }
    } 

    catch {

        // gameweek is created first before teams are saved, so delete the created gameweek if error occurs
        if(newGameweek) adminDeleteGameweek(generateAdminCode(), newGameweek.gameweekID, true);
        alert("There was an issue with creating a new gameweek");
    }
}

export async function adminCloseGameweek(adminCodeValue: string, gameweekId: number) {

    if(adminCodeValue != adminCode){
        alert("Incorrect Code");
        return;
    }

    try {
        const body = {action: ApiRouteActions.CLOSE_GAMEWEEK, payload: gameweekId};

        const res = await sendPostRequest("/api/gameweeks", body);
        if (res.success) {
            alert("The gameweek was closed successfully!");
        } else {
            alert("Error: " + res.error);
        }
    } 

    catch {
        alert("There was an issue with closing the gameweek");
    } 
}

export async function updatePlayerGoals(enteredCode: string, goalsEntered: number, actualPlayerCode: string, gameweekStatId: number) {

    if(actualPlayerCode === null || actualPlayerCode === undefined || actualPlayerCode === ""){
        alert("Player code not found or invalid. Cannot update goals.");
        return;
    }

    if(enteredCode === actualPlayerCode || enteredCode === generateAdminCode()){    
        try {
            const goals = {gameweekStatId: gameweekStatId, goalsScored: goalsEntered};

            const body = {action: ApiRouteActions.UPDATE_GOALS, payload: goals}; 

            const res = await sendPostRequest("/api/goals", body);
            if (res.success) {
                alert("Goals updated successfully!");
            } else {
                alert("Error: " + res.error);
            }
        }

        catch {
            alert("There was an issue updating your goals");
        }           
    }
    else {
        alert("Incorrect code. Please try again.");
    }
}

export async function updatePlayerMotmNomination(playerCode: string, nominatedPlayerId: number, gameweekId: number) {
    try{
        const body = {action: ApiRouteActions.GET_PLAYER_AND_GAMEWEEKSTAT, payload:  {playerCode, gameweekId}};

        const res = await sendPostRequest("/api/nomination", body);
    
        const nominator = res.result.player;
        const nominatorGameweekstat = res.result.playerGameweekstat;

        if(nominator){
            if(!nominatorGameweekstat){
                alert("Player with entered code cannot vote");
                return;
            }

            const nominationPair = {gameweekStatId: nominatorGameweekstat?.gameweekStatID, nomineeId: nominatedPlayerId};
            const body = {action: ApiRouteActions.PLAYER_NOMINATE, payload: nominationPair}; 
            
            const res = await sendPostRequest("/api/nomination", body);
            if (res.success) {
                alert("Nomination saved successfully");
            } else {
                alert("Error: " + res.error);
            }
        }
        else {
            alert("Incorrect code");
        }
    }

    catch {
        alert("There was an issue updating your motm nomination");
    }  
}

export async function updateFullTimeScore(adminCodeValue: string, gameweekId: number, whitescore: number, blackscore: number) {

    if(adminCodeValue != adminCode){
        alert("Incorrect Code");
        return;
    }
    
    try {
        const body = {gameweekId, whitescore, blackscore};

        const res = await sendPostRequest("/api/updatescore", body);
        if (res.success) {
            alert("Full time score updated successfully!");
        } else {
            alert("Error: " + res.error);
        }
    }

    catch {
        alert("There was an issue updating full time score");
    }   
}

export async function updateMotmShortlist(adminCodeValue: string, removedNomineesIds: number[], nomineesIds: number[], gameweekId: number) {


    if(adminCodeValue != adminCode){
        alert("Incorrect Code");
        return;
    }

    try{
        if(removedNomineesIds.length > 0) {
            const body = {action: ApiRouteActions.REMOVE_NOMINEES, payload: {playerIds: removedNomineesIds, gameweekId: gameweekId}}
            await sendPostRequest("/api/nomination", body);
        }

        const body = {action: ApiRouteActions.ADMIN_SELECT_NOMINEES, payload: {playerIds: nomineesIds, gameweekId: gameweekId}};
        const res = await sendPostRequest("/api/nomination", body);

        if (res.success) {
            alert("Motm shortlist successfully updated!");
        } else {
            alert("Error: " + res.error);
        }
    }

    catch {
        alert("There was an issue updating motm shortlist");
    }   
}