import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Supplier } from "../models/supplier.model.js";
import { Farmer } from "../models/farmer.model.js";
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

    // Get user details from front end
    const {username, email, fullName, contactNumber, area, password, supplyCategory, description} = req.body;

    // Validation
    if(!username || !email || !fullName || !contactNumber || !area || !password || !description){
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
        area,
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
    const { email,password} = req.body;

    // Validation
    if(!email){
        throw new ApiError(400,"email required");
    }

    if(!password){
        throw new ApiError(400,"password required");
    }

    // find user in db
    const supplier = await Supplier.findOne({
        email
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

const logoutSupplier = asyncHandler(async (req, res, next) => {
    await Supplier.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "Supplier logged out successfully"
            )
        )
})

const supplier_refreshAccessToken = asyncHandler(async (req, res, next) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request");
    }

    try{
        const decodedToken = jwt.verify(
            incomingRefreshToken, 
            process.env.REFRESH_TOKEN_SECRET
        );

        console.log(decodedToken)

        const user = await Supplier.findById(decodedToken?._id)
        console.log(user)
    
        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
        const {accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)
    
        return res
            .status(200)
            .cookie("accessToken", accessToken , options)
            .cookie("refreshToken", newRefreshToken , options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken, refreshToken: newRefreshToken
                    },
                    "Access token refreshed"
                )
            )
            } 
        catch (error) {
            throw new ApiError(401, error?.message || "Invalid refresh token")
        }
})

const supplier_getCurrentUser = asyncHandler(async (req, res, next) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "User fetched successfully"
            )
        )
})

const supplier_updateAccountDetails = asyncHandler(async (req, res, next) => {

    const {fullName, contactNumber, username, area, email, description, supplyCategory} = req.body;

    if (!fullName || !contactNumber || !username || !area || !email || !description || !supplyCategory) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUsername = await Supplier.findOne({ username, _id: { $ne: req.user._id } });
    if (existingUsername) {
        throw new ApiError(400, "Username is already in use");
    }

    const existingContactNumber = await Supplier.findOne({ contactNumber, _id: { $ne: req.user._id } });
    if (existingContactNumber) {
        throw new ApiError(400, "Contact number is already in use");
    }

    const existingEmail = await Supplier.findOne({ email, _id: { $ne: req.user._id } });
    if (existingEmail) {
        throw new ApiError(400, "Email is already in use");
    }    

    const supplier = await Supplier.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                fullName,
                contactNumber,
                username,
                area,
                email,
                description,
                supplyCategory
            }
        },
        { new: true }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json( new ApiResponse(200, supplier, "Supplier details updated successfully"))
});

const updateSupplierCoverImage = asyncHandler(async (req, res, next) => {
    const CoverImageLocalPath = req.file?.path
    if(!CoverImageLocalPath){
        throw new ApiError(400,"CoverImage file is missing!")
    }

    const coverImage =await uploadOnCloudinary(CoverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400,"Error while uploading CoverImage to cloudinary!")
    }

    const user = await Supplier.findByIdAndUpdate(
        req.user?._id, 
        {
            $set: {
                coverImage: coverImage.url
            }
        }, 
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse("200",user,"Cover Image Updated sucessfully!"))    
})

const updateSupplierPassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    // Check if all fields are provided
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if old password is correct
    const supplier = await Supplier.findById(req.user._id);
    if (!supplier) {
        throw new ApiError(404, "Supplier not found");
    }

    const isMatch = await supplier.isPasswordCorrect(oldPassword);
    if (!isMatch) {
        throw new ApiError(400, "Old password is incorrect");
    }

    // Update the farmer's password
    supplier.password = newPassword;
    await supplier.save();

    res.status(200).json(new ApiResponse(200, "Password updated successfully"));
})

const getAllFarmers = asyncHandler(async (req, res) => {
    const farmers = await Farmer.find().select("-password -refreshToken")
    return res
    .status(200)
    .json(new ApiResponse(200, farmers, "All farmers details"))
})

export{
    registerSupplier,
    loginSupplier,
    logoutSupplier,
    supplier_refreshAccessToken,
    supplier_getCurrentUser,
    supplier_updateAccountDetails,
    updateSupplierPassword,
    updateSupplierCoverImage,
    getAllFarmers
}