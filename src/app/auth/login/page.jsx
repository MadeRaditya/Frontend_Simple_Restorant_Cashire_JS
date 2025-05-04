'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import { useRouter } from 'next/navigation';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const chaceckIsLogin = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      
      if (decoded.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (decoded.role === 'kasir') {
        router.push('/orderlist');
      } else if (decoded.role === 'pelayan') {
        router.push('/menulist');
      }
    }

    console.log('Token from Login:', token);
  }

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';
    {storedDarkMode ?document.documentElement.classList.add('dark') : "" }
    chaceckIsLogin();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/login', form);
      const { token } = response.data;
      console.log('Received token:', token);

      localStorage.setItem('token', token);

      const decoded = jwtDecode(token); 

      if (decoded.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (decoded.role === 'kasir') {
        router.push('/orderlist');
      } else if (decoded.role === 'pelayan') {
        router.push('/menulist');
      } else {
        router.push('/login');
      }
    } catch (err) {
      let errorMessage = 'Something went wrong';

      if (err.response?.data?.message) {
        const errorArray = err.response.data.message;
        if (Array.isArray(errorArray)) {
          errorMessage = errorArray
            .map((errorItem) =>
              typeof errorItem.msg === 'string' ? errorItem.msg : JSON.stringify(errorItem.msg)
            )
            .join(' and ');
        }
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-10 rounded shadow-md w-full max-w-md ">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1 dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1 dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        <p className='text-sm font-bold mb-3'>Don't have an account? <a href="/auth/register" className='text-blue-500 cursor-pointer'>Register</a></p>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded w-full  hover:bg-gray-800 transition duration-300 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
}
