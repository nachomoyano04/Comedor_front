import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:6970", withCredentials: true
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
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
                const res = await axios.post("http://localhost:6970/usuario/auth/refresh", {}, { withCredentials: true });
                const nuevo_token = res.data.access_token;
                localStorage.setItem("token", nuevo_token);

                pendingRequests.forEach(cb => cb(nuevo_token));
                pendingRequests = [];
            } catch (err) {
                localStorage.removeItem("token");
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


    if (status == 403) {
        window.location.href = "/forbidden";
    }
    return Promise.reject(error);
});

export default api;