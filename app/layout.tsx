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
    <html lang="en" className="h-[100%]">
      <body className={`${inter.className} antialiased h-[100%]`}>
        <div className="flex flex-col h-[100%]">
          <header className="flex items-center h-[4rem]">
            <Navbar/>
          </header>
          {/* children containers can set height to 100% to cover all area under navbar */}
          <main className="h-[calc(100%-4rem)]"> 
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
