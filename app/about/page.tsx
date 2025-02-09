import { lusitana } from "../ui/fonts" 


export default function AboutPage(){

    return (
        <div className={`${lusitana.className} flex flex-col justify-center items-center bg-cover bg-center h-[calc(100vh-4rem)] overflow-hidden`}
        style={{ backgroundImage: "url('brown.jpg')" }}
        >
            <div className="flex flex-col gap-3 text-xl font-semibold text-white p-3">
                <p>BSG-XI is a modern web application created specially for BSG FC to keep track of various player statistics</p>
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