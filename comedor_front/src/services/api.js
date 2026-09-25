import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:6970";
export const API_URL = rawApiUrl.replace(/\/+$/, "");

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

let isRefreshing = false;
let pendingRequests = [];

api.interceptors.response.use(res => res, async error => {
    const status = error.response?.status;
    if (status === 401 && !error.config._retry) {
        if(!localStorage.getItem("token")){
            return Promise.reject(error);
        }

        if (error.config?.url?.includes("/auth/logout")) {
            return Promise.reject(error);
        }
        const original = error.config;
        original._retry = true;
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                const storedRefreshToken = localStorage.getItem("refresh_token");
                const res = await axios.post(`${API_URL}/usuario/auth/refresh`, { refresh_token: storedRefreshToken }, { withCredentials: true });
                const nuevo_token = res.data.access_token;
                localStorage.setItem("token", nuevo_token);

                pendingRequests.forEach(cb => cb(nuevo_token));
                pendingRequests = [];
            } catch (err) {
                localStorage.removeItem("token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
                return Promise.reject(err)
            } finally {
                isRefreshing = false;
            }
        }

        return new Promise((resolve) => {
            pendingRequests.push((newToken) => {
                original.headers.Authorization = `Bearer ${newToken}`;
                resolve(api(original));
            });
        });
    }

    return Promise.reject(error);
});

export default api;