import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Farmer } from "../models/farmer.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const registerFarmer = asyncHandler(async (req, res) => {
    console.log("Working!");
    // res.send("Working!");
    // res.status(200).json({ message: "Working!" });
});

export{
    registerFarmer
}