import { Player } from "@prisma/client/wasm";

export interface PlayerWithMonthPoint {
    player: Player,
    monthPoints: number
}