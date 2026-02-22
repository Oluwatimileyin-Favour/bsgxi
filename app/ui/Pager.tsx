import { useState } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

// takes in a list of items to be displayed in a slider format
// and the index of the currently selected item  to highlight it
// and a function to react to the selection of an item
export default function Pager({pagerItems, selectedIdx, reactToSelection}: {pagerItems: string[], selectedIdx: number, reactToSelection: (idx: number) => void}) {

    const numItemsPerSlide = 4
    const initialIdx = numItemsPerSlide * (Math.ceil((selectedIdx + 1)/numItemsPerSlide)-1)

    const [startIdx, updateStartIdx] = useState(initialIdx); 

    if(startIdx > pagerItems.length) updateStartIdx(0); // addresing lack of sync between context and state

    function handleSlideLeft(){
        if(startIdx >= numItemsPerSlide){
            updateStartIdx(startIdx - numItemsPerSlide);
        }
    }

    function handleSlideRight(){
        if((pagerItems.length - (startIdx + 1)) >= numItemsPerSlide){
            updateStartIdx(startIdx + numItemsPerSlide);
        }
    }
    
    return (
        // take note of margin, if this is going to be reused 
        <div className="mt-5 flex items-center justify-center w-[300px] rounded-lg text-white">
            <span className="flex justify-center min-w-[50px] max-w-[150px] p-2 bg-sky-400 rounded-lg text-center shrink-0 fine-pointer:hover:bg-rose-200 cursor-pointer" onClick={handleSlideLeft}><HiOutlineChevronLeft/></span>
            <ul className="flex justify-center gap-2 p-2">
                {pagerItems.map((item, index) => (
                    index >= startIdx && index < (startIdx + numItemsPerSlide) &&

                    (
                        (index === selectedIdx && 
                            <li key={item}  className="min-w-[50px] max-w-[150px] p-1 bg-rose-500 rounded-lg text-center shrink-0 fine-pointer:hover:bg-rose-200 cursor-pointer" onClick={() => reactToSelection(index)}>
                                {item}
                            </li>
                        )

                        ||

                        (
                            <li key={item}  className="min-w-[50px] max-w-[150px] p-1 bg-sky-400 rounded-lg text-center shrink-0 fine-pointer:hover:bg-rose-200 cursor-pointer" onClick={() => reactToSelection(index)}>
                                {item}
                            </li>
                        )
                    )
                ))}
            </ul>
            <span className="flex justify-center min-w-[50px] max-w-[150px] p-2 bg-sky-400 rounded-lg text-center shrink-0 fine-pointer:hover:bg-rose-200 cursor-pointer" onClick={handleSlideRight}><HiOutlineChevronRight/></span>
        </div>
    )
}