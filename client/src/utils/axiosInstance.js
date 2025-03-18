import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.defaults.withCredentials=true;
axiosInstance.defaults.baseURL= import.meta.env.VITE_URL;
export default axiosInstance;