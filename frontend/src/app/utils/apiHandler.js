import { encrypt, decrypt } from "@/app/utils/encription";
import apiClient from "./apiClient";
import axios from "axios";
const PostMethod = async(endpoint, data) => {
    try{
        // const adminToken = request.cookies.get('admin_token')?.value
        let encryptedData = encrypt(data)
        // const res = await apiClient.post(`admin/${endpoint}`, encryptedData)
        let res;
        if(data?.jwtToken){
            const token = data?.jwtToken
            delete data?.jwtToken
            encryptedData = encrypt(data)
            res = await apiClient.post(`user/${endpoint}`, encryptedData,{
                headers : {
                    'jwt_token' : token
                }
            })
        }else{
            res = await apiClient.post(`user/${endpoint}`, encryptedData)
        }
        // Check if response data exists and is in the expected format
        if (!res || !res.data) {
            throw new Error("Invalid response from server")
        }
        if(res.statusCode == 401){
            throw new Error("Invalid Token Provided")
        }
        // Decrypt the response data
        const decryptedData = decrypt(res.data)
        console.log("Decrypted Data:", decryptedData)
        // Parse the decrypted JSON
        let result
        try {
            result = JSON.parse(decryptedData)
        } catch (parseError) {
            console.error("Failed to parse JSON:", parseError)
            throw new Error("Invalid response format from server")
        }
        console.log("The Received Data from Backend:", result)
        return result
    }catch(error){
        return error
    }
}
const GetMethod = async(endpoint, data) => {
    try {
        let res;
        let token = data;
        
        // Build endpoint with parameters
        if (typeof data === 'object' && data !== null) {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    console.log(`${key}: ${data[key]}`);
                    if(key != "jwtToken") {
                        endpoint += `/${data[key]}`
                    }
                }
            }
        }
        console.log("End Point : ", endpoint);

        // Validate token presence
        if(!token?.jwtToken) {
            throw new Error("Invalid Token or token Not Found");
        }

        // Make API call with token
        res = await apiClient.get(`user/${endpoint}`, {
            headers: {
                'jwt_token': token?.jwtToken
            }
        });

        // Handle backend token validation response
        if (!res || !res.data) {
            throw new Error("Invalid response from server");
        }
        
        // Handle token expiration from backend
        if(res.statusCode === 401) {
            console.log("Token expired, redirecting to login...");
            if(typeof window !== 'undefined') {
                // Clear any existing token or session data
                localStorage.removeItem('admin_token');
                window.location.href = '/user/signin';
            }
            return;
        }

        // Process successful response
        const decryptedData = decrypt(res.data);
        console.log("Decrypted Data:", decryptedData);
        
        let result;
        try {
            result = JSON.parse(decryptedData);
        } catch (parseError) {
            console.error("Failed to parse JSON:", parseError);
            throw new Error("Invalid response format from server");
        }
        
        console.log("The Received Data from Backend:", result);
        return result;
        
    } catch(error) {
        // Handle token expiration from backend
        if(error.response?.status === 401) {
            console.log("Token expired, redirecting to login...");
            if(typeof window !== 'undefined') {
                // Clear any existing token or session data
                localStorage.removeItem('admin_token');
                window.location.href = '/admin/login';
            }
            return;
        }
        return error;
    }
}

