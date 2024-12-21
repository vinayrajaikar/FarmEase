import {createAsyncThunk,createSlice} from "@reduxjs/toolkit"
import axiosInstance from "../../utils/axiosInstance"
const initialState ={
    supplierDetails:null,
    loading:false,
    status:false,
    role:""
}

export const registerSupplier = createAsyncThunk(
    "registerSupplier",
    async(details)=>{
        const response = await axiosInstance.post("/supplier/register-supplier",details);
        return response.data;
    }
);

export const loginSupplier = createAsyncThunk(
    "loginSupplier",
    async(details)=>{
        const response = await axiosInstance.post("/supplier/login-supplier",details);
        return response.data;
    }
);

export const logoutSupplier = createAsyncThunk(
    "logoutSupplier",
    async()=>{
        const response = await axiosInstance.post("/supplier/logout-supplier");
        return response.data;
    }
);

export const getCurrentSupplier = createAsyncThunk(
    "getCurrentSupplier",
    async()=>{
        const response = await axiosInstance.get("/supplier/supplier-current-user");
        return response.data;
    }
);

export const updateSupplierAccount = createAsyncThunk(
    "updateSupplierAccount",
    async(details)=>{
        const response = await axiosInstance.post("/supplier/supplier-update-account-details",details);
        return response.data;
    }
)

export const updateSupplierPassword = createAsyncThunk(
    "updateSupplierPassword",
    async(details)=>{
        const response = await axiosInstance.post("/supplier/supplier-update-password",details);
        return response.data;
    }
)

export const updateSupplierCoverImage = createAsyncThunk(
    "updateSupplierCoverImage",
    async(details)=>{
        const response = await axiosInstance.patch("/supplier/supplier-update-coverimage",details);
        return response.data;
    }
)

export const getAllFarmers = createAsyncThunk(
    "getAllFarmers",
    async()=>{
        const response = await axiosInstance.get("/supplier/get-all-farmers");
        console.log(response);
        return response.data;
    }
)

const supplierSlice = createSlice({
    name:"supplier",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(registerSupplier.pending,(state)=>{
            state.loading = true;
        })
        .addCase(registerSupplier.fulfilled,(state,action)=>{
            state.supplierDetails=action.payload;
            state.loading = false;
            state.status = true;
        })
        .addCase(registerSupplier.rejected, (state)=>{
            state.loading = false;
            state.supplierDetails = null;
            state.status = false;
        })

        builder
        .addCase(loginSupplier.pending,(state)=>{
            state.loading = true;
        })
        .addCase(loginSupplier.fulfilled,(state,action)=>{
            state.supplierDetails = action.payload;
            state.loading = false;
            state.status = true;
            state.role = action.payload.role;
            console.log(state.role);
        })
        .addCase(loginSupplier.rejected, (state)=>{
            state.loading = false;
            state.supplierDetails = null;
            state.status = false;
        })

        builder
        .addCase(logoutSupplier.pending, (state)=>{
            state.loading = true;
        })
        .addCase(logoutSupplier.fulfilled, (state,action)=>{
            state.supplierDetails=action.payload;
            state.loading = false;
            state.status = true;
            state.role = "";
        })
        .addCase(logoutSupplier.rejected, (state)=>{
            state.supplierDetails=null;
            state.loading=false;
            state.status=false;
        })

        builder
        .addCase(getCurrentSupplier.pending, (state)=>{
            state.loading = true;
        })
        .addCase(getCurrentSupplier.fulfilled, (state,action)=>{
            state.supplierDetails=action.payload;
            state.loading = false;
            state.status = true;
        })
        .addCase(getCurrentSupplier.rejected, (state)=>{
            state.supplierDetails=null;
            state.loading=false;
            state.status=false;
        })

        builder
        .addCase(updateSupplierAccount.pending, (state)=>{
            state.loading = true;
        })
        .addCase(updateSupplierAccount.fulfilled, (state,action)=>{
            state.supplierDetails=action.payload;
            state.loading = false;
            state.status = true;
        })
        .addCase(updateSupplierAccount.rejected, (state)=>{
            state.supplierDetails=null;
            state.loading=false;
            state.status=false;
        })

        builder
        .addCase(updateSupplierPassword.pending, (state)=>{
            state.loading = true;
        })
        .addCase(updateSupplierPassword.fulfilled, (state,action)=>{
            state.supplierDetails=action.payload;
            state.loading = false;
            state.status = true;
        })
        .addCase(updateSupplierPassword.rejected, (state)=>{
            state.supplierDetails=null;
            state.loading=false;
            state.status=false;
        })

        builder
        .addCase(updateSupplierCoverImage.pending, (state)=>{
            state.loading = true;
        })
        .addCase(updateSupplierCoverImage.fulfilled, (state,action)=>{
            state.supplierDetails=action.payload;
            state.loading = false;
            state.status = true;
        })
        .addCase(updateSupplierCoverImage.rejected, (state)=>{
            state.supplierDetails=null;
            state.loading=false;
            state.status=false;
        })

        builder
        .addCase(getAllFarmers.pending, (state)=>{
            state.loading = true;
        })
        .addCase(getAllFarmers.fulfilled, (state,action)=>{
            state.supplierDetails=action.payload;
            state.loading = false;
            state.status = true;
        })
        .addCase(getAllFarmers.rejected, (state)=>{
            state.supplierDetails=null;
            state.loading=false;
            state.status=false;
        })

    }
});

export default supplierSlice.reducer;
