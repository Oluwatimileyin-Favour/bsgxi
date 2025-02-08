import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./Navbar";
import { inter } from "./ui/fonts";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-[100%]">
      <body
        className={`${inter.className} antialiased h-[100%]`}
      >
        <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
