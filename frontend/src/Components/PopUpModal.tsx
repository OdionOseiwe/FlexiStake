import Button from '../Components/Button';
import { X } from 'lucide-react';

interface PopUpModalProps extends 
React.ButtonHTMLAttributes<HTMLButtonElement>{
  PopUplabel:string, 
  message:string
}

const PopUpModal:React.FC<PopUpModalProps> =({PopUplabel,message, onClick}) => {
  return (
    
    <div className='
     p-4 absolute bottom-50 md:left-50  bg-linear-to-br
      from-fuchsia-950 to-blue-950 brighteness-50
      rounded-2xl'>
        <p className='flex justify-end cursor-pointer'>
          <button onClick={(e)=> {
            if(onClick) onClick(e)}}>
              <X className='cursor-pointer'/>
          </button>
        </p>
        
      <form className='' >
            <label className='text-l'>Enter amount</label>
            <input className='flex justify-between items-center bg-fuchsia-950 p-4 w-full h-16 brightness-125 mb-6 
            rounded-xl shadow-2xl shadow-blue-700 mt-1 text-gray-500 focus:border-none focus:outline-0 text-2xl' 
            type="text" placeholder='0.0' />
            <div className='flex justify-end'>
              <Button label={PopUplabel}/>
            </div>
            <p className=' text-l font-medium'>
              {message || "Are you sure you want to proceed with this action?"}
            </p>
          </form>
    </div>
  )
}

export default PopUpModal;
