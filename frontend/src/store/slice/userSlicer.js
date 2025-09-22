import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllStory, getAllGenereSongs, getFeature, getAllArtist, getAllGenere, getAllArtistSongs, getAllPodCast, getDiscover } from "@/app/utils/userApi";

export const fetchAllStory = createAsyncThunk(
    "users/fetAllStory",
    async (token)=>{
        console.log("Token in Slicer : ",token)
        const response = await getAllStory({jwtToken:token})
        console.log("This is Response : ",response)
        return response.data
    }
)

export const fetchSingleStory = createAsyncThunk(
    "user/fetchSingleStory",
    async (token)=>{
        console.log("Token -==== : ",token.id)
        const response = await getAllStory({jwtToken : token.token, id : token.id})
        console.log("Thsi is Response : ",response)
        return response.data

    }
)
export const fetchGenereSongs = createAsyncThunk(
    "user/fetchGenereSongs",
    async (token)=>{
        console.log("Token -==== : ",token.id)
        const response = await getAllGenereSongs({jwtToken : token.token, id : token.id})
        console.log("Thsi is Response : ",response)
        return response.data

    }
)
export const fetchFeaturePlayList = createAsyncThunk(
    "user/fetchFeaturePlayList",
    async (token)=>{
        console.log("Token -==== : ",token)
        const response = await getFeature({jwtToken : token})
        console.log("Thsi is Response : ",response)
        return response.data
    }
)
export const fetchAllArtist = createAsyncThunk(
    "user/fetchAllArtist",
    async (token)=>{
        console.log("Token -==== : ",token)
        const response = await getAllArtist({jwtToken : token})
        console.log("Thsi is Response : ",response)
        return response.data
    }
)
export const fetchAllGenere = createAsyncThunk(
    "user/fetchAllGenere",
    async (token)=>{
        console.log("Token -==== : ",token)
        const response = await getAllGenere({jwtToken : token})
        console.log("Thsi is Response : ",response)
        return response.data
    }
)
export const fetchAllArtistSongs = createAsyncThunk(
    "user/fetchAllArtistSongs",
    async (data)=>{
        console.log("Token -==== : ",data)
        const response = await getAllArtistSongs({jwtToken : data.jwtToken, id:data.id})
        console.log("Thsi is Response : ",response)
        return response.data
    }
)
export const fetchAllPodCast = createAsyncThunk(
    "user/fetchAllPodCast",
    async (data)=>{
        console.log("Token -==== : ",data)
        const response = await getAllPodCast({jwtToken : data.jwtToken})
        console.log("Thsi is Response : ",response)
        return response.data
    }
)
export const fetchDiscover = createAsyncThunk(
    "user/fetchDiscover",
    async (data)=>{
        console.log("Token -==== : ",data)
        const response = await getDiscover({jwtToken : data.jwtToken})
        console.log("Thsi is Response : ",response)
        return response.data
    }
)

const userSlice = createSlice({
    name : "mySlice",
    initialState:{
        allStory : [],
        singleStory : {},
        genereSongs:{},
        AllGenere:[],
        featurePlayList:[],
        AllArtist:[],
        AllArtistSongs:[],
        AllPodCast:[],
        Discover : {},
        status : 'idle',
        error : null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchAllStory.pending,(state)=>{
            state.status = "loading"
        })
        .addCase(fetchAllStory.fulfilled,(state, action)=>{
            state.status = "succeeded"
            state.allStory = action.payload
        })
        .addCase(fetchAllStory.rejected,(state, action)=>{
            state.status = "failed"
            state.allStory = action.error.message
        })

        .addCase(fetchSingleStory.pending,(state)=>{
            state.status = "loading"
        })
        .addCase(fetchSingleStory.fulfilled,(state, action)=>{
            state.status = "succeeded"
            state.singleStory = action.payload
        })
        .addCase(fetchSingleStory.rejected,(state, action)=>{
            state.status = "failed"
            state.singleStory = action.error.message
        })

        .addCase(fetchGenereSongs.pending,(state)=>{
            state.status = "loading"
        })
        .addCase(fetchGenereSongs.fulfilled,(state, action)=>{
            state.status = "succeeded"
            state.genereSongs = action.payload
        })
        .addCase(fetchGenereSongs.rejected,(state, action)=>{
            state.status = "failed"
            state.genereSongs = action.error.message
        })
        .addCase(fetchFeaturePlayList.pending,(state)=>{
            state.status = "loading"
        })
        .addCase(fetchFeaturePlayList.fulfilled,(state, action)=>{
            state.status = "succeeded"
            state.featurePlayList = action.payload
        })
        .addCase(fetchFeaturePlayList.rejected,(state, action)=>{
            state.status = "failed"
            state.featurePlayList = action.error.message
        })

        .addCase(fetchAllArtist.pending,(state)=>{
            state.status = "loading"
        })
        .addCase(fetchAllArtist.fulfilled,(state, action)=>{
            state.status = "succeeded"
            state.AllArtist = action.payload
        })
        .addCase(fetchAllArtist.rejected,(state, action)=>{
            state.status = "failed"
            state.AllArtist = action.error.message
        })
        .addCase(fetchAllGenere.pending,(state)=>{
            state.status = "loading"
        })
        .addCase(fetchAllGenere.fulfilled,(state, action)=>{
            state.status = "succeeded"
            state.AllGenere = action.payload
        })
        .addCase(fetchAllGenere.rejected,(state, action)=>{
            state.status = "failed"
            state.AllGenere = action.error.message
        })
        //Artist Songs
        .addCase(fetchAllArtistSongs.pending,(state)=>{
            state.status = "loading"
        })
        .addCase(fetchAllArtistSongs.fulfilled,(state, action)=>{
            state.status = "succeeded"
            state.AllArtistSongs = action.payload
        })
        .addCase(fetchAllArtistSongs.rejected,(state, action)=>{
            state.status = "failed"
            state.AllArtistSongs = action.error.message
        })
        //PodCast
        .addCase(fetchAllPodCast.pending,(state)=>{
            state.status = "loading"
        })
        .addCase(fetchAllPodCast.fulfilled,(state, action)=>{
            state.status = "succeeded"
            state.AllPodCast = action.payload
        })
        .addCase(fetchAllPodCast.rejected,(state, action)=>{
            state.status = "failed"
            state.AllPodCast = action.error.message
        })
        //Discover
        .addCase(fetchDiscover.pending,(state)=>{
            state.status = "loading"
        })
        .addCase(fetchDiscover.fulfilled,(state, action)=>{
            state.status = "succeeded"
            state.Discover = action.payload
        })
        .addCase(fetchDiscover.rejected,(state, action)=>{
            state.status = "failed"
            state.Discover = action.error.message
        })
    }
})
export default userSlice.reducer