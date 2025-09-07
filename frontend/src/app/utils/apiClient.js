import axios from "axios";

const apiClient = axios.create({
    baseURL : process.env.NEXT_PUBLIC_BACKEND_API_URL,
    headers:{
        'Content-Type':"text/plain",
        "api_key" : process.env.NEXT_PUBLIC_API_KEY
    }
})

export default apiClient