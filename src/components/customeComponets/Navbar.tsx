import React from 'react'
import { Button } from '../ui/button'
import Logo from './Logo'
import Image from 'next/image'
import image from "../../../public/Images/Screenshot 2024-11-28 105955.png"
const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevState) => {
      const newTheme = !prevState;
      if (newTheme) {
        // Add dark mode class
        document.documentElement.classList.add('dark');
      } else {
        // Remove dark mode class
        document.documentElement.classList.remove('dark');
      }
      return newTheme;
    });
  };

  return (
    <div className='flex justify-between h-18 w-full py-2  bg-sidebar shadow-sm shadow-gray-400 font-bold text-2xl  '>
        <h1 className='ml-2'>Hello Abhishak <span className='text-2xl'> &#x1F44B;</span></h1>
<div className='flex space-x-3'>

<Button   className={`  ${isDarkMode ? 'bg-gray-800 hover:bg-gray-900 text-white' : 'bg-white text-black hover:bg-slate-300 '}`}  onClick={toggleTheme} >
{!isDarkMode && (<Logo name='darkmode' iconSize={30} className='text-2xl' containerClass='shadow-sm' style={{ color: isDarkMode ? 'white' : 'black' }}></Logo>)}
{isDarkMode && (<Logo name='lightmode' iconSize={30} className='text-2xl' containerClass='shadow-sm' style={{ color: isDarkMode ? 'white' : 'black' }}></Logo>)}
    
</Button>
<Button className={`  ${isDarkMode ? 'bg-gray-800 hover:bg-gray-900 text-white' : 'bg-white text-black hover:bg-slate-300 '}`}  >
    <Logo name='notification' iconSize={34} className='text-2xl' containerClass='shadow-sm' style={{ color: isDarkMode ? 'white' : 'black' }}></Logo>
</Button>
{/* //showing profile  */}
<div className='flex space-x-2'>
<Image src={image} width={50} height={50} alt='profile' className='rounded-full border ' />
<span className='font-semibold text-lg space-x-5  items-center hidden md:flex'>Abhishak
<Logo name="downarrow" className="w-3 h-3 my-auto" containerClass="flex-end ml-1" style={{ color: "gray" }} iconSize={15} />

</span>

</div>
    </div>

    </div>
  )
}

export default Navbar