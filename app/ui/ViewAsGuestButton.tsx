'use client'

import { useRouter } from "next/navigation";

export default function ViewAsGuestButton() {

    const router = useRouter();

    async function handleClick(){
        await fetch("/api/set-cookie", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        router.refresh();
    }

    return (
        <button className='px-6 py-2 bg-gray-300 w-56 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition' onClick={handleClick}>View as guest</button>
    )
}