import axios from "axios";
import { ENV } from "@/constants/env";

const api = axios.create({
    baseURL: ENV.API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
})

//Interceptors
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },

    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {

        return response
    },

    (error) => {

        if (error.response?.status === 401) {

            console.log("Token expired");
        }
        return Promise.reject(error);
    }
);

export default api;