//Admin Methods
const adminPutMethod = async(endpoint, data) => {
    try{
        // const adminToken = request.cookies.get('admin_token')?.value
        let encryptedData = encrypt(data)
        // const res = await apiClient.post(`admin/${endpoint}`, encryptedData)
        let res;
        if(data?.jwtToken){
            const token = data?.jwtToken
            delete data?.jwtToken
            encryptedData = encrypt(data)
            res = await apiClient.put(`admin/${endpoint}`, encryptedData,{
                headers : {
                    'jwt_token' : token
                }
            })
        }else{
            res = await apiClient.put(`admin/${endpoint}`, encryptedData)
        }
        // Check if response data exists and is in the expected format
        if (!res || !res.data) {
            throw new Error("Invalid response from server")
        }
        if(res.statusCode == 401){
            throw new Error("Invalid Token Provided")
        }
        // Decrypt the response data
        const decryptedData = decrypt(res.data)
        console.log("Decrypted Data:", decryptedData)
        // Parse the decrypted JSON
        let result
        try {
            result = JSON.parse(decryptedData)
        } catch (parseError) {
            console.error("Failed to parse JSON:", parseError)
            throw new Error("Invalid response format from server")
        }
        console.log("The Received Data from Backend:", result)
        return result
    }catch(error){
        return error
    }
}
const adminPostMethod = async(endpoint, data) => {
    try{
        // const adminToken = request.cookies.get('admin_token')?.value
        let encryptedData = encrypt(data)
        // const res = await apiClient.post(`admin/${endpoint}`, encryptedData)
        let res;
        if(data?.jwtToken){
            const token = data?.jwtToken
            delete data?.jwtToken
            encryptedData = encrypt(data)
            res = await apiClient.post(`admin/${endpoint}`, encryptedData,{
                headers : {
                    'jwt_token' : token
                }
            })
        }else{
            res = await apiClient.post(`admin/${endpoint}`, encryptedData)
        }
        // Check if response data exists and is in the expected format
        if (!res || !res.data) {
            throw new Error("Invalid response from server")
        }
        if(res.statusCode == 401){
            throw new Error("Invalid Token Provided")
        }
        // Decrypt the response data
        const decryptedData = decrypt(res.data)
        console.log("Decrypted Data:", decryptedData)
        // Parse the decrypted JSON
        let result
        try {
            result = JSON.parse(decryptedData)
        } catch (parseError) {
            console.error("Failed to parse JSON:", parseError)
            throw new Error("Invalid response format from server")
        }
        console.log("The Received Data from Backend:", result)
        return result
    }catch(error){
        return error
    }
}
const adminGetMethod = async(endpoint, data) => {
    try {
        let res;
        let token = data;
        
        // Build endpoint with parameters
        if (typeof data === 'object' && data !== null) {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    console.log(`${key}: ${data[key]}`);
                    if(key != "jwtToken") {
                        endpoint += `/${data[key]}`
                    }
                }
            }
        }
        console.log("End Point : ", endpoint);

        // Validate token presence
        if(!token?.jwtToken) {
            throw new Error("Invalid Token or token Not Found");
        }

        // Make API call with token
        res = await apiClient.get(`admin/${endpoint}`, {
            headers: {
                'jwt_token': token?.jwtToken
            }
        });

        // Handle backend token validation response
        if (!res || !res.data) {
            throw new Error("Invalid response from server");
        }
        
        // Handle token expiration from backend
        if(res.statusCode === 401) {
            console.log("Token expired, redirecting to login...");
            if(typeof window !== 'undefined') {
                // Clear any existing token or session data
                localStorage.removeItem('admin_token');
                window.location.href = '/admin/login';
            }
            return;
        }

        // Process successful response
        const decryptedData = decrypt(res.data);
        console.log("Decrypted Data:", decryptedData);
        
        let result;
        try {
            result = JSON.parse(decryptedData);
        } catch (parseError) {
            console.error("Failed to parse JSON:", parseError);
            throw new Error("Invalid response format from server");
        }
        
        console.log("The Received Data from Backend:", result);
        return result;
        
    } catch(error) {
        // Handle token expiration from backend
        if(error.response?.status === 401) {
            console.log("Token expired, redirecting to login...");
            if(typeof window !== 'undefined') {
                // Clear any existing token or session data
                localStorage.removeItem('admin_token');
                window.location.href = '/admin/login';
            }
            return;
        }
        return error;
    }
}
const adminDeleteMethod = async(endpoint, data) => {
    try {
        let res;
        let token = data;
        
        // Build endpoint with parameters
        if (typeof data === 'object' && data !== null) {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    console.log(`${key}: ${data[key]}`);
                    if(key != "jwtToken") {
                        endpoint += `/${data[key]}`
                    }
                }
            }
        }
        console.log("End Point : ", endpoint);

        // Validate token presence
        if(!token?.jwtToken) {
            throw new Error("Invalid Token or token Not Found");
        }

        // Make API call with token
        res = await apiClient.delete(`admin/${endpoint}`, {
            headers: {
                'jwt_token': token?.jwtToken
            }
        });

        // Handle backend token validation response
        if (!res || !res.data) {
            throw new Error("Invalid response from server");
        }
        
        // Handle token expiration from backend
        if(res.statusCode === 401) {
            console.log("Token expired, redirecting to login...");
            if(typeof window !== 'undefined') {
                // Clear any existing token or session data
                localStorage.removeItem('admin_token');
                window.location.href = '/admin/login';
            }
            return;
        }

        // Process successful response
        const decryptedData = decrypt(res.data);
        console.log("Decrypted Data:", decryptedData);
        
        let result;
        try {
            result = JSON.parse(decryptedData);
        } catch (parseError) {
            console.error("Failed to parse JSON:", parseError);
            throw new Error("Invalid response format from server");
        }
        
        console.log("The Received Data from Backend:", result);
        return result;
        
    } catch(error) {
        // Handle token expiration from backend
        if(error.response?.status === 401) {
            console.log("Token expired, redirecting to login...");
            if(typeof window !== 'undefined') {
                // Clear any existing token or session data
                localStorage.removeItem('admin_token');
                window.location.href = '/admin/login';
            }
            return;
        }
        return error;
    }
}



export const SignUp = async(data) => {
    const res = await PostMethod("signup",data)
    return res
}
export const SignIn = async(data) => {
    const res = await PostMethod("signin",data)
    return res
}
export const ForgetPassword = async(data) => {
    const res = await PostMethod("forgetPassword",data)
    return res
}
export const checkMail = async(data) => {
    const res = await PostMethod("checkMail",data)
    return res
}

