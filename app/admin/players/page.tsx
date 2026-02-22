'use client'

import { useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Player } from "@/generated/prisma/client";
import { GlobalAppDataContext } from "@/app/context/GlobalAppDataContext";
import { AddPlayersToSeason, MakePlayersActive } from "@/app/services/admin.service";
import { PlayerStatus } from "@/app/lib/PlayerStatus";
import Dropdown from "@/app/ui/Dropdown";

export const dynamic = 'force-dynamic';

//todo
// improve authorization checks to address repitition

function getStatusLabel(statusId: number | null): string {
    if (statusId === PlayerStatus.Active) {
        return "Active";
    }

    if (statusId === PlayerStatus.Inactive) {
        return "Inactive";
    }

    if (statusId === PlayerStatus.Retired) {
        return "Retired";
    }

    return "-";
}

export default function Page() {
    const router = useRouter();
    const { players, loggedInPlayer } = useContext(GlobalAppDataContext);
    const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<number>>(new Set());

    const allVisiblePlayerIds = useMemo(() => players.map((player) => player.id), [players]);

    const allSelected = allVisiblePlayerIds.length > 0 && allVisiblePlayerIds.every((id) => selectedPlayerIds.has(id));

    const PlayerStatuses: string[] = Object.keys(PlayerStatus);

    function toggleSelectAll() {
        if (allSelected) {
            setSelectedPlayerIds(new Set());
            return;
        }

        setSelectedPlayerIds(new Set(allVisiblePlayerIds));
    }

    function togglePlayerSelection(playerId: number) {
        setSelectedPlayerIds((prev) => {
            const next = new Set(prev);
            if (next.has(playerId)) {
                next.delete(playerId);
            } else {
                next.add(playerId);
            }
            return next;
        });
    }

    function handleEdit() {
        if(!loggedInPlayer?.is_admin) { alert("Not permitted"); return; }
        if (selectedPlayerIds.size !== 1) {
            return;
        }

        const selectedPlayerId = Array.from(selectedPlayerIds)[0];
        router.push(`/admin/players/${selectedPlayerId}/edit`);
    }

    // function handleDelete() {
    //     if(!loggedInPlayer?.is_admin) { alert("Not permitted"); return; }
    //     if (selectedPlayerIds.size === 0) {
    //         return;
    //     }

    //     const selectedIds = Array.from(selectedPlayerIds);
    //     alert(`Delete action triggered for player IDs: ${selectedIds.join(", ")}`);
    // }

    // async function handleAddToSeason() {
    //     if(!loggedInPlayer?.is_admin) { alert("Not permitted"); return; }

    //     if (selectedPlayerIds.size === 0) {
    //         return;
    //     }

    //     const selectedIds = Array.from(selectedPlayerIds);

    //     await AddPlayersToSeason(selectedIds);
    // }

    async function handleAddPlayerActive() {
        if(!loggedInPlayer?.is_admin) { alert("Not permitted"); return; }

        if (selectedPlayerIds.size === 0) {
            return;
        }

        const selectedIds = Array.from(selectedPlayerIds);

        await MakePlayersActive(selectedIds);
    }

    return (
        <div className="w-full px-4 py-6">
            <div className="mx-auto max-w-6xl rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-xl font-semibold text-gray-900">Players</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{selectedPlayerIds.size} selected</span>
                        <button
                            type="button"
                            onClick={handleEdit}
                            disabled={selectedPlayerIds.size !== 1}
                            className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Edit
                        </button>
                        {/* <button
                            type="button"
                            onClick={handleDelete}
                            disabled={selectedPlayerIds.size === 0}
                            className="rounded bg-red-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Delete
                        </button> */}
                        {/* <button
                            type="button"
                            onClick={handleAddToSeason}
                            disabled={selectedPlayerIds.size === 0}
                            className="rounded bg-emerald-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Add to season
                        </button> */}
                        <button
                            type="button"
                            onClick={handleAddPlayerActive}
                            disabled={selectedPlayerIds.size === 0}
                            className="rounded bg-fuchsia-500 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Make Active
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleSelectAll}
                                        aria-label="Select all players"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Username</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Firstname</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Lastname</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {players.map((player: Player) => (
                                <tr key={player.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedPlayerIds.has(player.id)}
                                            onChange={() => togglePlayerSelection(player.id)}
                                            aria-label={`Select ${player.username ?? "player"}`}
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{player.username ?? "-"}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{player.firstname ?? "-"}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{player.lastname ?? "-"}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{getStatusLabel(player.status_id)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
