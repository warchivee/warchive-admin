import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `https://localhost:5173/api`,
});

export default axiosInstance;
