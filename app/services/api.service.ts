import { Gameweek, Player } from "@prisma/client";
import { ApiRouteActions } from "../lib/ApiRouteActions";
import { GameweekType } from "../lib/GameweekTypes";
import generateAdminCode from "../util/generateCode";
import { sendPostRequest } from "./http.service";

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
        const req = await sendPostRequest<any>("/api/gameweeks", body);
        if (req.success) {
            return req.result;
        } 
        else {
            throw("Request to activate a new gameweek failed");
        }
    } 

    catch (err) {
        alert("There was an issue with activating a new gameweek");
    }
}

export async function deleteGameweek(gameweekId: number, shouldAlert: boolean = true) {

    try {
        const body = {action: ApiRouteActions.DELETE_GAMEWEEK, payload: gameweekId};
        
        const req = await sendPostRequest<any>("/api/gameweeks", body);
        req.success? alert("Deleted gameweek successfully") : alert("Error: " + req.error);
    }

    catch (err) {
        if(shouldAlert) alert("There was an issue updating full time score");
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
        else{ //for threeteam games, put everyone on white team
            teamInfo = {gameweekId: newGameweek.gameweekID, whiteteam: threeTeamGamePlayers, blackteam: []}
        }
        
        const body = {action: ApiRouteActions.SAVE_TEAMS_ATTENDANCE, payload: teamInfo};
        const req = await sendPostRequest<any>("/api/attendance", body);
        req.success? alert("Teams saved successfully. Gameweek Activated") : alert("Error: " + req.error);
    } 

    catch (err) {

        // gameweek is created first before teams are saved, so delete the created gameweek if error occurs
        if(newGameweek) deleteGameweek(newGameweek.gameweekID, false);
        alert("There was an issue with closing the gameweek");
    }
}

export async function adminCloseGameweek(adminCodeValue: string, gameweekId: number) {

    if(adminCodeValue != adminCode){
        alert("Incorrect Code");
        return;
    }

    try {
        const body = {action: "closeGameweek", payload: gameweekId};

        const req = await sendPostRequest<any>("/api/gameweeks", body);
        req.success? alert("The gameweek was closed successfully!") : alert("Error: " + req.error);
    } 

    catch (err) {
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

            const req = await sendPostRequest<any>("/api/goals", body);
            req.success? alert("Goals updated successfully!") : alert("Error: " + req.error);
        }

        catch (err) {
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

        const req = await sendPostRequest<any>("/api/nomination", body);
    
        const nominator = req.result.player;
        const nominatorGameweekstat = req.result.playerGameweekstat;

        if(nominator){
            if(!nominatorGameweekstat){
                alert("Player with entered code cannot vote");
                return;
            }

            const nominationPair = {gameweekStatId: nominatorGameweekstat?.gameweekStatID, nomineeId: nominatedPlayerId};
            const body = {action: ApiRouteActions.PLAYER_NOMINATE, payload: nominationPair}; 
            
            const req = await sendPostRequest<any>("/api/nomination", body);
            req.success? alert("Nomination saved successfully") : alert("Error: " + req.error);
        }
        else {
            alert("Incorrect code");
        }
    }

    catch (err) {
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

        const req = await sendPostRequest<any>("/api/updatescore", body);
        req.success? alert("Full time score updated successfully!") : alert("Error: " + req.error);
    }

    catch (err) {
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
            await sendPostRequest<any>("/api/nomination", body);
        }

        const body = {action: ApiRouteActions.ADMIN_SELECT_NOMINEES, payload: {playerIds: nomineesIds, gameweekId: gameweekId}};
        const req = await sendPostRequest<any>("/api/nomination", body);

        req.success? alert("Motm shortlist successfully updated!") : alert("Error: " + req.error);
    }

    catch (err) {
        alert("There was an issue updating motm shortlist");
    }   
}