"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from 'axios';
import Link from "next/link";
import Alert from "@/components/alert/Alert";

export default function transaction({ darkMode }) {
    const router = useRouter()
    const [transaction, setTransaction] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [showModal,setShowModal] = useState(false);
    const [modalMode,setModalMode] = useState('');
    const [currentTransaction, setCurrentTransaction] = useState(null)
    const [searchTerm,setSearchTerm] = useState('');
    const [currentPage,setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [error,setError] = useState('');
    const [success,setSuccess] = useState('');

    const featchTransection = async()=>{
        setIsLoading(true);
        const token = localStorage.getItem('token')
        try{
            const response = await axios.get('/api/transactions/',{
                headers :{
                    Authorization : `Bearer ${token}` 
                },
                withCredentials:true,
            });
            setTransaction(response.data.transactions);
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

                    const response = await axios.get('/api/transactions/',{
                        headers :{
                            Authorization : `Bearer ${token}` 
                        },
                        withCredentials:true,
                    });
                    setTransaction(response.data.transactions);
                    setIsLoading(false);
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError);
                    router.push('/auth/login');
                }
            }else{
                console.error('Error fetching transaction:', err);
                setIsLoading(false);
            }
        }
    };

    useEffect(()=>{
        featchTransection();
    },[])

    const openDetailModal=(trans)=>{
        setCurrentTransaction(trans);
        setModalMode('detail');
        setShowModal(true);
    }

    const filteredTransactions = (Array.isArray(transaction)?transaction:[]).filter(trans =>
        String(trans.order_id)?.toLowerCase().includes(searchTerm.toLowerCase())||
        trans.amount_paid?.toLowerCase().includes(searchTerm.toLowerCase())||
        trans.change_given?.toLowerCase().includes(searchTerm.toLowerCase())||
        trans.payment_method?.toLowerCase().includes(searchTerm.toLowerCase())
    )


    const indexOfLastTransaction = currentPage * itemsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction,indexOfLastTransaction);
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return  (
        <div className="min-h-screen w-full flex bg-white text-black dark:bg-black dark:text-white">
            <div className="md:w-4/5 lg:w-4/5 ml-auto md:overflow-hidden w-full md:p-8 p-4">
                <div className="text-center mb-6">
                    <h1 className="font-bold text-3xl my-6">Manajemen Transaksi</h1>
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
                        Total Pemasukan :  
                        <span className="font-bold ml-2">
                            {
                                transaction
                                    .reduce((total, trans) => total + parseFloat(trans.amount_paid), 0)
                                    .toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
                            }
                        </span>
                    </p>
                    
                </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto rounded-lg shadow-lg">
                        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs md:text-xl">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700">
                                    <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">#</th>
                                    <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Order_id</th>
                                    <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Amount Paid</th>
                                    <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Change given</th>
                                    <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Payment Method</th>
                                    <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="py-4 text-center">Memuat data...</td>
                                    </tr>
                                ) : currentTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-4 text-center">Tidak ada data transaksi</td>
                                    </tr>
                                ) : (
                                    currentTransactions.map((trans, index) => (
                                        <tr key={trans.id} className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'} hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150`}>
                                            <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">{indexOfFirstTransaction + index + 1}</td>
                                            <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 ">{trans.order_id}</td>
                                            <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">{trans.amount_paid}</td>
                                            <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">{trans.change_given}</td>
                                            <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">{trans.payment_method}</td>
                                            <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => openDetailModal(trans)}
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
                

                {modalMode === 'detail' && currentTransaction && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                            {/* Modal Header */}
                            <div className="border-b border-gray-200 dark:border-gray-700 p-4 relative">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Detail Transaksi
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
                                    <div className="mb-4">
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="order_id">
                                            Order ID
                                        </label>
                                        <input
                                            id="order_id"
                                            name="order_id"
                                            type="text"
                                            value={currentTransaction.order_id}
                                            disabled
                                            className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-blue-100 dark:bg-blue-900 text-gray-900 dark:text-white"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="amount_paid">
                                            Amount Paid
                                        </label>
                                        <input
                                            id="amount_paid"
                                            name="amount_paid"
                                            type="text"
                                            value={currentTransaction.amount_paid}
                                            disabled
                                            className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-green-100 dark:bg-green-900 text-gray-900 dark:text-white"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="change_given">
                                            Change Given
                                        </label>
                                        <input
                                            id="change_given"
                                            name="change_given"
                                            type="text"
                                            value={currentTransaction.change_given}
                                            disabled
                                            className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-yellow-100 dark:bg-yellow-800 text-gray-900 dark:text-white"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="payment_method">
                                            Payment Method
                                        </label>
                                        <input
                                            id="payment_method"
                                            name="payment_method"
                                            type="text"
                                            value={currentTransaction.payment_method}
                                            disabled
                                            className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-purple-100 dark:bg-purple-900 text-gray-900 dark:text-white capitalize"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="created_at">
                                            Created At
                                        </label>
                                        <input
                                            id="created_at"
                                            name="created_at"
                                            type="text"
                                            value={new Date(currentTransaction.created_at).toLocaleString()}
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