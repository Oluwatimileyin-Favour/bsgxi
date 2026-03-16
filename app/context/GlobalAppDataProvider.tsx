"use client";

import { useEffect, useState } from "react";
import { GlobalAppDataContext } from "./GlobalAppDataContext";
import { GlobalAppDataContextProps } from "./Props";
import { fetchAllGameweeksBySeason, fetchAllGameweekStatsBySeason, fetchAllPlayersSeasonStats } from "../services/db.service";

export function GlobalAppDataProvider({ players, matchdays, matchdayStats, playersSeasonStats, loggedInPlayer, children}: GlobalAppDataContextProps) 
{

  // TODO
  const [season, setSeason] = useState(2);
  const [matchdaysState, setMatchdays] = useState(matchdays);
  const [matchdayStatsState, setMatchdayStats] = useState(matchdayStats);
  const [seasonStatsState, setSeasonStats] = useState(playersSeasonStats);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {

      setIsLoading(true);
      const gameweeks = await fetchAllGameweeksBySeason(season);
      const gameweekStats = await fetchAllGameweekStatsBySeason(season);  //TODO
      const seasonStats = await fetchAllPlayersSeasonStats(season);
      setIsLoading(false);
      setMatchdays(gameweeks);
      setMatchdayStats(gameweekStats);
      setSeasonStats(seasonStats);
    };
    fetchData();
  }, [season])

  function handleSeasonChange(season: number): void {
    setSeason(season);
  }

  return (
      <GlobalAppDataContext 
        value={{ 
          players, 
          matchdays: matchdaysState, 
          matchdayStats: matchdayStatsState, 
          loggedInPlayer, 
          season, 
          playersSeasonStats: seasonStatsState, 
          setSeason: handleSeasonChange,
          isLoading   
        }}
        >
        {children}
      </GlobalAppDataContext>
  );
}