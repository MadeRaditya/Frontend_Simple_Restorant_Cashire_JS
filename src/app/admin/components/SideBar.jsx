"use client"
import Link from 'next/link';
import { useState } from 'react';

const Sidebar = () => {
    const [isOpen,setIsOpen]= useState(false)
    

    const handleOpen=()=>{
        setIsOpen(!isOpen);
    }
  return (
    <div className="relative">
        <button
            className='md:hidden text-2xl bg-gray-100 text-black shadow-md py-2 px-6 rounded-full font-bold fixed top-2 left-4 z-50 transform -translate-x-1/2 hover:bg-gray-200 transition duration-300 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-6000'
            onClick={handleOpen}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
            {isOpen ? 'X' : '☰'}
        </button>


        <div className={`min-h-screen h-full left-0 top-0 fixed z-40 w-64 md:w-32 lg:w-1/5 bg-white text-black dark:bg-gray-800 dark:text-white py-5 px-5 shadow-lg transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:w-64 md:fixed md:block`}>
        <h2 className="text-center md:text-left text-2xl font-bold mb-3">Cashire</h2>
        <ul>
            <li>
            <Link href="/admin/dashboard" className="block py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                Dashboard
            </Link>
            </li>
            <li>
            <Link href="/admin/users" className="block py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                Users
            </Link>
            </li>
            <li>
            <Link href="/admin/menu" className="block py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                Menu
            </Link>
            </li>
            <li>
            <Link href="/admin/orders" className="block py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                Orders
            </Link>
            </li>
            <li>
            <Link href="/admin/table" className="block py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                Tables
            </Link>
            </li>
            <li>
            <Link href="/admin/transaction" className="block py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                transaction
            </Link>
            </li>
            <li>
            <Link href="../../auth/logout" className="block py-2 text-white bg-red-600 px-2 hover:bg-red-700 rounded dark:bg-red-700 dark:hover:bg-red-600">
                Logout
            </Link>
            </li>
        </ul>
        </div>
    </div>
  );
};

export default Sidebar;
