'use client';

import { useState,useEffect } from 'react';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: '', 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');
    try {
      const response = await axios.post('/api/register', form);
      setSuccess(response.data.message);

      setTimeout(() => {
        if(success) {
          window.location.href = '/auth/login';
        }
      }, 3000);
    } catch (err) {
        let errorMessage = 'Something went wrong';
  
        if (err.response?.data?.message) {
          const errorArray = err.response.data.message;
  
          if (Array.isArray(errorArray)) {
            errorMessage = errorArray.map((errorItem) => {
              return typeof errorItem.msg === 'string' ? errorItem.msg : JSON.stringify(errorItem.msg);
            }).join(' and ');
          }
        }
  
        setError(errorMessage); 
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded shadow-md w-full max-w-md dark:bg-slate-800">
        <h1 className="text-xl font-bold mb-4">Register</h1>
        {error && <p className="text-red-600 dark:text-red-700  text-sm">{error}</p>}
        {success && <p className="text-blue-600 dark:text-blue-700 text-sm">{success}</p>}
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
            className="w-full border rounded px-3 py-2 mt-1 dark:bg-slate-700 dark:border-gray-600"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1 dark:bg-slate-700 dark:border-gray-600"
          >
            <option value="" disabled hidden>Pilih role</option>
            <option value="admin">Admin</option>
            <option value="kasir">Kasir</option>
            <option value="pelayan">Pelayan</option>
          </select>
        </div>
        <p className="text-sm font-bold mb-3">Already have an account? <a href="/auth/login" className="text-blue-500 text-md font-bold">Login</a></p>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded w-full mb-4 hover:bg-gray-800 transition duration-300 dark:text-black dark:bg-white dark:hover:bg-gray-200 font-semibold"
        >
          Register
        </button>
      </form>

    </div>
  );
}
