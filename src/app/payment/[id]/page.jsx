'use client';
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { jwtDecode } from "jwt-decode";
import Alert from "@/components/alert/Alert";

export default function Payment({ params }) {
    const [order, setOrder] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amountPaid, setAmountPaid] = useState('');
    const [error, setError] = useState('');
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [isPaid, setIsPaid] = useState(false);
    const router = useRouter();

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
    };

    const { id } = React.use(params);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`/api/order/${id}`);
                setOrder(response.data);
            } catch (err) {
                console.error('Error fetching order:', err);
                setError('Gagal memuat order');
            }
        };

        if (id) fetchOrder();
    }, [id]);

    const handleSubmit = async () => {
        setError('');
        const totalAmount = order.order.total_amount;
        const parsedAmountPaid = parseFloat(amountPaid);

        if (isNaN(parsedAmountPaid) || parsedAmountPaid < totalAmount) {
            setError(`Pembayaran minimal Rp ${totalAmount.toLocaleString()}`);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const decoded = jwtDecode(token);

            if (!token) return router.push('/auth/login');
            if (decoded.role === 'admin') return router.push('/admin/dashboard');
            if (decoded.role === 'pelayan') return router.push('/menulist');

            await axios.post(`/api/order/${id}/payment`, {
                orderId: id,
                paymentMethod,
                amountPaid: parsedAmountPaid
            }, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });

            showAlert('success', `Pembayaran berhasil!\nKembalian: Rp ${(parsedAmountPaid - totalAmount).toLocaleString()}`);
            setIsPaid(true); // Show print button

        } catch (err) {
            if (err.response?.status === 401) {
                try {
                    const refreshResponse = await axios.post('/api/refresh');
                    const newToken = refreshResponse.data.token;
                    localStorage.setItem('token', newToken);

                    await axios.post(`/api/order/${id}/payment`, {
                        orderId: id,
                        paymentMethod,
                        amountPaid: parsedAmountPaid
                    }, {
                        withCredentials: true,
                        headers: { Authorization: `Bearer ${newToken}` }
                    });

                    showAlert('success', `Pembayaran berhasil!\nKembalian: Rp ${(parsedAmountPaid - totalAmount).toLocaleString()}`);
                    setIsPaid(true);
                } catch (refreshError) {
                    router.push('/auth/login');
                }
            } else {
                setError('Gagal memproses pembayaran');
                showAlert('error', 'Error processing payment.');
            }
        }
    };

    const handlePrint = () => {
        window.onafterprint = () => {
            router.push('/orderlist');
        };
        window.print();
    };

    if (!order) {
        return <div className="flex justify-center items-center h-screen text-gray-800 dark:text-white dark:bg-black">Loading...</div>;
    }

    const orderData = order.order;
    const totalAmount = parseFloat(orderData.total_amount);
    const changeGiven = parseFloat(amountPaid) - totalAmount;

    return (
        <>
            {alert.show && <Alert type={alert.type} message={alert.message} duration={1000} onClose={() => setAlert({ ...alert, show: false })} />}
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black p-4">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-10">
                    <h1 className="text-3xl font-semibold text-center mb-6 text-black dark:text-white">Pembayaran Order</h1>

                    <div className="mb-6 bg-slate-50 dark:bg-slate-600 p-4 rounded-lg shadow-sm">
                        <p className="text-gray-800 dark:text-gray-400"><span className="font-semibold">Order ID:</span> {orderData.id}</p>
                        <p className="text-gray-800 dark:text-gray-400"><span className="font-semibold">Total Tagihan:</span> <span className="text-blue-600 dark:text-blue-400 font-bold">Rp {totalAmount.toLocaleString()}</span></p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-800 dark:text-gray-100 mb-2 font-medium">Metode Pembayaran</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-800"
                        >
                            <option value="cash">Tunai (Cash)</option>
                            <option value="card">Kartu (Card)</option>
                            <option value="other">Lainnya</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-800 dark:text-gray-100 mb-2 font-medium">Jumlah Dibayar</label>
                        <input
                            type="number"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
                            placeholder={`Minimal Rp ${totalAmount.toLocaleString()}`}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-100 dark:bg-gray-800 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-600 px-4 py-3 rounded relative">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-black text-white dark:bg-white dark:text-black py-3 rounded-md hover:bg-gray-800 dark:hover:bg-slate-100 transition duration-300"
                    >
                        Bayar Sekarang
                    </button>

                    {isPaid && (
                        <button
                            onClick={handlePrint}
                            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
                        >
                            Cetak Invoice
                        </button>
                    )}
                </div>
            </div>

            {/* PRINTABLE INVOICE */}
            <div
                id="invoice"
                className="p-4 text-black bg-white font-sans w-[80mm] mx-auto border border-gray-400 shadow-sm rounded-sm"
            >
                <div className="text-center mb-4">
                    <h2 className="text-xl font-semibold">🍽️ Nama Restoran</h2>
                    <p className="text-xs text-gray-600">Jl. Contoh No.123, Kota ABC</p>
                    <p className="text-xs text-gray-600 mb-2">Telp: (021) 123456</p>
                    <hr className="border-dashed border-black my-2" />
                </div>

                <div className="text-sm mb-3">
                    <div className="flex justify-between">
                        <span><strong>Order ID:</strong> {orderData.id}</span>
                        <span><strong>Tanggal:</strong> {new Date(orderData.created_at).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span><strong>Meja:</strong> {orderData.table_number}</span>
                        <span><strong>Kasir:</strong> {orderData.user_name}</span>
                    </div>
                    <div className="mt-2">
                        <strong>Jenis Order:</strong> {orderData.order_type}
                    </div>
                </div>

                <hr className="border-black my-3" />

                <div className="text-sm font-medium text-right mb-2">
                    <strong>Total: Rp {totalAmount.toLocaleString()}</strong>
                </div>

                <div className="text-sm font-medium text-right mb-2">
                    <strong>Bayar: Rp {amountPaid}</strong>
                </div>
                
                <div className="text-base font-semibold text-right mb-2">
                    <strong>Kembalian: Rp {changeGiven.toLocaleString()}</strong>
                </div>

                <hr className="border-black my-3" />

                <div className="text-center mt-4 text-xs italic">
                    ✨ Terima kasih atas kunjungan Anda ✨
                </div>
            </div>
        </>
    );
}
