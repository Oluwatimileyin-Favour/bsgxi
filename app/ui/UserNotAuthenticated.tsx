'use client'

import { signIn } from "next-auth/react";
import { AuthProviders } from "../lib/AuthProviders";
import Emojis from "../lib/emojis";
import { inter } from "./fonts";
import ViewAsGuestButton from "./ViewAsGuestButton";

export default function UserNotAuthenticated(){

    return (
        <html lang="en" className="h-[100vh]">
            <body className={`${inter.className} antialiased h-[100%] text-gray-700 dark:bg-[#1E1E1E] dark:text-gray-300`}>
                <div className='flex flex-col h-full justify-center items-center gap-6'>
                    <h1 className='text-4xl font-bold mb-4'>Oops! You need to log in {Emojis.needToLoginEmoji}</h1>
                    <button onClick={() => signIn(AuthProviders.Google)} className='px-6 py-2 bg-sky-500 w-56 text-white rounded-lg font-semibold hover:bg-sky-600 transition'>Log in with google</button>
                    <ViewAsGuestButton/>
              </div>
            </body>
        </html>
    )
}