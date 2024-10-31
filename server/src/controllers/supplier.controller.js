import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Supplier } from "../models/supplier.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
// import bcrypt from "bcryptjs";

const generateAccessAndRefreshToken = async(userId)=>{
    try{
        const user = await Supplier.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // adding refresh token to model
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken};

    }
    catch(error){
        throw new ApiError(500, "Something went wrong while generating access and referesh token")
    }
}

const registerSupplier = asyncHandler(async (req, res, next) => {
    // console.log("Working!");
    // -------------------------------------

    // Get user details from front end
    const {username, email, fullName, contactNumber, pincode, password, supplyCategory, description} = req.body;

    // Validation
    if(!username || !email || !fullName || !contactNumber || !pincode || !password || !description){
        throw new ApiError(400,"All Fields are required");
    }

    // Check if user already exists
    const existedUser = await Supplier.findOne({
        $or: [{username},{email}]
    });

    if (existedUser) {
        throw new ApiError(400, "User already exists");
    }

    //check for CoverImage
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    console.log(coverImageLocalPath)

    //upload cover image on cloudinary
    const CoverImage=await uploadOnCloudinary(coverImageLocalPath);

    // Create entry of supplier in db
    const supplier = await Supplier.create({
        username,   
        email,
        fullName,
        contactNumber,
        description,
        pincode,
        password,
        supplyCategory,
        coverImage:CoverImage?.url || "",
        description
    });

    //remove password and refresh token from response
    const createdSupplier = await Supplier.findById(supplier._id).select(
        "-password -refreshToken"
    );

    //check if Supplier is created or not
    if(!createdSupplier){
        throw new ApiError(500, "Something went wrong while registering Supplier");
    }

    // return response
    return res.status(201).json(
        new ApiResponse(
            200,
            createdSupplier,
            "Supplier registered successfully",
        )
    )
})

const loginSupplier = asyncHandler(async (req, res, next) => {

    // Get user details from front end
    const {username, password, email} = req.body;

    // Validation
    if(!username && !email){
        throw new ApiError(400,"username or email required");
    }

    if(!password){
        throw new ApiError(400,"password required");
    }

    // find user in db
    const supplier = await Supplier.findOne({
        $or: [{username},{email}]
    });

    if(!supplier){
        throw new ApiError(400, "Invalid username or password");
    }

    // check for password
    // if password valid then=> acsess and referesh token
    const isPasswordCorrect = await supplier.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid password");
    }

    //generate access and refresh token
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(supplier._id);

    const loggedInSupplier = await Supplier.findById(supplier._id).select(
        "-password -refreshToken"
    );

    const options={
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                loggedInSupplier,
                "Logged in successfully",
            )
        )
})



export{
    registerSupplier,
    loginSupplier
}