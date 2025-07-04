import React from 'react'

interface ButtonProps extends
React.ButtonHTMLAttributes<HTMLButtonElement>{
    label?:string;
}
const Button: React.FC<ButtonProps> = ({label}) =>{
  return (
    <button className='h-10 bg-linear-to-r from-fuchsia-500 to-blue-500 md:py-2 py-1 md:px-8 px-4 rounded-lg md:text-l md:mr-5 mb-3 sm:mr-2
    hover:scale-105 transition-all duration-500 ease-in-out active:scale-100'>{label}</button>
  )
}
export default Button;