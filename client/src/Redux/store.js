import { configureStore } from "@reduxjs/toolkit";
import farmerSlice from "./Slices/farmerSlice";
import supplierSlice from "./Slices/supplierSlice";
import newsSlice from "./Slices/newsSlice";
import likeSlice from "./Slices/likeSlice";

const store = configureStore({
    reducer: {
        farmer: farmerSlice,
        supplier: supplierSlice,
        news: newsSlice,
        like: likeSlice
    }
})

export default store