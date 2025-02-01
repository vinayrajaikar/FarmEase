import { configureStore } from "@reduxjs/toolkit";
import farmerSlice from "./Slices/farmerSlice";
import supplierSlice from "./Slices/supplierSlice";
import newsSlice from "./Slices/newsSlice";
import likeSlice from "./Slices/likeSlice";
import dislikeSlice from "./Slices/dislikeSlice";

const store = configureStore({
    reducer: {
        farmer: farmerSlice,
        supplier: supplierSlice,
        news: newsSlice,
        like: likeSlice,
        dislike: dislikeSlice
    }
})

export default store