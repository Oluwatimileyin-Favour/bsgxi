import { Matchday } from "@/generated/prisma/client";
import Emojis from "../lib/emojis";
import { GameweekType } from "../lib/GameweekTypes";


export default function GameweekDetails({gameweek, selectedMatchdayIdx}: {gameweek: Matchday, selectedMatchdayIdx: number}) {

    return (
        <div className="flex flex-col gap-2 items-center">
            <h2 className="font-bold text-3xl text-rose-900 dark:text-rose-500">Gameweek {selectedMatchdayIdx + 1}</h2>
            {/* <Dropdown menuItems={gameweeks.map((_, index) => `Gameweek ${index + 1}`)} selectedItem={`Gameweek ${selectedGameweekIdx + 1}`} reactToSelection={updateSelectedGameweekIdx} displayTextSize="text-3xl"></Dropdown> */}
            <p className="font-semibold">{gameweek.date.toDateString()}</p>
            <p className="font-semibold">Gametype: {gameweek.gametype}</p>
            <p className="text-sm">{Emojis.motmWinnerEmoji} MOTM. {Emojis.shortlistedPlayerEmoji} Shortlisted for MOTM</p>
            {gameweek.gametype === GameweekType.Classico && <p className="text-sm">{Emojis.newbiesEmoji} Newbies {Emojis.youngbloodEmoji} Youngblood {Emojis.oldiesEmoji} Oldies</p> }
            <p className="text-sm">Click on shortlisted player to nominate for MOTM</p>
            <p className="text-sm">Click on self to record goals scored</p>
        </div>
    )
}