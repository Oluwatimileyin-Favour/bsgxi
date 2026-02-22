import { Player } from "@/generated/prisma/client";


//IMPORTANT: SYNC WITH DATABASE
export const DummyPlayer: Player = {
    id: 31,
    code: "dummy",
    firstname: "no vote",
    lastname: "dummy",
    provider_id: null,
    username: "no vote",
    email: null,
    status_id: null,
    is_admin: null,
    totalgoals: 0,
    totalpoints: 0,
    last_login: null,
    date_registered: null,
    profile_picture: null
}