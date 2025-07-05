import React from 'react'
import { Outlet, Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-[url(./images/home.jpg)] brightness-115 bg-cover w-full h-screen  backdrop-brightness-[.9] text-amber-50 md:px-20 px-6 md:py-8 py-3">
      <div>
        <div className='text-4xl font-extralight'>FlexiStake</div>
      </div>
      <div className='md:mt-16 mt-8 md:w-8/12 '>
        <h1 className='md:text-8xl text-4xl font-extralight'>Welcome to <span className='md:text-8xl text-4xl font-bold'> flexiStake</span></h1>
        <p className='font-light md:text-xl mt-10 leading-[2]'>flexiStake is a flexible and user-friendly platform for staking your assets.</p>
        <p className='font-light md:text-xl leading-[2] mb-8'>With flexiStake, you can easily stake your assets and earn rewards while
           maintaining the flexiblity of Flexistake </p>
        <Link to="/Stake" className='h-14 bg-linear-to-r from-fuchsia-500 to-blue-500 md:py-4 py-2 md:px-10 px-5  rounded-lg md:text-xl text-l uppercase
         active:translate-y-1 active:scale-95'>get started</Link>
      </div>
      <Outlet />
    </div>
  )
}
