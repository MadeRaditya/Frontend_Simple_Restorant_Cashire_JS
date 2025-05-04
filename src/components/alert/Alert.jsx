import React, { useState,useEffect } from 'react';
import '../../app/globals.css';
import IconsList from '../../../public/assets/icons/IconsList';


const Alert = ({ type = 'success', message, duration = 3000, onClose }) => {
    const [animateClass, setAnimateClass] = useState('alert-slide-in');
    const [visible, setVisible] = useState(true);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setAnimateClass('alert-slide-out');
        setTimeout(() => {
          setVisible(false);
          if (onClose) onClose();
        }, 400); 
      }, duration);
  
      return () => clearTimeout(timer);
    }, [duration, onClose]);
  
    if (!visible) return null;
  
    const icons = {
      success: (
        <IconsList.SuccessIcon />
      ),
      error: (
        <IconsList.ErrorIcons />
      ),
    };
  
    return (
        <div className={`fixed top-5 left-5 z-50 ${animateClass}`}>
        <div className="flex w-96 shadow-lg rounded-lg">
          <div className={`py-4 px-6 rounded-l-lg flex items-center 
              ${type === 'success' 
                ? 'bg-green-600 dark:bg-green-500' 
                : 'bg-red-600 dark:bg-red-500'}`}>
            {icons[type]}
          </div>
      
          <div className="px-4 py-6 bg-white dark:bg-gray-900 dark:border-gray-700 rounded-r-lg 
              flex justify-between items-center w-full border border-l-transparent border-gray-200">
            <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{message}</div>
            <button onClick={() => setAnimateClass('alert-slide-out')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700 dark:text-gray-300" viewBox="0 0 16 16" width="20" height="20">
                <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
    );
  };
  

export default Alert;
