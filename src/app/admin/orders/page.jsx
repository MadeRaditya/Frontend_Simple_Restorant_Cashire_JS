"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from 'axios';
import Link from "next/link";
import Alert from "@/components/alert/Alert";

export default function transaction({ darkMode }) {
    const router = useRouter()
    const [orders, setOrders] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [showModal,setShowModal] = useState(false);
    const [modalMode,setModalMode] = useState('');
    const [currentOrder, setCurrentOrder] = useState(null)
    const [searchTerm,setSearchTerm] = useState('');
    const [currentPage,setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [error,setError] = useState('');
    const [success,setSuccess] = useState('');

    const featchOrders = async()=>{
        setIsLoading(true);
        const token = localStorage.getItem('token')
        try{
            const response = await axios.get('/api/order/',{
                headers :{
                    Authorization : `Bearer ${token}` 
                },
                withCredentials:true,
            });
            setOrders(response.data.orders);
            setIsLoading(false);
        }catch(err){
            if(err.response && err.response.status === 401){
                try {
                    const refreshResponse = await axios.post('/api/refresh',{},{
                        withCredentials:true,
                    })

                    const newToken = refreshResponse.data.token;

                    if(!newToken){
                        throw new Error('New token is empty')
                    }

                    localStorage.setItem('token',newToken);

                    const response = await axios.get('/api/order/',{
                        headers :{
                            Authorization : `Bearer ${token}` 
                        },
                        withCredentials:true,
                    });
                    setOrders(response.data.orders);
                    setIsLoading(false);
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError);
                    router.push('/auth/login');
                }
            }else{
                console.error('Error fetching Orders:', err);
                setIsLoading(false);
            }
        }
    };

    useEffect(()=>{
        featchOrders();
    },[])

    const openDetailModal=(order)=>{
        setCurrentOrder(order);
        setModalMode('detail');
        setShowModal(true);
    }

    const filteredOrders = (Array.isArray(orders)?orders:[]).filter(order =>
        order.user_name?.toLowerCase().includes(searchTerm.toLowerCase())||
        order.order_type?.toLowerCase().includes(searchTerm.toLowerCase())||
        (order.table_number? order.table_number?.toLowerCase(): 'bawa pulang').includes(searchTerm.toLowerCase())||
        String(order.total_amount)?.toLowerCase().includes(searchTerm.toLowerCase())||
        order.status?.toLowerCase().includes(searchTerm.toLowerCase())
    )


    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder,indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return  (
        <div className="min-h-screen w-full flex bg-white text-black dark:bg-black dark:text-white">
            <div className="md:w-4/5 lg:w-4/5 ml-auto md:overflow-hidden w-full md:p-8 p-4">
                <div className="text-center mb-6">
                    <h1 className="font-bold text-3xl my-6">Manajemen Pesanan</h1>
                </div>

                {error && <Alert 
                type="error"
                message={error}
                onClose={()=>setError(null)}/>
                }
                {success && <Alert 
                type="success"
                message={success}
                onClose={()=>setSuccess(null)}/>
                }

                <div className="flex flex-col md:flex-row justify-between items-center mb-6 ">
                    <div className="w-full md:w-1/2 mb-4 md:mb-0">
                        <div className="relative z-9">
                            <input
                                type="text"
                                placeholder="Cari user..."
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                
                            />
                            <svg 
                                className="w-5 h-5 absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                    

                    <p
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 dark:bg-blue-700 dark:hover:bg-blue-600 flex items-center"
                    >
                        Total Pesanan : {orders.length}
                    </p>
                </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto rounded-lg shadow-lg">
                        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs md:text-xl">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700">
                                    <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">#</th>
                                    <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Pemesan</th>
                                    <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Tipe pesanan</th>
                                    <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Nomor Meja</th>
                                    <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Total Pesanan</th>
                                    <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Status</th>
                                    <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="py-4 text-center">Memuat data...</td>
                                    </tr>
                                ) : currentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-4 text-center">Tidak ada data transaksi</td>
                                    </tr>
                                ) : (
                                    currentOrders.map((order, index) => (
                                        <tr key={order.id} className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'} hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150`}>
                                            <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">{indexOfFirstOrder + index + 1}</td>
                                            <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 ">{order.user_name}</td>
                                            <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">{order.order_type}</td>
                                            <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    order.table_number? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                    :'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                }`}>
                                                    {order.table_number ? order.table_number : 'Bawa Pulang'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">{order.total_amount}</td>
                                            <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${
                                                    order.status === 'pending'
                                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                                    : order.status === 'completed'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : order.status === 'cancelled'
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    : ''
                                                }`}
                                                >
                                                {order.status}
                                            </span>

                                            </td>
                                            <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => openDetailModal(order)}
                                                        className="bg-blue-500 text-white p-1.5 rounded-md hover:bg-blue-600 transition duration-200"
                                                        title="Detail"
                                                        >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down" viewBox="0 0 16 16"> <path d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z"/> </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 &&(
                        <div className="flex justify-center mt-6">
                            <nav className="flex items-center space-x-1">
                                <button
                                    onClick={()=> paginate(Math.max(1,currentPage-1))}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-2 rounded-md ${currentPage === 1 ?  'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                                >
                                    &laquo;
                                </button>

                                {[...Array(totalPages).keys()].map(number =>(
                                    <button
                                        key={number+1}
                                        onClick={()=> paginate(number+1)}
                                        className={`px-3 py-2 rounded-md ${
                                            currentPage === number + 1
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {number + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={()=> paginate(Math.min(totalPages,currentPage+1))}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-2 rounded-md ${
                                        currentPage === totalPages
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}>
                                    &raquo;
                                </button>
                            </nav>
                        </div>
                    )}
                

                {modalMode === 'detail' && currentOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                        {/* Modal Header */}
                        <div className="border-b border-gray-200 dark:border-gray-700 p-4 relative">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Detail Pesanana
                            </h3>
                            <button
                            onClick={() => setModalMode("")}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                            >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4">
                            <form>
                            {/* Pemesan */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="order_id">
                                Order {`#${currentOrder.id}`}
                                </label>
                                <input
                                id="pemesan"
                                name="pemesan"
                                type="text"
                                value={currentOrder.user_name}
                                disabled
                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-blue-100 dark:bg-blue-900 text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Tipe Pesanan */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="order_type">
                                Tipe Pesanan
                                </label>
                                <input
                                id="order_type"
                                name="order_type"
                                type="text"
                                value={currentOrder.order_type}
                                disabled
                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-green-100 dark:bg-green-900 text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Nomor Meja */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="table_number">
                                Nomor Meja
                                </label>
                                <input
                                id="table_number"
                                name="table_number"
                                type="text"
                                value={currentOrder.table_number ? currentOrder.table_number : 'Bawa Pulang'}
                                disabled
                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-yellow-100 dark:bg-yellow-800 text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Total Amount */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="total_amount">
                                Total
                                </label>
                                <input
                                id="total_amount"
                                name="total_amount"
                                type="text"
                                value={currentOrder.total_amount}
                                disabled
                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-indigo-100 dark:bg-indigo-900 text-gray-900 dark:text-white capitalize"
                                />
                            </div>

                            {/* Status */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="status">
                                Status
                                </label>
                                <input
                                id="status"
                                name="status"
                                type="text"
                                value={currentOrder.status}
                                disabled
                                className={`w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white capitalize ${
                                    currentOrder.status === 'pending'
                                    ? 'bg-yellow-100 dark:bg-yellow-800'
                                    : currentOrder.status === 'complete'
                                    ? 'bg-green-100 dark:bg-green-900'
                                    : currentOrder.status === 'cancelled'
                                    ? 'bg-red-100 dark:bg-red-900'
                                    : 'bg-gray-100 dark:bg-gray-700'
                                }`}
                                />
                            </div>

                            {/* Created At */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="created_at">
                                Created At
                                </label>
                                <input
                                id="created_at"
                                name="created_at"
                                type="text"
                                value={new Date(currentOrder.updated_at).toLocaleString()}
                                disabled
                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div className="flex justify-end mt-4 space-x-3">
                                <button
                                type="button"
                                onClick={() => setModalMode("")}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                >
                                Tutup
                                </button>
                            </div>
                            </form>
                        </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}