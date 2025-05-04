"use client";
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import axios from 'axios';


export default function OrderList() {
    const [orders, setOrders] = useState([]);
    const [orderType, setOrderType] = useState(''); 
    const [decoded, setDecoded] = useState(null);
    const router = useRouter();

    const checkToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setDecoded(decoded);

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
        checkToken();
    }, []);

    
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/api/pendingOrder/', {
                    params: { order_type: orderType } 
                });
                setOrders(response.data.orders);
            } catch (err) {
                console.error(err);
            }
        };

        fetchOrders();
    }, [orderType]);  

    const handleCancelOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/order/${orderId}/cancel`, {}, {
                withCredentials : true,
                headers: { Authorization: `Bearer ${token}` }
            });

            
            const response = await axios.get('/api/order/');
            setOrders(response.data.orders);
        } catch (error) {
            console.error('Cancel order error:', error);
            alert('Gagal membatalkan pesanan');
        }
    };

    const handleEditOrder = (orderId) => {
        router.push(`/editOrder/${orderId}`);
    };

    const handlePayOrder = (orderId) => {
        router.push(`/payment/${orderId}`);
    };

    if (!decoded) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <div className="container mx-auto mt-16 p-6 space-y-8">
                <h1 className="text-4xl font-bold text-center text-black dark:text-white mb-6">Order List</h1>

                {decoded.role === 'kasir' && (
                <div className="flex justify-center space-x-6 mb-6">
                    <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg p-2 dark:bg-black dark:border-gray-600 dark:text-white"
                    >
                    <option value="">All Order Types</option>
                    <option value="dine-in">Dine-in</option>
                    <option value="take-away">Take-away</option>
                    </select>
                </div>
                )}

                {Array.isArray(orders) && orders.length > 0 ? (
                orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-lg shadow-lg p-6 space-y-6 border border-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-black dark:text-white">ID Pemesan: {order.id}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                    </div>

                    <div className="space-y-2 text-gray-800 dark:text-gray-300">
                        <p><strong>Order dari:</strong> {order.user_name}</p>
                        <p><strong>Tipe Pesanan:</strong> {order.order_type}</p>
                        {order.order_type === 'dine-in' && <p><strong>Meja:</strong> {order.table_number}</p>}
                        <p><strong>Total Harga:</strong> Rp {parseFloat(order.total_amount).toLocaleString()}</p>
                        <p><strong>Status:</strong> {order.status}</p>
                    </div>

                    <div className="flex justify-end space-x-4 mt-4">
                        {decoded.role === 'kasir' ? (
                        <>
                            <button 
                            className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-300 dark:bg-white dark:text-black dark:hover:bg-gray-200 "
                            onClick={() => handlePayOrder(order.id)}
                            >
                            Bayar
                            </button>
                            <button 
                            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 dark:bg-red-700 dark:hover:bg-red-600"
                            onClick={() => handleCancelOrder(order.id)}
                            >
                            Batalkan
                            </button>
                        </>
                        ) : null}
                        <button 
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 dark:bg-blue-700 dark:hover:bg-blue-600"
                        onClick={() => handleEditOrder(order.id)}
                        >
                        Edit
                        </button>
                    </div>
                    </div>
                ))
                ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">No orders available</div>
                )}
            </div>
        </div>

    );
}
