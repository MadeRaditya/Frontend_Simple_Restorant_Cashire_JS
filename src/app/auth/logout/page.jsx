'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const chaceckIsLogin = () => {
      const token = localStorage.getItem('token');
      if(!token){
        router.push('/')
      }
    }
    
    useEffect(() => {
      const storedDarkMode = localStorage.getItem('darkMode') === 'true';
      {storedDarkMode ?document.documentElement.classList.add('dark') : "" }
      chaceckIsLogin();
    }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem('token');
      router.push('/');
    }, 1500); 
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white dark:bg-black">
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-8 max-w-md w-full text-center space-y-6">
        <h2 className="text-2xl font-semibold text-black dark:text-white">Are you sure you want to log out?</h2>
        <p className="text-gray-800 dark:text-gray-100">You will be redirected to the login page shortly.</p>
        
        <div className="text-6xl text-red-600 dark:text-red-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-12 h-12 mx-auto"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`w-full px-6 py-3 rounded-md text-white font-semibold transition duration-300 ${
            isLoggingOut
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 dark:bg-red-700 dark:hover:bg-red-600 dark:focus:ring-red-700'
          }`}
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>

        {isLoggingOut && (
          <p className="text-sm text-gray-500 dark:text-gray-950 mt-4">Redirecting...</p>
        )}
      </div>
    </div>
  );
}
