import Button from '../Components/Button';

export default function PopUpModal() {
  return (
    
    <div className='bg-linear-to-br from-fuchsia-950 to-blue-950 brighteness-50 absolute right-10 '>
      <form className='' >
            <label className=''>Enter amount</label>
            <input className='flex justify-between items-center bg-fuchsia-950 p-4 w-full h-16 brightness-125 mb-6 
            rounded-xl shadow-2xl shadow-blue-700 mt-1 text-gray-500 focus:border-none focus:outline-0 text-2xl' 
            type="text" placeholder='0.0' />
            <div className='flex justify-end'>
              <Button label="stake"/>
            </div>
          </form>
    </div>
  )
}
