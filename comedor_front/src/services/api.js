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

const processQueue = (err, token = null) => {
    pendingRequests.forEach(prom => {
        if (err) {
            prom.reject(err);
        } else {
            prom.resolve(token);
        }
    });
    pendingRequests = [];
};

api.interceptors.response.use(res => res, async error => {
    const status = error.response?.status;
    if (status === 401 && !error.config._retry) {
        if(!localStorage.getItem("token")){
            return Promise.reject(error);
        }

        if (error.config?.url?.includes("/auth/logout") || error.config?.url?.includes("/auth/refresh")) {
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

                processQueue(null, nuevo_token);
            } catch (err) {
                processQueue(err, null);
                localStorage.removeItem("token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return new Promise((resolve, reject) => {
            pendingRequests.push({
                resolve: (newToken) => {
                    original.headers.Authorization = `Bearer ${newToken}`;
                    resolve(api(original));
                },
                reject: (err) => {
                    reject(err);
                }
            });
        });
    }

    return Promise.reject(error);
});

export default api;