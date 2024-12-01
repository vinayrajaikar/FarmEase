import {createAsyncThunk,createSlice} from "@reduxjs/toolkit"
import axiosInstance from "../../utils/axiosInstance"
const initialState ={
    newsDetails:null,
    loading:false,
    status:false
}

export const uploadNews = createAsyncThunk(
    "uploadNews",
    async(details)=>{
        const response = await axiosInstance.post("/news/upload-news",details);
        return response.data;
    }
);

export const updateNews = createAsyncThunk(
    "updateNews",
    async(details)=>{
        const response = await axiosInstance.post("/news/update-news/:newsId",details);
        return response.data;
    }
);

export const deleteNews = createAsyncThunk(
    "deleteNews",
    async(newsId)=>{
        const response = await axiosInstance.post(`/news/delete-news/:${newsId}`,);
        return response.data;
    }
);

export const getAllNews = createAsyncThunk(
    "getAllNews",
    async()=>{
        const response = await axiosInstance.get("/news/get-all-news");
        return response.data;
    }
);


const newsSlice = createSlice({
    name:"news",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(uploadNews.pending,(state)=>{
            state.loading = true;
            state.status = false;
        })
        .addCase(uploadNews.fulfilled,(state,action)=>{
            state.loading = false;
            state.status = true;
            state.newsDetails = action.payload;
        })
        .addCase(uploadNews.rejected,(state)=>{
            state.loading = false;
            state.status = false;
        })

        builder
        .addCase(updateNews.pending,(state)=>{
            state.loading = true;
            state.status = false;
        })
        .addCase(updateNews.fulfilled,(state,action)=>{
            state.loading = false;
            state.status = true;
            state.newsDetails = action.payload;
        })
        .addCase(updateNews.rejected,(state)=>{
            state.loading = false;
            state.status = false;
        })

        builder
        .addCase(deleteNews.pending,(state)=>{
            state.loading = true;
            state.status = false;
        })        
        .addCase(deleteNews.fulfilled,(state,action)=>{
            state.loading = false;
            state.status = true;
            state.newsDetails = action.payload;
        })        
        .addCase(deleteNews.rejected,(state)=>{
            state.loading = false;
            state.status = false;
        })

        builder
        .addCase(getAllNews.pending,(state)=>{
            state.loading = true;
            state.status = false;
        })
        .addCase(getAllNews.fulfilled,(state,action)=>{
            state.loading = false;
            state.status = true;
            state.newsDetails = action.payload;
        })
        .addCase(getAllNews.rejected,(state)=>{
            state.loading = false;
            state.status = false;
        })
    }
})



