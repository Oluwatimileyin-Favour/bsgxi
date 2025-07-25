import { lusitana } from "../ui/fonts" 

export default function AboutPage(){

    return (
        <div className={`${lusitana.className} flex flex-col justify-center items-center h-[100%] overflow-hidden`}
        >
            <div className="flex flex-col gap-3 text-xl font-semibold p-3">
                <p>BSG-XI was created specially for BSG FC to keep track of various player statistics</p>
                <p>Created by Oluwatimileyin Favour Obagbuwa with Next.js</p>
                <p>Special thanks to BSG FC Admin: Nawaaz, Divashin and Kuda</p>
                <p className="font-normal">There might be 🐞🐛. Let me know if you run into any</p>
                <br></br>
                <p className="italic">Who shall dethrone Hassan</p>
                <p className="italic">Never stop striving</p>
            </div>
        </div>
    )
}