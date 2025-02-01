import {createAsyncThunk,createSlice} from "@reduxjs/toolkit"
import axiosInstance from "../../utils/axiosInstance"
const initialState ={
    dislikeDetails:null,
    loading:false,
    status:false
}

export const AddDislike = createAsyncThunk(
    "addLike",
    async(newsId)=>{
        const response = await axiosInstance.post(`/dislike/add-news-dislike/${newsId}`);
        return response.data;
    }
);

export const getDislike = createAsyncThunk(
    "getLike",
    async(newsId)=>{
        const response = await axiosInstance.post(`/dislike/get-disliked-news-count/${newsId}`);
        return response.data;
    }
);

const dislikeSlice = createSlice({
    name:"dislike",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(AddDislike.pending,(state)=>{
            state.loading = true;
            state.status = false;
        })
        .addCase(AddDislike.fulfilled,(state,action)=>{
            state.dislikeDetails = action.payload;
            state.loading = false;
            state.status = true;
        })
        .addCase(AddDislike.rejected,(state)=>{
            state.loading = false;
            state.status = false;
        })

        builder
        .addCase(getDislike.pending,(state)=>{
            state.loading = true;
            state.status = false;
        })

        .addCase(getDislike.fulfilled,(state,action)=>{
            state.dislikeDetails = action.payload;
            state.loading = false;
            state.status = true;
        })

        .addCase(getDislike.rejected,(state)=>{
            state.loading = false;
            state.status = false;
        })

    }
})  

export default dislikeSlice.reducer