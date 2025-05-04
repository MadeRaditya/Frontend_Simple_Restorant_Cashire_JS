'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Alert from '@/components/alert/Alert';

const EditOrder = ({ params }) => {
    const [order, setOrder] = useState(null);
    const [menu, setMenu] = useState([]);
    const [updatedOrder, setUpdatedOrder] = useState([]);
    const [alert,setAlert] = useState({
        show : false,
        type : '',
        message : ''
    });
    const router = useRouter();

    const ShowAlert = (type, message) => {
        setAlert({
            show : true,
            type : type,
            message : message
        })
    }

    const { id } = React.use(params);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`/api/order/${id}`);
                setOrder(response.data);
                const mappedItems = response.data.items.map(item => ({
                    menuItemId: item.menu_item_id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    category: item.category
                }));
                setUpdatedOrder(mappedItems);
            } catch (err) {
                console.error('Error fetching order:', err);
            }
        };

        const fetchMenu = async () => {
            try {
                const response = await axios.get('/api/menu');
                setMenu(response.data);
            } catch (err) {
                console.error('Error fetching menu:', err);
            }
        };

        if (id) {
            fetchOrder();
            fetchMenu();
        }
    }, [id]);

    const handleQuantityChange = (menuItemId, newQuantity) => {
        if (newQuantity > 0) {
            setUpdatedOrder(prevOrder =>
                prevOrder.map(item =>
                    item.menuItemId === menuItemId ? { ...item, quantity: newQuantity } : item
                )
            );
        } else {
            setUpdatedOrder(prevOrder => 
                prevOrder.filter(item => item.menuItemId !== menuItemId)
            );
        }
    };

    const handleAddNewItem = (menuItem) => {
        if (!menuItem.id) {
            console.error("Menu item ID is missing");
            return;
        }

        const existingItem = updatedOrder.find(item => item.menuItemId === menuItem.id);

        if (existingItem) {
            handleQuantityChange(menuItem.id, existingItem.quantity + 1);
        } else {
            setUpdatedOrder(prevOrder => [
                ...prevOrder,
                { 
                    menuItemId: menuItem.id,
                    name: menuItem.name,
                    quantity: 1,
                    price: menuItem.price,
                    category: menuItem.category,
                }
            ]);
        }
    };

    const handleOrderSubmit = async () => {
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
            if(decoded.role === 'pelayan') {
                router.push('/orderlist');
            }
            const response = await axios.put(`/api/order/${id}/update`, { 
                items: updatedOrder.map(item => ({
                    menuItemId: item.menuItemId,
                    quantity: item.quantity,
                    price: item.price
                })) 
            }, {
                withCredentials : true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            ShowAlert('success',response.data.message || 'Order updated successfully!');
            setTimeout(() => {
                router.push('/orderlist'); 
            },1500);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                const token = localStorage.getItem('token');
                try {
                    const refreshResponse = await axios.post('/api/refresh/');
                    const newToken = refreshResponse.data.token;
                    localStorage.setItem('token', newToken);
                    const retryResponse = await axios.put(`/api/order/${id}/update`, { 
                        items: updatedOrder.map(item => ({
                            menuItemId: item.menuItemId,
                            quantity: item.quantity,
                            price: item.price
                        })) 
                    }, {
                        withCredentials : true,
                        headers: {
                            Authorization: `Bearer ${newToken}`,
                        },
                    });
                    ShowAlert('success',retryResponse.data.message || 'Order updated successfully!');
                    setTimeout(() => {
                        router.push('/orderlist');
                    },1500);
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError);
                    router.push('/auth/login');
                }
            } else {
                console.error('Error:', err);
                ShowAlert('error','Error updating order.');
            }
        }
    };

    if (!order || !menu.length) {
        return <p>Loading...</p>;
    }

    const orders = order.order;

    return (
        <>
        {alert.show && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({...alert, show : false})} />}
        <div className="max-w-xl mx-auto p-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-24">
            <h2 className="text-3xl font-semibold text-center mb-6 text-black dark:text-white">Edit Order</h2>

            <div className="mb-6 bg-slate-50 dark:bg-gray-600 py-4 px-2 rounded-lg">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-50">Current Order Details</h3>
                <p className="text-md text-gray-800 dark:text-gray-50">Order ID: <span className="font-medium">{orders.id}</span></p>
                <p className="text-md text-gray-800 dark:text-gray-50">Order Type: <span className="font-medium">{orders.order_type}</span></p>
                {orders.order_type === 'dine-in' && (
                    <p className="text-md text-gray-800 dark:text-gray-50">Table Number: <span className="font-medium">{orders.table_number}</span></p>
                )}
                <p className="text-md text-gray-800 dark:text-gray-50">Total Amount: <span className="font-medium">{orders.total_amount}</span></p>
            </div>

            <div className="mb-10">
                <h3 className="text-2xl font-semibold text-black dark:text-white">Current Order Items</h3>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {updatedOrder.map(item => (
                        <li key={item.menuItemId} className="flex justify-between items-center py-3">
                            <div className="flex-1 flex items-center space-x-4">
                                
                                <span className="text-lg font-medium truncate">{item.name}</span>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleQuantityChange(item.menuItemId, item.quantity - 1)}
                                        className="bg-red-600 text-white dark:text-gray-100 font-bold px-3 py-1 rounded-full hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 transition duration-300"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item.menuItemId, parseInt(e.target.value))}
                                        min="1"
                                        className="w-12 text-center text-black border rounded-lg text-sm dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                                    />
                                    <button
                                        onClick={() => handleQuantityChange(item.menuItemId, item.quantity + 1)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-gray-100 transition duration-300"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <span className="text-lg font-semibold">{item.price * item.quantity}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-semibold text-black dark:text-white">Add New Items</h3>
                <ul className="divide-y divide-gray-200">
                    {menu.filter(item => !updatedOrder.some(orderItem => orderItem.menuItemId === item.id)).map(item => (
                        <li key={item.id} className="flex justify-between items-center py-3">
                            <span className="text-md font-medium truncate">{item.name}</span>
                            <button
                                onClick={() => handleAddNewItem(item)}
                                className="bg-gray-800 text-md text-white px-2 py-1 rounded-lg hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-900 transition duration-300"
                            >
                                Add to Order
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-8">
                <button
                    onClick={handleOrderSubmit}
                    className="w-full bg-black text-white dark:bg-white dark:text-black font-semibold py-3 rounded-lg hover:bg-black-900 dark:hover:bg-gray-100 transition duration-300"
                >
                    Submit Updated Order
                </button>
            </div>
        </div>
        </>
    );
};

export default EditOrder;
