'use client'

import {useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

export default function Dropdown({menuItems, selectedItem, reactToSelection, displayTextSize}: {menuItems: string[], selectedItem: string, reactToSelection: (idx: number) => void, displayTextSize: string}){

  const [showDropDown, toggleDropDownVisibility] = useState(false);

  function handleSelectItem(itemIndex: number) {
    toggleDropDownVisibility(false);
    reactToSelection(itemIndex)
  }

  return (
    <div className="flex flex-col items-center p-2 text-center ml-8">
      <button className={`flex justify-between font-bold ${displayTextSize} text-rose-900 hover:cursor-pointer p-2 hover:text-rose-600 rounded-md`} onClick={() => toggleDropDownVisibility(!showDropDown)}>
        {selectedItem} {showDropDown ? <span className="py-1 ml-3"><HiChevronUp/></span> : <span className="py-1 ml-3"><HiChevronDown/></span>} 
      </button>
      {
        showDropDown && 
        <ul className="shadow-md rounded-lg">
          {menuItems.map((item, index) => (
            <li key={item}  className="p-2 rounded-lg hover:cursor-pointer hover:bg-rose-200" onClick={() => handleSelectItem(index)}>{item}</li>
          ))}
        </ul>
      }
    </div>
  )
}