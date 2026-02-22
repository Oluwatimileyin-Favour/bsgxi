import { useContext } from "react";
import { GlobalAppDataContext } from "../context/GlobalAppDataContext";

export default function GreetUser() {

    const {loggedInPlayer} = useContext(GlobalAppDataContext);

    // if(!loggedInPlayer) return;

    return (
        <div className="mt-3 font-bold text-4xl text-rose-900 dark:text-rose-500 text-center">Howzit {loggedInPlayer?.username ?? 'Guest'}</div>
    )

}