'use client'

import { signIn } from "next-auth/react"
import { AuthProviders } from "../lib/AuthProviders"
import Emojis from "../lib/emojis"
import ViewAsGuestButton from "../ui/ViewAsGuestButton"

export default function Login(){

    return (
        <div className='flex flex-col h-full justify-center items-center gap-6'>
            <h1 className='text-2xl md:text-4xl font-bold mb-4'>Oops! You need to log in {Emojis.needToLoginEmoji}</h1>
            <button onClick={() => signIn(AuthProviders.Google)} className='px-6 py-2 bg-sky-500 w-56 text-white rounded-lg font-semibold hover:bg-sky-600 transition'>Log in with google</button>
            <ViewAsGuestButton/>
        </div>
    )
}