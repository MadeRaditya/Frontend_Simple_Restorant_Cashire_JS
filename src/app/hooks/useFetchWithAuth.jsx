import axios from 'axios';
import { useRouter } from 'next/navigation';

export const useFetchWithAuth = () => {
    const router = useRouter();
    const fetchWithAuth = async (url, setter) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setter(response.data);
        } catch (err) {
            if (err.response?.status === 401) {
                try {
                    const refresh = await axios.post('/api/refresh', {}, { withCredentials: true });
                    const newToken = refresh.data.token;
                    if (!newToken) throw new Error('Token kosong');
                    localStorage.setItem('token', newToken);
                    const retry = await axios.get(url, {
                        headers: { Authorization: `Bearer ${newToken}` },
                    });
                    setter(retry.data);
                } catch (e) {
                    console.error('Refresh error:', e);
                    router.push('/auth/login');
                }
            } else {
                console.error('Fetch error:', err);
            }
        }
    };

    return { fetchWithAuth };
};
