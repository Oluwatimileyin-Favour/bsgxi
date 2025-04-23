import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./Navbar";
import { inter } from "./ui/fonts";

export const metadata: Metadata = {
  title: "BSG-XI",
  description: "Never Stop Striving",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-[100vh]">
      <body className={`${inter.className} antialiased h-[100%] text-gray-700 dark:bg-[#1E1E1E] dark:text-gray-300`}>
        <div className="flex flex-col h-[100%]">
          <header className="flex items-center min-h-[4rem] dark:bg-[#181818]">
            <Navbar/>
          </header>
          {/* children containers can set height to 100% to cover all area under navbar */}
          <main className="min-h-[calc(100%-4rem)]"> 
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
