"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from 'axios';
import Link from "next/link";
import Alert from "@/components/alert/Alert";

export default function Users({ darkMode }) {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'delete'
    const [currentUser, setCurrentUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [error , setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch users data
    const fetchUsers = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('/api/users/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            setUsers(response.data.users);
            setIsLoading(false);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                try {
                    const refreshResponse = await axios.post('/api/refresh', {}, {
                        withCredentials: true
                    });
                    const newToken = refreshResponse.data.token;

                    if (!newToken) {
                        throw new Error('New token is empty');
                    }

                    localStorage.setItem('token', newToken);

                    const response = await axios.get('/api/users', {
                        headers: {
                            Authorization: `Bearer ${newToken}`,
                        },
                        withCredentials: true,
                    });
                    setUsers(response.data);
                    setIsLoading(false);
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError);
                    router.push('/auth/login');
                }
            } else {
                console.error('Error fetching users:', err);
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
      fetchUsers();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        console.log(formData)
        
        try {
            if (modalMode === 'add') {
                const response = await axios.post('/api/register', formData);
                setSuccess(response.data.message);
            } else if (modalMode === 'edit') {
                const response = await axios.put(`/api/edit/${currentUser.id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                setSuccess(response.data.message);
            }
            
            setShowModal(false);
            resetForm();
            fetchUsers();

        } 
        catch (error) {
            let errorMessage = 'Something went wrong';
  
            if (error.response?.data?.message) {
                const errorArray = error.response.data.message;
        
                
                if (Array.isArray(errorArray)) {
                    errorMessage = errorArray.map((errorItem) => {
                    return typeof errorItem.msg === 'string' ? errorItem.msg : JSON.stringify(errorItem.msg);
                    }).join(' and ');
                    setError(errorMessage); 
                }
                else {
                    setError(errorArray);
                }
            }
        }
    };

    // Handle user deletion
    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        
        try {
            const response = await axios.delete(`/api/delete/${currentUser.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            
            setShowModal(false);
            setSuccess(response.data.message);
            fetchUsers();
        } catch (error) {
            if(error.response.data.message){
                setError(error.response.data.message);
        }
    }
    };

    // Open modal for adding a new user
    const openAddModal = () => {
        resetForm();
        setModalMode('add');
        setShowModal(true);
    };

    // Open modal for editing a user
    const openEditModal = (user) => {
        setCurrentUser(user);
        setFormData({
            username: user.username,
            password: '',
            role: user.role,
        });
        setModalMode('edit');
        setShowModal(true);
    };

    // Open confirmation modal for deleting a user
    const openDeleteModal = (user) => {
        setCurrentUser(user);
        setModalMode('delete');
        setShowModal(true);
    };

    // Reset form data
    const resetForm = () => {
        setFormData({
            username: '',
            password: '',
            role: '',
        });
        setCurrentUser(null);
    };


    // Filter users based on search term
    const filteredUsers = (Array.isArray(users)?users : []).filter(user => 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.password?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    return (
        <div className="min-h-screen w-full flex bg-white text-black dark:bg-black dark:text-white">
            <div className="md:w-4/5 lg:w-4/5 ml-auto md:overflow-hidden w-full md:p-8 p-4">
                <div className="text-center mb-6">
                    <h1 className="font-bold text-3xl my-6">Manajemen User</h1>
                </div>

                {error && <Alert 
                    type="error"
                    message={error}
                    onClose={() => setError(null)}
                  />}
                {success && <Alert 
                    type="success" 
                    message={success} 
                    onClose={() => setSuccess(null)}
                />}


                {/* Search and Add User Row */}
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
                    <button
                        onClick={openAddModal}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 dark:bg-blue-700 dark:hover:bg-blue-600 flex items-center"
                    >
                        <svg 
                            className="w-5 h-5 mr-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Tambah User
                    </button>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto rounded-lg shadow-lg">
                    <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs md:text-xl">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">#</th>
                                <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Username</th>
                                <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Password</th>
                                <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Role</th>
                                <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="py-4 text-center">Memuat data...</td>
                                </tr>
                            ) : currentUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-4 text-center">Tidak ada data user</td>
                                </tr>
                            ) : (
                                currentUsers.map((user, index) => (
                                    <tr key={user.id} className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'} hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150`}>
                                        <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">{indexOfFirstUser + index + 1}</td>
                                        <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 ">{user.username}</td>
                                        <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">
                                        {'•'.repeat(8)}
                                        </td>
                                        <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">
                                            <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="bg-yellow-500 text-white p-1.5 rounded-md hover:bg-yellow-600 transition duration-200"
                                                    title="Edit"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(user)}
                                                    className="bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600 transition duration-200"
                                                    title="Delete"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                        <nav className="flex items-center space-x-1">
                            <button
                                onClick={() => paginate(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-2 rounded-md ${
                                    currentPage === 1
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                            >
                                &laquo;
                            </button>
                            
                            {[...Array(totalPages).keys()].map(number => (
                                <button
                                    key={number + 1}
                                    onClick={() => paginate(number + 1)}
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
                                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-2 rounded-md ${
                                    currentPage === totalPages
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                            >
                                &raquo;
                            </button>
                        </nav>
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                            {/* Modal Header */}
                            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {modalMode === 'add' && 'Tambah User'}
                                    {modalMode === 'edit' && 'Edit User'}
                                    {modalMode === 'delete' && 'Hapus User'}
                                </h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-4">
                                {modalMode === 'delete' ? (
                                    // Delete Confirmation
                                    <div>
                                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                                            Anda yakin ingin menghapus user <span className="font-semibold">{currentUser?.name}</span>?
                                        </p>
                                        <div className="flex justify-end mt-4 space-x-3">
                                            <button
                                                onClick={() => setShowModal(false)}
                                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // Add/Edit Form
                                    <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="name">
                                                Username
                                            </label>
                                            <input
                                                id="username"
                                                name="username"
                                                type="text"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">
                                                Password {modalMode === 'edit' && '(Biarkan kosong jika tidak ingin mengubah)'}
                                            </label>
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                required={modalMode === 'add'}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="role">
                                                Role
                                            </label>
                                            <select
                                                id="role"
                                                name="role"
                                                value={formData.role}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                >
                                                <option value="" disabled hidden>Pilih role</option>
                                                <option value="admin">Admin</option>
                                                <option value="kasir">Kasir</option>
                                                <option value="pelayan">Pelayan</option>
                                            </select>

                                        </div>
                                        
                                        <div className="flex justify-end mt-4 space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            >
                                                {modalMode === 'add' ? 'Tambah' : 'Perbarui'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}