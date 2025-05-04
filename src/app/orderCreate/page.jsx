'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Alert from '@/components/alert/Alert';

export default function Checkout() {
    const [tableId, setTableId] = useState('');
    const [orderType, setOrderType] = useState('dine-in');
    const [cart, setCart] = useState([]);
    const [tables, setTables] = useState([]);
    const [alert, setAlert] = useState({
        show : false,
        type : '',
        message : ''
    });
    const router = useRouter();

    const showAlert = (type, message) => {
        setAlert({
            show : true,
            type : type,
            message : message
        })
    }

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart'));
        if (!storedCart || storedCart.length === 0) {
            router.push('/menulist'); 
        } else {
            setCart(storedCart);
        }
    }, []);

    
    useEffect(() => {
        axios.get('/api/available_Table/')
            .then((response) => {
                setTables(response.data);
            })
            .catch((err) => {
                console.error("Error fetching tables", err);
            });
    }, []);

    const handleOrderSubmit = async () => {
        if (cart.length === 0) {
            showAlert('error', 'Please fill in all fields and select items.');
            return;
        }

        if (orderType === 'take-away') {
            setTableId(null);
        }

        if (orderType === 'dine-in' && !tableId) {
            showAlert('error','Please select a table.');
            return;
        }

        const orderData = {
            tableId,
            orderType,
            items: cart.map(item => ({
                menuItemId: item.id,
                quantity: item.quantity,
                price: item.price
            }))
        };

        try {
            const token = localStorage.getItem('token');
            const decoded = jwtDecode(token);
            if (!token) {
                router.push('/auth/login');
                return;
            }

            if (decoded.role === 'admin') {
                router.push('/admin/dashboard');
            }

            const response = await axios.post('/api/order/add', orderData, {
                withCredentials : true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            showAlert('success',response.data.message || 'Order created successfully!');
            localStorage.removeItem('cart');
            setTimeout(() => {
                router.push('/orderlist');
            }, 1500);
        } catch (err) {
            const token = localStorage.getItem('token');
            if (err.response && err.response.status === 401) {
                try {
                    const refreshResponse = await axios.post('/api/refresh');
                    const newToken = refreshResponse.data.token;
                    localStorage.setItem('token', newToken);

                    const retryResponse = await axios.post('/api/order/add', orderData, {
                        withCredentials : true,
                        headers: {
                            Authorization: `Bearer ${newToken}`,
                        },
                    });
                    showAlert('success',retryResponse.data.message || 'Order created successfully!');
                    localStorage.removeItem('cart');
                    setTimeout(() => {
                        router.push('/orderlist');
                    }, 1500);
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError);
                    router.push('/auth/login');
                }
            } else {
                console.error('Error:', err);
                showAlert('error','Error creating order.');
            }
        }
    };

    const handleQuantityChange = (id, newQuantity) => {
        setCart(prevCart => {
            const updatedCart = prevCart.map(item => {
                if (item.id === id) {
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
            localStorage.setItem('cart', JSON.stringify(updatedCart)); 
            return updatedCart;
        });
    };

    const handleIncrement = (id) => {
        setCart(prevCart => {
            const updatedCart = prevCart.map(item => {
                if (item.id === id && item.quantity < 10) { 
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });
            localStorage.setItem('cart', JSON.stringify(updatedCart)); 
            return updatedCart;
        });
    };

    const handleDecrement = (id) => {
        setCart(prevCart => {
            const updatedCart = prevCart.map(item => {
                if (item.id === id && item.quantity > 1) { 
                    return { ...item, quantity: item.quantity - 1 };
                }
                return item;
            });
            localStorage.setItem('cart', JSON.stringify(updatedCart)); 
            return updatedCart;
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    return (
        <>
        {alert.show && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({...alert, show : false})} />}
        <div className="max-w-lg md:max-w-xl mx-auto p-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg mt-24">
            <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-6">Checkout</h2>

            <div className="mb-6">
                <label htmlFor="orderType" className="block text-lg font-medium text-gray-700 dark:text-gray-100">Order Type</label>
                <select
                    id="orderType"
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="w-full px-4 py-3 mt-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:focus:ring-blue-700"
                >
                    <option value="dine-in">Dine-in</option>
                    <option value="take-away">Takeaway</option>
                </select>
            </div>

            {orderType === 'dine-in' && (
                <div className="mb-6">
                    <label htmlFor="tableId" className="block text-lg font-medium text-gray-700 dark:text-gray-100">Select Table</label>
                    <select
                        id="tableId"
                        value={tableId}
                        onChange={(e) => setTableId(e.target.value)}
                        className="w-full px-4 py-3 mt-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:focus:ring-blue-700"
                    >
                        <option value="">Select Table</option>
                        {tables.map((table) => (
                            <option key={table.id} value={table.id}>
                                {table.table_number}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-4">Cart Items</h3>
                <ul className='divide-y divide-gray-200 dark:divide-gray-600'>
                    {cart.map(item => (
                        <li key={item.id} className="flex flex-wrap items-center justify-between py-3">
                            <div className="flex sm:flex-row flex-col items-center space-x-4 sm:space-x-4 sm:space-y-0 space-y-3 flex-1 min-w-0">

                                <img
                                    src={`/public/assets/img/${item.image}`}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                                <span className="text-lg font-medium truncate sm:block">{item.name}</span>
                            </div>

                            <div className="flex items-center space-x-2 mt-2 md:mt-0">
                                <button
                                    onClick={() => handleDecrement(item.id)}
                                    className="bg-red-600 text-white font-bold px-2 py-1 rounded-full hover:bg-red-700 transition duration-300 text-sm dark:bg-red-700 dark:hover:bg-red-600"
                                >-</button>

                                <input
                                    type="number"
                                    value={item.quantity}
                                    readOnly
                                    className="w-12 text-center border rounded-lg text-sm dark:bg-gray-700"
                                />

                                <button
                                    onClick={() => handleIncrement(item.id)}
                                    className="bg-blue-600 text-white font-bold px-2 py-1 rounded-full hover:bg-blue-700 transition duration-300 text-sm dark:bg-blue-700 dark:hover:bg-blue-600"
                                >+</button>

                                <span className="text-lg ml-3 font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>



            <div className="mt-8">
                <button
                    onClick={handleOrderSubmit}
                    className="w-full bg-black text-white dark:bg-white dark:text-black py-3 rounded-lg  hover:bg-gray-800 dark:hover:bg-gray-200 transition duration-300 font-semibold"
                >
                    Submit Order
                </button>
            </div>
        </div>

        </>
    );
}
