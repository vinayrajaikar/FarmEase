import { configureStore } from "@reduxjs/toolkit";
import farmerSlice from "./Slices/farmerSlice";
import supplierSlice from "./Slices/supplierSlice";
// import newsSlice from "./Slices/newsSlice";

const store = configureStore({
    reducer: {
        farmer: farmerSlice,
        supplier: supplierSlice,
        // news: newsSlice
    }
})

export default store