import { Player } from "@prisma/client/wasm";

export interface PlayerWithMonthPoint {
    player: Player,
    monthPoint: number
}