import React from 'react'
import { useState } from 'react'
interface ButtonProps extends
React.ButtonHTMLAttributes<HTMLButtonElement>{
    label?:string;
}
const Button: React.FC<ButtonProps> = ({label, onClick}) =>{
  const [active, setActive] = useState<boolean>(false);
  
  return (
    <button 
      onClick={(e)=> {
      setActive(!active); 
      if(onClick) onClick(e);}}
    className='h-10 bg-black text-white md:py-2 py-1 md:px-8 px-4 rounded-lg md:text-l md:mr-5 mb-3 sm:mr-2
    hover:scale-105 transition-all duration-500 ease-in-out active:scale-100 cursor-pointer'>{label}</button>
  )
}
export default Button;