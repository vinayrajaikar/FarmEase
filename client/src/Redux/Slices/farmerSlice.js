import {createAsyncThunk,createSlice} from "@reduxjs/toolkit"
import axiosInstance from "../../utils/axiosInstance"
const initialState ={
    farmerDetails:null,
    loading:false,
    status:false,
    role:""
}

export const registerFarmer = createAsyncThunk(
    "registerFarmer",
    async(details)=>{
        const response = await axiosInstance.post("/farmer/registerfarmer",details);
        return response.data;
    }
);

export const loginFarmer = createAsyncThunk(
    "loginFarmer",
    async(details)=>{
        const response = await axiosInstance.post("/farmer/loginfarmer",details);
        return response.data;
    }
);

export const logoutFarmer = createAsyncThunk(
    "logoutFarmer",
    async()=>{
        const response = await axiosInstance.post("/farmer/logoutfarmer");
        return response.data;
    }
);

export const getCurrentFarmer = createAsyncThunk(
    "getCurrentFarmer",
    async()=>{
        const response = await axiosInstance.get("/farmer/farmer-current-user");
        return response.data;
    }
);

export const updateFarmerAccount = createAsyncThunk(
    "updateFarmerAccount",
    async(details)=>{
        const response = await axiosInstance.post("/farmer/farmer-update-account-details",details);
        return response.data;
    }
)

export const updateFarmerPassword = createAsyncThunk(
    "updateFarmerPassword",
    async(details)=>{
        const response = await axiosInstance.post("/farmer/update-farmer-password",details);
        return response.data;
    }
)

export const updateFarmerCoverImage = createAsyncThunk(
    "updateFarmerCoverImage",
    async(details)=>{
        const response = await axiosInstance.post("/farmer/update-farmer-cover-image",details);
        return response.data;
    }
)

const farmerSlice = createSlice({
    name:"farmer",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(registerFarmer.pending,(state)=>{
            state.loading = true;
        })
        .addCase(registerFarmer.fulfilled,(state,action)=>{
            state.farmerDetails=action.payload;
            state.loading = false;
            state.status = true;
        })
        .addCase(registerFarmer.rejected, (state)=>{
            state.loading = false;
            state.farmerDetails = null;
            state.status = false;
        })

        builder
        .addCase(loginFarmer.pending,(state)=>{
            state.loading = true;
        })
        .addCase(loginFarmer.fulfilled,(state,action)=>{
            // console.log(action.payload.data.user);
            state.farmerDetails = action.payload.data.user.data;
            state.loading = false;
            state.status = true;
            state.role = action.payload.data.user.role;
            // console.log(JSON.parse(JSON.stringify(state)))
        
        })
        .addCase(loginFarmer.rejected, (state)=>{
            state.loading = false;
            state.farmerDetails = null;
            state.status = false;
        })

        builder
        .addCase(logoutFarmer.pending, (state)=>{
            state.loading = true;
        })
        .addCase(logoutFarmer.fulfilled, (state,action)=>{
            state.farmerDetails=null;
            state.loading = false;
            state.status = true;
            state.role = "";
        })
        .addCase(logoutFarmer.rejected, (state)=>{
            state.farmerDetails=null;
            state.loading=false;
            state.status=false;
        })

        builder
        .addCase(getCurrentFarmer.pending, (state)=>{
            state.loading = true;
        })
        .addCase(getCurrentFarmer.fulfilled, (state,action)=>{
            state.farmerDetails=action.payload;
            state.loading = false;
            state.status = true;
        })
        .addCase(getCurrentFarmer.rejected, (state)=>{
            state.farmerDetails=null;
            state.loading=false;
            state.status=false;
        })

        builder
        .addCase(updateFarmerAccount.pending, (state)=>{
            state.loading = true;
        })
        .addCase(updateFarmerAccount.fulfilled, (state,action)=>{
            state.farmerDetails=action.payload;
            state.loading = false;
            state.status = true;
        })
        .addCase(updateFarmerAccount.rejected, (state)=>{
            state.farmerDetails=null;
            state.loading=false;
            state.status=false;
        })

        builder
        .addCase(updateFarmerPassword.pending, (state)=>{
            state.loading = true;
        })
        .addCase(updateFarmerPassword.fulfilled, (state,action)=>{
            state.farmerDetails=action.payload;
            state.loading = false;
            state.status = true;
        })
        .addCase(updateFarmerPassword.rejected, (state)=>{
            state.farmerDetails=null;
            state.loading=false;
            state.status=false;
        })

        builder
        .addCase(updateFarmerCoverImage.pending, (state)=>{
            state.loading = true;
        })
        .addCase(updateFarmerCoverImage.fulfilled, (state,action)=>{
            state.farmerDetails=action.payload;
            state.loading = false;
            state.status = true;
        })
        .addCase(updateFarmerCoverImage.rejected, (state)=>{
            state.farmerDetails=null;
            state.loading=false;
            state.status=false;
        })
    }
});

export default farmerSlice.reducer;
