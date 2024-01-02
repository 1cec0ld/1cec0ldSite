import axios from "axios"



const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.1cec0ld.net',
})

export default axiosInstance