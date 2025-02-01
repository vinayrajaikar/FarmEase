import {createAsyncThunk,createSlice} from "@reduxjs/toolkit"
import axiosInstance from "../../utils/axiosInstance"
const initialState ={
    likeDetails:null,
    loading:false,
    status:false
}

export const addLike = createAsyncThunk(
    "addLike",
    async(newsId)=>{
        const response = await axiosInstance.post(`/like/add-news-like/${newsId}`);
        return response.data;
    }
);

export const getLike = createAsyncThunk(
    "getLike",
    async(newsId)=>{
        const response = await axiosInstance.post(`/like/get-liked-news-count/${newsId}`);
        return response.data;
    }
);

const likeSlice = createSlice({
    name:"like",
    initialState,
    reducers:{},    
    extraReducers:(builder)=>{
        builder
        .addCase(addLike.pending,(state)=>{
            state.loading = true;
            state.status = false;
        })
        .addCase(addLike.fulfilled,(state,action)=>{
            state.likeDetails = action.payload;
            state.loading = false;
            state.status = true;
        })
        .addCase(addLike.rejected,(state)=>{
            state.loading = false;
            state.status = false;
        })

        builder
        .addCase(getLike.pending,(state)=>{
            state.loading = true;
            state.status = false;
        })

        .addCase(getLike.fulfilled,(state,action)=>{
            state.likeDetails = action.payload;
            state.loading = false;
            state.status = true;
        })

        .addCase(getLike.rejected,(state)=>{
            state.loading = false;
            state.status = false;
        })

    }
})  

export default likeSlice.reducer