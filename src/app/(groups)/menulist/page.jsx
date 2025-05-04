'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext'; 
import CartSidebar from './components/CartSidebar';
import IconsList from '../../../../public/assets/icons/IconsList';

export default function MenuList() {
  const [menus, setMenus] = useState([]);
  const [category, setCategory] = useState('');
  const { cart, addToCart } = useCart(); 
  const [showCart, setShowCart] = useState(false);
  const [isClient,setIsClient] = useState(false);
  const router = useRouter();

  const fetchMenu = async (category) => {
    try {
      const response = await axios.get('/api/menu', { params: { category } });
      setMenus(response.data);
    } catch (err) {
      console.error('Error fetching menu:', err);
    }
  };

  const checkToken = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.role !== 'pelayan' && decoded.role !== 'kasir') {
        router.push('/auth/login');
      }
      if (decoded.role === 'admin') {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      router.push('/auth/login');
    }
  };

  useEffect(() => {
  setIsClient(true);
} ,[]);



  useEffect(() => {
    checkToken();
    fetchMenu(category);
  }, [category]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

    const handleShowCart = () => {
        setShowCart(true);
    };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className='flex justify-end mb-6'>
        <button
          onClick={handleShowCart}
          className="fixed bottom-10 right-5 flex items-center justify-center bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-900 transition duration-300 z-50 dark:bg-white dark:text-black dark:hover:bg-gray-600"
        >
          <IconsList.CartIcon/>
          {isClient && cart.length > 0 && (
            <p className="absolute top-0 right-0 bg-zinc-700 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-zinc-800 dark:bg-zinc-500 dark:text-black dark:hover:bg-zinc-400">
              {cart.length}
            </p>
          )}
        </button>
      </div>
      <CartSidebar showCart={showCart} onClose={() => setShowCart(false)} />
      <div className="container mt-20 mx-auto p-6">
        <h1 className="text-4xl font-extrabold text-center text-black mb-8 dark:text-white">Menu List</h1>

        <div className="mb-6 flex justify-center">
          <select
            value={category}
            onChange={handleCategoryChange}
            className="bg-white border border-gray-300 rounded-lg p-2 dark:bg-black dark:border-gray-600 dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="food">Food</option>
            <option value="beverage">Beverage</option>
            <option value="dessert">Dessert</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {menus.map((menu) => (
            <div key={menu.id} className="bg-white p-6 rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-105 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800">
              <img
                src={`/public/assets/img/${menu.image}`}
                alt={menu.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{menu.name}</h3>
                <p className="text-gray-600 text-sm dark:text-gray-400">{menu.description}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-300">Rp {menu.price}</p>
                <button
                  onClick={() => addToCart(menu)} 
                  className="bg-black text-white py-2 px-4 rounded-lg hover:bg-black-700 transition duration-300 dark:bg-white dark:text-black dark:hover:bg-gray-600"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
}
