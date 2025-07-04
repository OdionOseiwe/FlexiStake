import React from 'react'
import { ArrowDown } from 'lucide-react';
import Button from '../Components/Button';
import Ethereum from '../images/ethereum.png'

export default function Stake() {
  return (
    <div className='md:px-12  md:py-6 bg-linear-to-br from-fuchsia-950 to-blue-950 brighteness-50'>
      <div className='flex justify-end mb-8'><p className='text-xl text-gray-500 bg-amber-300 p-4 rounded-2xl'>connect wallet</p></div>
      <div className='flex flex-wrap md:justify-around'>
      <div className='bg-linear-to-b from-blue-700 to-fuchsia-950 md:border-t-1 rounded-3xl mx-2 md:p-6 p-3 brightness-110 hover:-translate-y-2 
      transition-all duration-500'>
        <div>
          <h1 className='md:text-2xl text-xl'> Stake Tokens</h1>
          <p className='mt-4 text-gray-500 font-extralight'>APY total value <span className='ml-2'>3%</span></p>
          <div className='flex justify-between items-center bg-fuchsia-950 p-6 h-16 brightness-125 
              rounded-xl shadow-2xl shadow-blue-700 mt-5 text-gray-500'>
            <div className='flex items-center'>
              <div className='mr-2'><img src={Ethereum} alt="logo " className='size-8 rounded-full' /></div>
              <p>mETH</p>
            </div>
            <div>
              options
            </div>
          </div>
          <div className='flex justify-center mt-4 mb-2'><ArrowDown/></div>
          <form >
            <label className=''>Enter amount</label>
            <input className='flex justify-between items-center bg-fuchsia-950 p-4 w-full h-16 brightness-125 mb-6 
            rounded-xl shadow-2xl shadow-blue-700 mt-1 text-gray-500 focus:border-none focus:outline-0 text-2xl' 
            type="text" placeholder='0.0' />
            <div className='flex justify-end'>
              <Button label="stake"/>
            </div>
          </form>
        </div>

        <div className='bg-fuchsia-950 md:p-6 p-3 rounded-2xl mt-8 md:border-t-1'>
            <div className='flex justify-end'>
              <p>options</p>
            </div>
          <div>
            <div className= 'bg-linear-to-r from-fuchsia-950 brightness-75 text-gray-500 md:text-xl p-3 mb-2 rounded-xl' >My Stake: <span className='text-black font-bold'>0.0</span></div>
            <p className= 'bg-linear-to-r from-fuchsia-950 brightness-75 text-gray-500 md:text-xl p-3 mb-2 rounded-xl' >Pending rewards: <span className='text-black font-bold'>0.0</span></p>
            <p className= 'bg-linear-to-r from-fuchsia-950 brightness-75 text-gray-500 md:text-xl p-3 mb-2 rounded-xl' > <span className='text-black font-bold'>7</span> days left</p>
            <div className='mt-6'>
              <Button label="Withdraw"/>
              <Button label="Emergency withdraw"/>
              <Button label="Claim rewards"/>
            </div>
          </div>
          
        </div>
      </div>

      <div >
        <div className='bg-fuchsia-950 md:p-3 p-2 rounded-2xl mt-8 md:border-t-1 text-gray-500 w-60
        hover:-translate-y-2 
      transition-all duration-500'>
          <h1 className='mb-4'>FlexiStake Stats</h1>
          <div className='bg-linear-to-r from-fuchsia-950 brightness-75 rounded-2xl p-3 '>
            <div className='flex items-center'>
              <div className='mr-4'><img src={Ethereum} alt="logo " className='size-8 rounded-full' /></div>
              <div>
                <p className='text-xs'>TVL</p>
                <p className='text-l'>$ <span>1.8</span> B</p>
              </div>
            </div>
          </div>

       </div>

        <div className='bg-linear-to-b from-blue-700 to-fuchsia-950 md:p-3 p-2 rounded-2xl mt-8 md:border-t-1
        hover:-translate-y-2 
      transition-all duration-500'>
        <h1 className='mb-4'>Assets Restaked</h1>
          <div className='bg-linear-to-r from-fuchsia-950 brightness-75 rounded-2xl p-3 '>
            <div className='flex items-center'>
            <div className='mr-4'><img src={Ethereum} alt="logo " className='size-8 rounded-full' /></div>
              <div>
                <p className='text-xs'>mETH</p>
                <p className='text-l'>$ <span>1.8</span> B</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  
  )
}
