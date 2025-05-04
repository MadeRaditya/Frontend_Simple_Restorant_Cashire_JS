'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/footer/Footer';
import { jwtDecode } from 'jwt-decode';
import IconsList from '../../public/assets/icons/IconsList';

export default function Home() {
    const router = useRouter();
    return (
        <>
        <Navbar />
        <div className={`bg-white dark:bg-black min-h-screen`}>
                <main className="max-w-screen-xl mx-auto py-16 px-6 mt-10">
                    {/* Hero Section */}
                    <section className="flex flex-col justify-center md:flex-row items-center gap-10 ">
                        <div className="text-center max-w-3xl md:text-left space-y-6">
                            <h1 className="md:text-5xl text-3xl text-center font-bold text-black dark:text-white leading-tight">
                                Manage Your Restaurant with Ease
                            </h1>
                            <p className="text-xl text-center text-gray-800 dark:text-gray-300">
                                Simplify your operations, manage your menu, and track orders efficiently.
                            </p>
                            <div className="flex justify-center">
                                <button
                                    className="bg-black  text-white dark:bg-white dark:text-gray-950 py-3 px-8 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 hover:scale-105 font-semibold transition duration-200"
                                    onClick={() => router.push('/auth/login')}
                                >
                                    Get Started
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-center text-center items-center text-black dark:text-white">
                            <IconsList.CashireIcons />
                        </div>
                    </section>

                    <section className="py-16  mt-2 md:mt-20 relative">
                        {/* SVG Background */}
                        <div className="top-0 left-0 right-0 h-64 absolute dark:bg-black rounded-lg bg-transparent">
                            <IconsList.CircleBackground />
                        </div>

                        <div className="bg-white dark:bg-gray-900 mt-10 py-16 px-6 rounded-lg shadow-md relative mx-auto max-w-screen">
                            <div className="text-center mb-4">
                                <h2 className="text-3xl font-semibold text-black dark:text-white mb-2">
                                    What We Offer
                                </h2>
                                <p className="text-lg text-gray-800 dark:text-gray-300">
                                    Discover the features that make our platform the best solution for managing your restaurant.
                                </p>
                            </div>
                            <div className="grid md:grid-cols-3 gap-8 px-6">
                                <div className="p-6 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition duration-200">
                                    <div className="text-4xl text-blue-600 mb-4">
                                        <i className="fas fa-utensils"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold text-black dark:text-white">
                                        Manage Menu
                                    </h3>
                                    <p className="text-gray-800 dark:text-gray-300">
                                        Easily update and manage your menu items from one place.
                                    </p>
                                    <a href="/menulist" className="text-blue-600 mt-4 inline-block">
                                        Learn More
                                    </a>
                                </div>

                                <div className="p-6 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition duration-200">
                                    <div className="text-4xl text-blue-600 mb-4">
                                        <i className="fas fa-clipboard-list"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold text-black dark:text-white">
                                        Track Orders
                                    </h3>
                                    <p className="text-gray-800 dark:text-gray-300">
                                        Keep track of your orders and manage customer requests effortlessly.
                                    </p>
                                    <a href="/orderlist" className="text-blue-600 mt-4 inline-block">
                                        Learn More
                                    </a>
                                </div>

                                <div className="p-6 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition duration-200">
                                    <div className="text-4xl text-blue-600 mb-4">
                                        <i className="fas fa-tachometer-alt"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold text-black dark:text-white">
                                        Admin Dashboard
                                    </h3>
                                    <p className="text-gray-800 dark:text-gray-300">
                                        Gain insights and analytics from your restaurant’s performance.
                                    </p>
                                    <a href="/admin/dashboard" className="text-blue-600 mt-4 inline-block">
                                        Learn More
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            <Footer />
        </>
    );
}
