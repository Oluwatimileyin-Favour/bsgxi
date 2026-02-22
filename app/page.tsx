'use client'

import { useContext, useEffect, useState } from "react";
import { GlobalAppDataContext} from "./context/GlobalAppDataContext";
import GameweekDetails from "./home/GameweekDetails";
import PotmLeaderboard from "./home/PotmLeaderboard";
import Teamsheet from "./home/Teamsheet";
import Emojis from "./lib/emojis";
import Pager from "./ui/Pager";
import GreetUser from "./home/GreetUser";

export default function App() {

    const {matchdays} = useContext(GlobalAppDataContext);
    
    const lastGameweekIdx: number = matchdays.length - 1;
    const seasonHasBegun: boolean = lastGameweekIdx >= 0;

    //gameweek (index) selected by user on pager
    const [selectedGameweekIdx, updateSelectedGameweekIdx] = useState(lastGameweekIdx);

    //might need a better solution to matchdays (context value) and selectedGameweekIdx (state) 
    //being out of sync when season changes (which leads to matchdays changing)
    if(selectedGameweekIdx < 0 || selectedGameweekIdx > matchdays.length) updateSelectedGameweekIdx(0);
    
    return (
            <div className="flex flex-col gap-6 h-full">
                <GreetUser/>
                <div className="flex flex-col h-full justify-around items-center lg:flex-row py-4 gap-6">
                    {
                        !seasonHasBegun ?                    
                            <div className="flex h-[400px] justify-center items-center p-10">
                                <h2 className="font-bold text-4xl text-rose-900 dark:text-rose-500 mb-2 text-center">Season has not begun {Emojis.seasonNotBegunEmoji}</h2>
                            </div>                   
                        :
                            <div className="flex flex-col gap-2 justify-center items-center md:w-[550px] px-2 h-[100%]">
                                <GameweekDetails gameweek={matchdays[selectedGameweekIdx]} selectedMatchdayIdx={selectedGameweekIdx}/>
                                <Teamsheet selectedGameweekIdx={selectedGameweekIdx}/>
                                <Pager pagerItems={[...matchdays].map((_, index) => `${index + 1}`)} selectedIdx={selectedGameweekIdx} reactToSelection={updateSelectedGameweekIdx}/>
                            </div>  
                    }
                    <PotmLeaderboard/>
                </div>
            </div>
    )
}