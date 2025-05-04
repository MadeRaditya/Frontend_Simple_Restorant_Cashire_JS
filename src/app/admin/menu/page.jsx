"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from 'axios';
import Link from "next/link";
import Alert from "@/components/alert/Alert";

export default function Menus({ darkMode }) {
    const router = useRouter();
    const [menus, setMenus] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); 
    const [currentMenu, setCurrentMenu] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        description:'',
    });
    const [fileInput, setFileInput] = useState(null); 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchMenu = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/menu/');
            setMenus(response.data);
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching Menu:', err);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFileInput(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('description', formData.description);
            
            if (fileInput) {
                formDataToSend.append('image', fileInput);
            }
            
            if (modalMode === 'add') {
                try {
                    const response = await axios.post('/api/menu/add', formDataToSend, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data' 
                        },
                        withCredentials: true,
                    });
                    setSuccess(response.data.message);
                    setShowModal(false);
                    resetForm();
                    fetchMenu(); 
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
            
                            const response = await axios.post('/api/menu/add', formDataToSend, {
                                headers: {
                                    Authorization: `Bearer ${newToken}`,
                                    'Content-Type': 'multipart/form-data'
                                },
                                withCredentials: true,
                            });
                            setSuccess(response.data.message);
                            setShowModal(false);
                            resetForm();
                            fetchMenu();
                        } catch (refreshError) {
                            console.error('Error refreshing token:', refreshError);
                            router.push('/auth/login');
                        }
                    } else {
                        console.error('Error adding Menu:', err);
                        handleApiError(err);
                    }
                }
            } else if (modalMode === 'edit') {
                if (!currentMenu || !currentMenu.id) {
                    setError('Menu ID is missing');
                    return;
                }
                
                try {
                    const response = await axios.put(`/api/menu/edit/${currentMenu.id}`, formDataToSend, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        },
                        withCredentials: true,
                    });
                    setSuccess(response.data.message);
                    setShowModal(false);
                    resetForm();
                    fetchMenu(); 
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
            
                            const response = await axios.put(`/api/menu/edit/${currentMenu.id}`, formDataToSend, {
                                headers: {
                                    Authorization: `Bearer ${newToken}`,
                                    'Content-Type': 'multipart/form-data'
                                },
                                withCredentials: true,
                            });
                            setSuccess(response.data.message);
                            setShowModal(false);
                            resetForm();
                            fetchMenu();
                        } catch (refreshError) {
                            console.error('Error refreshing token:', refreshError);
                            router.push('/auth/login');
                        }
                    } else {
                        console.error('Error Editing Menu:', err);
                        handleApiError(err);
                    }
                }
            }
        } 
        catch (error) {
            handleApiError(error);
        }
    };

    const handleApiError = (error) => {
        let errorMessage = 'Something went wrong';
  
        if (error.response?.data?.message) {
            const errorData = error.response.data.message;
        
            if (Array.isArray(errorData)) {
                errorMessage = errorData.map((errorItem) => {
                    return typeof errorItem.msg === 'string' ? errorItem.msg : JSON.stringify(errorItem.msg);
                }).join(' and ');
            }
            else {
                errorMessage = errorData;
            }
        }
        
        setError(errorMessage);
    };

    const handleDelete = async () => {
        if (!currentMenu || !currentMenu.id) {
            setError('Menu ID is missing');
            return;
        }
        
        const token = localStorage.getItem('token');
        
        try {
            const response = await axios.delete(`/api/menu/delete/${currentMenu.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            
            setShowModal(false);
            setSuccess(response.data.message);
            fetchMenu(); 
        } catch (error) {
            if(error.response?.data?.message){
                setError(error.response.data.message);
            } else {
                setError('Failed to delete menu item');
            }
        }
    };

    const openAddModal = () => {
        resetForm();
        setModalMode('add');
        setShowModal(true);
    };

    const openEditModal = (menu) => {
        setCurrentMenu(menu);
        setFormData({
            name: menu.name || '',
            category: menu.category || '',
            price: menu.price || '',
            description: menu.description || '',
        });
        setFileInput(null); 
        setModalMode('edit');
        setShowModal(true);
    };

    const openDeleteModal = (menu) => {
        setCurrentMenu(menu);
        setModalMode('delete');
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: '',
            price: '',
            description: '',
        });
        setFileInput(null);
        setCurrentMenu(null);
    };

    const filteredMenus = (Array.isArray(menus) ? menus : []).filter(menu => 
        menu.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        menu.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(menu.price)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        menu.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastMenu = currentPage * itemsPerPage;
    const indexOfFirstMenu = indexOfLastMenu - itemsPerPage;
    const currentMenus = filteredMenus.slice(indexOfFirstMenu, indexOfLastMenu);
    const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen w-full flex bg-white text-black dark:bg-black dark:text-white">
            <div className="md:w-4/5 lg:w-4/5 ml-auto md:overflow-hidden w-full md:p-8 p-4">
                <div className="text-center mb-6">
                    <h1 className="font-bold text-3xl my-6">Manajemen Menu</h1>
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

                <div className="flex flex-col md:flex-row justify-between items-center mb-6 ">
                    <div className="w-full md:w-1/2 mb-4 md:mb-0">
                        <div className="relative z-9">
                            <input
                                type="text"
                                placeholder="Cari Menu..."
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
                        Tambah Menu
                    </button>
                </div>

                <div className="overflow-x-auto rounded-lg shadow-lg">
                    <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs md:text-xl">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">#</th>
                                <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Name</th>
                                <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Image</th>
                                <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Category</th>
                                <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Price</th>
                                <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Description</th>
                                <th className="py-3 px-4 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="py-4 text-center">Memuat data...</td>
                                </tr>
                            ) : currentMenus.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-4 text-center">Tidak ada data menu</td>
                                </tr>
                            ) : (
                                currentMenus.map((menu, index) => (
                                    <tr key={menu.id} className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'} hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150`}>
                                        <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">{indexOfFirstMenu + index + 1}</td>
                                        <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">{menu.name}</td>
                                        <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">
                                            <img
                                                src={`/public/assets/img/${menu.image}`}
                                                alt={menu.name}
                                                className="w-auto h-10 object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                }}
                                            />
                                        </td>
                                        <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">{menu.category}</td>
                                        <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">{menu.price}</td>
                                        <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">{menu.description}</td>
                                        <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openEditModal(menu)}
                                                    className="bg-yellow-500 text-white p-1.5 rounded-md hover:bg-yellow-600 transition duration-200"
                                                    title="Edit"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(menu)}
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

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {modalMode === 'add' && 'Tambah Menu'}
                                    {modalMode === 'edit' && 'Edit Menu'}
                                    {modalMode === 'delete' && 'Hapus Menu'}
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

                            <div className="p-4">
                                {modalMode === 'delete' ? (
                                    <div>
                                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                                            Anda yakin ingin menghapus menu <span className="font-semibold">{currentMenu?.name}</span>?
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
                                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                                        <div className="mb-4">
                                            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="name">
                                                Nama
                                            </label>
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="image">
                                                Image
                                            </label>
                                            <input
                                                id="image"
                                                name="image"
                                                type="file"
                                                onChange={handleFileChange}
                                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                accept=".jpg,.jpeg,.png"
                                                required={modalMode === 'add'}
                                            />
                                            <span className="text-sm text-red-500"> allow type: jpg, png, jpeg</span>
                                            {modalMode === 'edit' && currentMenu?.image && (
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">Current image: {currentMenu.image}</p>
                                                    <img
                                                        src={`/assets/img/${currentMenu.image}`}
                                                        alt="Current"
                                                        className="mt-1 h-16 w-auto object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="category">
                                                Category
                                            </label>
                                            <select
                                                id="category"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            >
                                                <option value="" disabled hidden>Pilih category</option>
                                                <option value="food">food</option>
                                                <option value="beverage">beverage</option>
                                                <option value="dessert">dessert</option>
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="price">
                                                Price
                                            </label>
                                            <input
                                                id="price"
                                                name="price"
                                                type="number"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="description">
                                                Description
                                            </label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                rows="3"
                                                required
                                            />
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