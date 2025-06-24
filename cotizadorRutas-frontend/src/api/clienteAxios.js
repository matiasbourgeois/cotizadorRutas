// Archivo: cotizadorRutas-frontend/src/api/clienteAxios.js
import axios from 'axios';

const clienteAxios = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`
});

// Interceptor para añadir el token a todas las peticiones
clienteAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token_cotizador');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default clienteAxios;