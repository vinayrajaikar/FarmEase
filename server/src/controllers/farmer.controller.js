import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Farmer } from "../models/farmer.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const registerFarmer = asyncHandler(async (req, res) => {
    // console.log("Working!");

    // ------------------------------------------------------
    // Get user details from frontend
    const { username, email, password, fullName, contactNumber, pincode } = req.body;
    // console.log(username);
    
    // Validation
    if(!username || !email || !fullName || !contactNumber || !pincode || !password){
        throw new ApiError(400,"All Fields are required");
    }

    //check if user already exists: username, email
    const existedUser = await Farmer.findOne({
        $or: [{username}, {email}]
    });

    if(existedUser){
        throw new ApiError(409, "User already exists");
    }

    //check for CoverImage
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    console.log(coverImageLocalPath)

    //upload cover image on cloudinary
    const CoverImage=await uploadOnCloudinary(coverImageLocalPath);

    //create farmer object - create entry in db
    const farmer = await Farmer.create({
        username,
        email,
        password,
        fullName,
        contactNumber,
        pincode,
        coverImage: CoverImage?.url || ""
    }) 

    //remove password and refresh token from response
    const createdFarmer = await Farmer.findById(farmer._id).select(
        "-password -refreshToken"
    );

    //check if farmer is created or not
    if(!createdFarmer){
        throw new ApiError(500, "Something went wrong while registering farmer");
    }

    //return response
    return res.status(201).json(
        new ApiResponse(
            200,
            createdFarmer,
            "Farmer registered successfully"
        )
    )
});


export{
    registerFarmer
}