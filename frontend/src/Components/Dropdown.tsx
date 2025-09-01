import { useState } from "react"
import { ChevronDown, ChevronUp } from 'lucide-react';
type DropDownProps
={
  tier: string,
  setTier: (tier:string)=> void
}
const Dropdown = ({tier, setTier}: DropDownProps) => {
    const [active, setActive] = useState<boolean>(false);
  return (
    <div>
      <button onClick={()=>setActive(!active)} className="relative top-0 left-0  w-full h-full flex  text-gray-500 bg-fuchsia-950 brightness-75  
      md:text-l p-2 mb-2  rounded-xl cursor-pointer">
        <p className="mr-3"> {tier}</p>
        <p>
            {active ?<ChevronUp/>: <ChevronDown/>}
        </p>
      </button>
      {active && <div className="text-gray-500 bg-fuchsia-950 
       brightness-75 md:text-l rounded-l cursor-pointer p-1 absolute right-6  w-40  z-50">
        <p onClick={()=>{setTier("Tier1") }} className={`${tier === "Tier1" &&"bg-linear-to-r from-fuchsia-500 to-blue-500 p-1 text-black"}`}>Tier1 (30 days)</p>
        <p onClick={()=>{setTier("Tier2")}}  className={`${tier === "Tier2" &&"bg-linear-to-r from-fuchsia-500 to-blue-500 p-1 text-black"}`}>Tier2 (90 days)</p>
        <p onClick={()=>{setTier("Tier3")}}  className={`${tier === "Tier3" &&"bg-linear-to-r from-fuchsia-500 to-blue-500 p-1 text-black"}`}>Tier3 (365 days)</p>
        
      </div>}
    </div>
  )
}

export default Dropdown;