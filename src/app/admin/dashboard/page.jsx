"use client";
import { useRouter } from "next/navigation";
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from "react";
import axios from 'axios';
import IconsList from "../../../../public/assets/icons/IconsList";
import Link from "next/link";
import StatCard from "./components/StatCard";
import { useFetchWithAuth } from "@/app/hooks/useFetchWithAuth";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard({darkMode}) {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [chart, setChart] = useState(null);
    const {fetchWithAuth} = useFetchWithAuth();

    
    const fetchdataChart = async () => {
        const handleChartData = (data)=>{
            const labels = data.map((item) => item.date);
            const revenueData = data.map((item) => item.total_revenue);

            setChart({
                labels : labels,
                datasets: [
                    {
                        label: 'Pendapatan',
                        data: revenueData,
                        backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                        borderColor: darkMode ? '#FFFFFF' : '#000000',
                        borderWidth: 1,
                    },
                ],
            })
        }

        await fetchWithAuth('/api/chart', handleChartData);
    };

    useEffect(() => {
        fetchWithAuth('/api/dashboard', setData);
        fetchdataChart();
    }, [darkMode]); 

    const chartOptions = {
        borderRadius: 7,
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
        },
        plugins: {
            legend: {
                labels: {
                    color: darkMode ? '#FFFFFF' : '#000000',
                    font: {
                        size: 12
                    }
                },
                title: {
                    color: darkMode ? '#FFFFFF' : '#000000'
                }
            },
            tooltip: {
                backgroundColor: darkMode ? '#1f2937' : '#FFFFFF',
                titleColor: darkMode ? '#FFFFFF' : '#000000',
                bodyColor: darkMode ? '#FFFFFF' : '#000000',
                borderColor: darkMode ? '#FFFFFF' : '#000000',
                borderWidth: 1
            },
            title: {
                color: darkMode ? '#FFFFFF' : '#000000'
            }
        },
        scales: {
            x: {
                ticks: {
                    color: darkMode ? '#FFFFFF' : '#000000',
                },
                grid: {
                    color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    borderColor: darkMode ? '#FFFFFF' : '#000000',
                },
                border: {
                    color: darkMode ? '#FFFFFF' : '#000000'
                }
            },
            y: {
                ticks: {
                    color: darkMode ? '#FFFFFF' : '#000000',
                },
                grid: {
                    color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    borderColor: darkMode ? '#FFFFFF' : '#000000',
                },
                border: {
                    color: darkMode ? '#FFFFFF' : '#000000'
                }
            },
        },
    };

    return (
        <div className="min-h-screen w-full flex bg-white text-black dark:bg-black dark:text-white">
            <div className="md:w-4/5 lg:w-4/5 ml-auto md:overflow-hidden w-full md:p-8 p-4">
                <div className="text-center mb-10">
                    <h1 className="font-bold text-3xl my-6">Dashboard Admin</h1>
                </div>

                <div className="grid lg:grid-cols-4 w-full mx-auto md:gap-8 gap-4 grid-cols-2 shadow-md p-4">
                    
                    <StatCard link="/admin/users" title = "Total Pengguna" icon={<IconsList.UserIcons />} value = {data.totalUsers} />

                    <StatCard link="/admin/orders" title = "Total Pesanan" icon={<IconsList.OrderIcons />} value = {data.totalOrders} />
                    
                    <StatCard link= "admin/menu" title = "Total Menu" icon={<IconsList.OrderIcons />} value = {data.totalMenu} />
                    
                    <StatCard link="admin/payments" title = "Total Pemasukan" icon={<IconsList.IncomsIcons />} value = {`Rp ${data.totalPayments}`} />

                    <StatCard link="/admin/tables" title = "Total Meja" icon={<IconsList.TabelIcons />} value = {data.totalTables} />

                </div>

                <div className="container mx-auto shadow-lg md:p-8 p-4 my-10 w-full bg-white dark:bg-gray-800">
                    <h2 className="text-xl font-bold mb-6">Total Revenue Per Day</h2>
                    {chart ? (
                        <div className="md:w-full md:h-96 w-full h-80">
                            <Bar
                                data={chart}
                                options={chartOptions}
                            />
                        </div>
                    ) : (
                        <p className="text-center text-gray-400">Loading chart...</p>
                    )}
                </div>
            </div>
        </div>
    );
}