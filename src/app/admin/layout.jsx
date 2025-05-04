// admin/layout.jsx - perbaikan
"use client"
import React from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./components/SideBar";
import ToggleDarkMode from "./components/ToggleDarkMode";
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    // Cek token hanya sekali saat component mount

    if(typeof window !== 'undefined'){
      const storedDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(storedDarkMode);

      if(storedDarkMode) {
        document.documentElement.classList.add('dark');
      }else{
        document.documentElement.classList.remove('dark');
      }
    }
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (!token) {
          router.push('/auth/login');
          return;
      }

      try {
          const decoded = jwtDecode(token);
          if (decoded.role !== 'admin') {
              router.push('/');
          }
      } catch (error) {
          console.error("Error decoding token:", error);
          router.push('/auth/login');
      }
    };
    
    checkToken();
  }, [router]);

  const toogleDarkMode =()=>{
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    localStorage.setItem('darkMode', newDarkMode.toString());
    if(newDarkMode) {
      document.documentElement.classList.add('dark');
    }else{
      document.documentElement.classList.remove('dark');
    }
  }
  
  return (
    <>
      <Sidebar/>
      <ToggleDarkMode darkMode={darkMode} toogleDarkMode={toogleDarkMode}/>
      {React.cloneElement(children, {darkMode})}
    </>
  );
}