export const getUserSong = async(data)=>{
    const res = await GetMethod("song",data);
    return res
}
export const postComments = async(data)=>{
    const res = await PostMethod("comment",data);
    return res
}
export const getComments = async(data)=>{
    const res = await GetMethod("comment",data);
    return res
}
export const likeStateManage = async(data)=>{
    const res = await PostMethod("likeStateManage",data);
    return res
}
export const playCountUpdate = async(data)=>{
    const res = await GetMethod("playCount",data);
    return res
}
export const searchKeyword = async(data)=>{
    const res = await GetMethod("search",data);
    return res
}
export const newPlayList = async(data)=>{
    const res = await PostMethod("playlist",data);
    return res
}
export const getAllPlayList = async(data)=>{
    const res = await GetMethod("playlist",data);
    return res
}
export const getPlayListSongs = async(data)=>{
    const res = await GetMethod("playlist-songs",data);
    return res
}
export const addSongToPlayList = async(data)=>{
    const res = await PostMethod("addtoplaylist",data);
    return res
}
export const getAllFeaturedPlayListSong = async(data)=>{
    console.log("The Method Called !")
    const res = await GetMethod("featuredPlaylistSong",data);
    return res
}
export const homePage = async(data)=>{
    const res = await GetMethod("homePage",data)
    return res
}


// admin API's #################################################

//Admin POST
export const adminSignIn = async(data) => {
    const res = await adminPostMethod("signin",data)
    return res
}

export const AddArtist = async(data) =>{
    const res = await adminPostMethod("artist",data)
    return res
}

//Admin GET
export const getAllUsers = async() => {
    const res = await adminPostMethod("signin",data)
    return res
}

export const getAllArtist = async(data) =>{
    const res = await adminGetMethod("artist", data)
    return res
}

export const updateArtist = async(data)=>{
    const res = await adminPostMethod("updateArtist",data)
    return res;
}
export const getAllUser = async(data) => {
    const res = await adminGetMethod("user", data)
    return res
}

export const deleteUser = async(data)=>{
    console.log("Get Method Token from main Calling: ",data)
    const res = await adminGetMethod("deleteUser",data)
    return res;
}

export const blockUser = async(data)=>{
    const res = await adminGetMethod("userBlockAndUnBlock",data)
    return res;
}
export const editUser = async(data)=>{
    const res = await adminGetMethod("editUser",data)
    return res;
} 
export const updateUser = async(data)=>{
    const res = await adminPostMethod("updateUser",data)
    return res;
}

export const getArtist = async(data)=>{
    const res = await adminGetMethod("getArtist",data)
    return res;
}
export const deleteArtist = async(data)=>{
    const res = await adminGetMethod("deleteArtist",data)
    return res
}
export const blockArtist = async(data)=>{
    const res = await adminGetMethod("blockArtist",data)
    return res
}

export const addCategory = async(data)=>{
    const res = await adminPostMethod("category",data)
    return res
}

export const getCategory = async(data)=>{
    const res = await adminGetMethod("category",data)
    return res
}
export const updateCategory = async(data)=>{
    const res = await adminPutMethod("category",data)
    return res
}
export const deleteCategory = async(data)=>{
    const res = await adminDeleteMethod("category",data)
    return res
}
export const addSong = async(data)=>{
    const res = await adminPostMethod("song",data);
    return res;
}
export const getSong = async(data)=>{
    const res = await adminGetMethod("song",data)
    return res
}
export const updateSong = async(data)=>{
    const res = await adminPutMethod("song",data)
    return res
}
export const getUserPlayList = async(data)=>{
    const res = await adminGetMethod("getPlayList",data)
    return res
}
export const getUserPlayListSongs = async(data)=>{
    const res = await adminGetMethod("getPlayListSongs",data)
    return res
}
export const deletePlayListSong = async(data)=>{
    const res = await adminDeleteMethod("playListSongs",data)
    return res
}
export const getAllUserPlayList = async(data)=>{
    const res = await adminGetMethod("playList",data)
    return res
}
export const AddFeaturePlayList = async(data)=>{
    const res = await adminPostMethod("newFeaturedPlayList",data)
    return res
}
export const getAllFeaturedPlayList = async(data)=>{
    const res = await adminGetMethod("featuredPlayList",data)
    return res
}
export const addSongToFeaturedPlayList = async(data)=>{
    const res = await adminPostMethod("featuredPlayListSong",data)
    return res
}
export const deleteSongFromFeaturedPlayList = async(data)=>{
    const res = await adminDeleteMethod("featuredPlayListSong",data)
    return res
}
export const getAllFeaturedPlayListSongs = async(data)=>{
    const res = await adminGetMethod("featuredPlayList",data)
    return res
}



// file Upload

export const uploadImage = async(data) => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}user/upload-profile`
    console.log("API KEY : ",process.env.NEXT_PUBLIC_API_KEY)
    const res = await axios.post(url,data,{
        headers : {
            'Content-Type': 'multipart/form-data', // Changed from 'text/plain'
            'accept-language': 'en',    
            'api_key': process.env.NEXT_PUBLIC_API_KEY
        }
    })
    let fileResult = decrypt(res.data);
        console.log("image : ",fileResult);
        fileResult = await JSON.parse(fileResult)
        console.log("3 : ",fileResult)
        return fileResult
}