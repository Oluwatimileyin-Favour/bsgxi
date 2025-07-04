import { ClassicoTableRowData } from "../interfaces/classicoTableRowData";
import { GenerateClassicoTableData } from "../util/classicoTableDataGenerator";
import { fetchAllClassicos } from "../services/db.service";


export default async function ClassicoTable() {

    const classicos = await fetchAllClassicos();
    
    const teams = GenerateClassicoTableData(classicos);

    return (
        <div className="px-5 overflow-x-auto">
            <h2 className="sticky left-0 text-sky-500 dark:text-inherit text-2xl font-bold text-center">Classico</h2>
            <table className="min-w-full table-auto border-collapse">
                <thead className="">
                    <tr>
                        <th className="dark:bg-inherit border-2 px-4 py-2 text-left">Team</th>
                        <th className="border-2 px-4 py-2 text-left">Pts</th>
                        <th className="border-2 px-4 py-2 text-left">GD</th>
                        <th className="border-2 px-4 py-2 text-left">W</th>
                        <th className="border-2 px-4 py-2 text-left">D</th>
                        <th className="border-2 px-4 py-2 text-left">L</th>
                        <th className="border-2 px-4 py-2 text-left">GF</th>
                        <th className="border-2 px-4 py-2 text-left">GA</th>
                        <th className="border-2 px-4 py-2 text-left">Games</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.map((team) => <ClassicoTableRow key={team.name} team={team}/>)}
                </tbody>
            </table>
        </div>
    )
}

function ClassicoTableRow({team} : {team: ClassicoTableRowData}) {
    return (
        <tr>
            <td className="dark:bg-inherit border-2 px-4 py-2">{team.name}</td>
            <td className="border-2 px-4 py-2">{team.pts}</td>
            <td className="border-2 px-4 py-2">{team.goalsFor - team.goalsAgainst}</td>
            <td className="border-2 px-4 py-2">{team.wins}</td>
            <td className="border-2 px-4 py-2">{team.draws}</td>
            <td className="border-2 px-4 py-2">{team.losses}</td>
            <td className="border-2 px-4 py-2">{team.goalsFor}</td>
            <td className="border-2 px-4 py-2">{team.goalsAgainst}</td>
            <td className="border-2 px-4 py-2">{team.games}</td>
        </tr>
    )
}