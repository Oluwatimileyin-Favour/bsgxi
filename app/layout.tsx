import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { GlobalAppDataProvider } from "./context/GlobalAppDataProvider";
import "./globals.css";
import Navbar from "./Navbar";
import { findActivePlayerByEmail, findPlayerByEmail } from "./services/db.service";
import { inter } from "./ui/fonts";
import { FetchAppData } from "./services/application.service";
import GlobalErrorMessage from "./ui/GlobalErrorMessage";
import UserNotRegistered from "./ui/UserNotRegistered";
import { GlobalAppData } from "./interfaces/GlobalAppData";
import { PlayerStatus } from "./lib/PlayerStatus";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "BSG-XI",
  description: "Never Stop Striving",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession(authOptions);

  const guestUser = (await cookies()).get('Guest');
  let loggedInPlayer = await findPlayerByEmail(session?.user?.email ?? "") ?? undefined;
  const playerIsActive: boolean = loggedInPlayer?.status_id === PlayerStatus.Active;

  if(session && !guestUser){
    if(!loggedInPlayer) return <UserNotRegistered _playerHasRegistered={false}/> 
    else if(!playerIsActive) return <UserNotRegistered _playerHasRegistered={true}/>
  }
  else if(!playerIsActive) {
    loggedInPlayer = undefined; //log in as a guest(no player data)
  }

  const globalAppData: GlobalAppData | undefined = await FetchAppData(2);

  if(!globalAppData) return <GlobalErrorMessage/>

  const {players, matchdays, matchdayStats, playersSeasonStats} = globalAppData;

  return (
    <html lang="en" className="h-[100vh]">
      <body className={`${inter.className} antialiased h-[100%] text-gray-700 dark:bg-[#1E1E1E] dark:text-gray-300`}>
        <div className="flex flex-col h-[100%]">
          <header className="flex items-center min-h-[4rem] dark:bg-[#181818] bg-gray-50">
            <Navbar loggedInPlayer={loggedInPlayer}/>
          </header>
          {/* children containers can set height to 100% to cover all area under navbar */}
          <main className="min-h-[calc(100%-4rem)]"> 

            <GlobalAppDataProvider
                  players={players}
                  matchdays={matchdays}
                  matchdayStats={matchdayStats}
                  playersSeasonStats = {playersSeasonStats}
                  loggedInPlayer={loggedInPlayer}                
                >
                  {children}
            </GlobalAppDataProvider> 
          </main>
        </div>
      </body>
    </html>
  );
}
