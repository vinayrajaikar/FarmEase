import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.defaults.withCredentials=true;
axiosInstance.defaults.baseURL=process.env.URL;

export default axiosInstance;