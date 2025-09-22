import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";
import { useSession } from 'next-auth/react';
import { getAllArtist } from '@/app/utils/apiHandler';
import { getAllUser } from '@/app/utils/apiHandler';
import { getSong } from "@/app/utils/apiHandler";
import { getAllStory } from "@/app/utils/userApi";

export const fetchAllArtist = createAsyncThunk(
    "users/fetchAllArtist",
    async (token) => {
        console.log("Token : ",token)
        const response = await getAllArtist({jwtToken:token});
        // let responseData = decrypt(response.data);
        // responseData = JSON.parse(responseData);
        console.log("This is Response : ", response);
        // let finalData = []
        // if(responseData.data && Array.isArray(responseData.data) && responseData.data.length>0){
        //     responseData.data.forEach((user)=>{
        //         try {
        //             const encryptedId = encrypt(user.id.toString());
        //             finalData.push({...user, id: encryptedId});
        //         } catch (error) {
        //             console.error("Error encrypting user ID:", error);
        //         }
        //     })
        // }
        return response.data;
    },
);

export const fetchAllPost = createAsyncThunk(
    "users/fetchAllPost",
    async () => {
        let token = null;
        // Safe client-side check
        if (typeof window !== "undefined") {
            token = localStorage.getItem("auth_token");
        }
        console.log("Token : ",token)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/getAllPosts`, {
            headers: {
                'accept-language': 'en',
                'api_key': process.env.NEXT_PUBLIC_BACKEND_API_KEY,
                "jwt_token" : token
            }
        })
        let responseData = decrypt(response.data);
        responseData = JSON.parse(responseData);
        console.log("This is Response : ", responseData);
        let finalData = []
        if(responseData.data && Array.isArray(responseData.data) && responseData.data.length>0){
            responseData.data.forEach((user)=>{
                try {
                    const encryptedId = encrypt(user.id.toString());
                    finalData.push({...user, id: encryptedId});
                } catch (error) {
                    console.error("Error encrypting user ID:", error);
                }
            })
        }
        return finalData;
})

export const fetchAllUser = createAsyncThunk(
    "users/fetchAllUser",
    async (token) => {
      console.log("This is jwtToken at Slicer : ", token)
      const response = await getAllUser({ jwtToken: token }) // ✅ token passed correctly
      console.log("This is Response : ", response)
      return response.data
    }
)

export const fetchAllSong = createAsyncThunk(
    "users/fetchAllSong",
    async (token) => {
      console.log("This is jwtToken at Slicer : ", token)
      const response = await getSong({ jwtToken: token }) // ✅ token passed correctly
      console.log("This is Response : ", response)
      return response.data
    }
)

  
const userSlice = createSlice({
    name : "mySlice",
    initialState:{
        allArtist : [],
        allPosts : [],
        allUser : [],
        allSong:[],
        status : 'idle',
        error : null
    },
    reducers :{ 

    },
    extraReducers : (builder)=>{
        builder
        .addCase(fetchAllArtist.pending,(state)=>{
            state.status = "loading"
        })
        .addCase(fetchAllArtist.fulfilled, (state, action)=>{
            state.status = "succeeded"
            state.allArtist = action.payload
        })
        .addCase(fetchAllArtist.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
        .addCase(fetchAllPost.pending,(state)=>{
            state.status = "loading"
        })
        .addCase(fetchAllPost.fulfilled, (state, action)=>{
            state.status = "succeeded"
            state.allPosts = action.payload
        })
        .addCase(fetchAllPost.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
        .addCase(fetchAllUser.pending,(state)=>{
            state.status = "loading"
        })
        .addCase(fetchAllUser.fulfilled, (state, action)=>{
            state.status = "succeeded"
            state.allUser = action.payload
        })
        .addCase(fetchAllUser.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
        .addCase(fetchAllSong.pending,(state)=>{
            state.status = "loading"
        })
        .addCase(fetchAllSong.fulfilled, (state, action)=>{
            state.status = "succeeded"
            state.allSong = action.payload
        })
        .addCase(fetchAllSong.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
    }
})

export default userSlice.reducer