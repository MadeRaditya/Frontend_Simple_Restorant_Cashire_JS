const { default: axios } = require("axios");

axios.interceptors.response.use(response =>{
    const newToken = response.headers['authorization']?.split(' ')[1];
    if(newToken){
        localStorage.setItem('token', newToken);
    }
    return response;
},
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

axios.defaults.withCredentials = true;