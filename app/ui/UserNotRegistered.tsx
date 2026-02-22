"use client"

import { Player } from "@/generated/prisma/client";
import { useRouter } from "next/navigation";
import { useRef, useState, type RefObject } from "react";
import Emojis from "../lib/emojis";
import { LinkAccounts, RegisterNewPlayer } from "../services/application.service";
import { findPlayerByCode } from "../services/db.service";
import ViewAsGuestButton from "./ViewAsGuestButton";
import { inter } from "./fonts";


export default function UserNotRegistered({_playerHasRegistered}: {_playerHasRegistered: boolean}){

    const playerCodeRef = useRef<HTMLInputElement>(null);
    const userNameRef = useRef<HTMLInputElement>(null);
    const userNameRef_newUsers = useRef<HTMLInputElement>(null);

    const [foundAccount, setFoundAccount] = useState<Player | null>(null);
    const [playerHasRegistered, setPlayerHasRegistered] = useState<boolean>(_playerHasRegistered);

    const router = useRouter();

    async function handleLinkAccounts(){
        const oldAccount = await findPlayerByCode(playerCodeRef.current?.value ?? "");
        if(oldAccount){
            setFoundAccount(oldAccount);
        }
        else{
            alert("Account with that code not found")
        }
    }

    async function handleConfirmLinkage(){
        if(foundAccount){
            try{
                const username = userNameRef?.current?.value ?? "";
                if(username && username.length > 0) foundAccount.username = username;

                await LinkAccounts(foundAccount);
                alert("Update Successful");
                router.refresh();
            }
            catch{
                alert("There was error linking your accounts");
            }
        }
        else{
            //HANDLE
            alert("Account not found")
        }
    }

    async function handleNewRegistration() {
        const username = userNameRef_newUsers.current?.value ?? "";

        if(username === ""){
            alert("Please enter username");
            return;
        }

        try{
            await RegisterNewPlayer(username);
            setPlayerHasRegistered(true);

        }
        catch{
            alert("There was error registering your account");
        }
    }

    function handleCancelLinkage(){
        setFoundAccount(null);
        if(playerCodeRef.current){
            playerCodeRef.current.value = "";
        }
    }

    // another modal for new users
    // username is required
    // first and last name optional
    //admin will review and make player active on db side
    return (
        <html lang="en" className="h-[100vh]">
            <body className={`${inter.className} antialiased h-[100%] text-gray-700 dark:bg-[#1E1E1E] dark:text-gray-300`}>

                <div className="flex flex-col p-8 gap-4 h-full items-center justify-center">  
                    <h1 className='text-4xl font-bold mb-4'>Eish! You're not registered {Emojis.needToRegister}</h1>
                    <h2>New users, Admin has to approve your registration {Emojis.viewAsAGuest}</h2>
                    
                    {
                    playerHasRegistered ?
                        <>
                            <h2>You can view as a guest while you wait {Emojis.eish}</h2>
                            <ViewAsGuestButton/>
                        </>
                    :
                        <div className="flex gap-3">
                                <input
                                    type="text"
                                    defaultValue={""}
                                    ref={userNameRef_newUsers}
                                    placeholder="Display name"
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={handleNewRegistration}>Register</button>
                        </div>
                    }

                    <h2 className="mt-5">2025 users, link your old account to your google account</h2>
                    <div className="flex gap-3">
                        <input 
                            type="text" 
                            ref={playerCodeRef}
                            placeholder="2025 code"
                            className="px-3 py-2 border border-gray-300 dark:border-sky-400 dark:bg-inherit rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={handleLinkAccounts}>Link Accounts</button>
                    </div>
                    
                    {foundAccount && (
                        <ConfirmAccountLinkage 
                            account={foundAccount} 
                            onConfirm={handleConfirmLinkage}
                            onCancel={handleCancelLinkage}
                            userNameRef={userNameRef}
                        />
                    )}
                </div>

            </body>
        </html>
    )
}


function ConfirmAccountLinkage({account, onConfirm, onCancel, userNameRef}:{account: Player, onConfirm: () => void, onCancel: () => void, userNameRef: RefObject<HTMLInputElement | null>}){

    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
                <h2 className="text-2xl font-bold mb-4 text-center">We Found An Account! {Emojis.needToLoginEmoji}</h2>
                <div className="mb-6 text-center">
                    <p className="text-gray-600 dark:text-gray-300 mb-2">Linked to:</p>
                    <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                        {account.firstname} {account.lastname}
                    </p>
                </div>

                <div className="mb-4">
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Enter user name (what others will see)</label>
                    <input
                        type="text"
                        ref={userNameRef}
                        defaultValue={account.username ?? ""}
                        placeholder="Display name"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={onCancel}
                        className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}