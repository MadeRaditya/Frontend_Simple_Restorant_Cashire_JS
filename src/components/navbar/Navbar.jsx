"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import IconsList from '../../../public/assets/icons/IconsList';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [token, setToken] = useState(null);
    const [darkMode, setDarkMode] = useState(false); 
    const [IsMounted, setIsMounted] = useState(false)
    const router = useRouter();

    useEffect(()=>{
        setIsMounted(true);
        checkToken();
        const storedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(storedDarkMode);

        if(storedDarkMode){
            document.documentElement.classList.add('dark');
        }
    },[])

    useEffect(()=>{
        if(!IsMounted) return;

        if(darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode','true')
        }else{
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode','false')
        }
    },[darkMode,IsMounted])

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const checkToken = () => {
        const token = localStorage.getItem('token');
        setToken(token ? token : null)
    };


    if(!IsMounted) return null;



    const logoutButton = (
        <a href='/auth/logout' className="bg-red-600 text-white hover:text-gray-300 transition px-4 py-2 rounded hover:bg-red-700 duration-300 dark:bg-red-700 dark:hover:bg-red-600">
            Logout
        </a>
    );

    const logOutButtonMobile = <p className='block ml-3'>{logoutButton}</p>;

    return (
        <nav className="bg-white dark:bg-gray-800 p-4 fixed top-0 left-0 w-full z-10 shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="text-black dark:text-white text-3xl font-semibold cursor-pointer">
                    <a href="/" className="hover:text-gray-700 dark:hover:text-gray-300 transition duration-300">Cashire</a>
                </div>

                <div className="hidden md:flex md:mr-14 space-x-8 justify-center items-center">
                    <a href="/menulist" className="text-black dark:text-white font-semibold hover:text-gray-700 dark:hover:text-gray-300 transition duration-300 py-2 px-4">Menu List</a>
                    <a href="/orderlist" className="text-black dark:text-white font-semibold hover:text-gray-700 dark:hover:text-gray-300 transition duration-300 py-2 px-4">Order List</a>
                    {token && logoutButton}

                </div>
                <button onClick={() => setDarkMode(!darkMode)} className="text-black absolute right-16 md:right-6 dark:text-white justify-center items-center hover:text-gray-900 dark:hover:text-gray-200 transition duration-300">
                    {darkMode ? (
                        <IconsList.MoonIcon />
                    ) : (
                        <IconsList.SunIcon />
                    )}
                </button>

                

                <div className="md:hidden flex items-center">
                    <button onClick={toggleNavbar} className="text-black dark:text-white hover:text-gray-900 dark:hover:text-gray-200 transition duration-300">
                        {isOpen ? (
                            <IconsList.CloseIcons />
                        ) : (
                            <IconsList.HamburgerMenu />
                        )}
                    </button>
                </div>
            </div>

            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden mt-4 bg-white dark:bg-gray-900 rounded-lg dark:text-white ${token ? 'h-36' : 'h-24'} space-y-4`}>
                <a href="/menulist" className="block font-semibold hover:text-gray-700 dark:hover:text-gray-300 transition duration-300 pt-2 px-4">Menu List</a>
                <a href="/orderlist" className="block font-semibold hover:text-gray-700 dark:hover:text-gray-300 transition duration-300 px-4">Order List</a>
                {token && logOutButtonMobile}
            </div>

        </nav>
    );
};
