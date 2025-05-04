'use client'
import React, { use, useEffect, useState } from 'react'
import IconsList from '../../../../public/assets/icons/IconsList';

export default function ToggleDarkMode({darkMode,toogleDarkMode}) {
 const [hasMounted,setHasMounted]= useState(false);

useEffect(()=>{
    setHasMounted(true)
},[])

if(!hasMounted) return null;

  return (
    <>
        <button onClick={toogleDarkMode} className='text-2xl bg-gray-100 text-black shadow-md py-1 px-4 rounded-full font-bold fixed top-16 left-4 z-50 transform -translate-x-1/2 hover:bg-gray-200 transition duration-300 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-6000
        md:top-4 md:left-[8.5rem] md:px-2 lg:left-56 md:bg-white md:shadow-sm'
            >
            {darkMode ? 
                <IconsList.MoonIcon />
             :
                <IconsList.SunIcon />
            }
        </button>
    </>
    
  )
}
