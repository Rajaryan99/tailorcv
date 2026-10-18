import axios from 'axios'

const TOKEN_STORAGE_KEY = 'tailorcv_token';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tailorcv-backend-w45u.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})

const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        return;
    }

    localStorage.removeItem(TOKEN_STORAGE_KEY);
    delete api.defaults.headers.common.Authorization;
};

const syncAuthToken = () => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (storedToken) {
        api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
        return storedToken;
    }

    delete api.defaults.headers.common.Authorization;
    return null;
};

api.interceptors.request.use((config) => {
    const storedToken = syncAuthToken();

    if (storedToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${storedToken}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            setAuthToken(null);
        }

        return Promise.reject(error);
    }
);

export async function register({username, email, password}){
    try {

        const response = await api.post('api/auth/register', {
            username, email, password
        })

        if (response.data?.token) {
            setAuthToken(response.data.token);
        }

        return response.data


        
    } catch (error) {
        console.error(error)
    }
}

export async function login({email, password}){
    try {

        const response = await api.post('/api/auth/login', {
            email, password
        })

        if (response.data?.token) {
            setAuthToken(response.data.token);
        }

        return response.data;
        
    } catch (error) {
        console.error(error)
        
    }
}

export async function logout(){
    try {

        const response  = await api.get('/api/auth/logout');
        setAuthToken(null);

        return response.data
        
    } catch (error) {
        console.error(error)

    }
}


export async function getMe(){
    try {

        const response = await api.get('/api/auth/get-me')
        return response.data
        
    } catch (error) {
        console.error(error)
    }
}
   