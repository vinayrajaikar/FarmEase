import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Farmer } from "../models/farmer.model.js";
import { Supplier } from "../models/supplier.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
// import bcrypt from "bcryptjs";

const generateAccessAndRefreshToken = async(userId)=>{
    try{
        const user = await Farmer.findById(userId);
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

const registerFarmer = asyncHandler(async (req, res) => {

    // ------------------------------------------------------
    // Get user details from frontend
    const { username, email, password, fullName, contactNumber, area } = req.body;
    // console.log(username);
    
    // Validation
    if(!username || !email || !fullName || !contactNumber || !area || !password){
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
        area,
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

const loginFarmer = asyncHandler(async (req, res) => {
    // Get user details from frontend
    const { email,password } = req.body;

    // Validation
    if(!email){
        throw new ApiError(400,"email required");
    }

    if(!password){
        throw new ApiError(400,"password required");
    }
    
    //find user
    const farmer = await Farmer.findOne({
       email
    });

    if(!farmer){
        throw new ApiError(404, "User does not exist");
    }

    //check password
    // if password valid then=> acsess and referesh token
    const isPasswordCorrect = await farmer.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid Password");
    }

    //generate access and refresh token
    const{accessToken, refreshToken} = await generateAccessAndRefreshToken(farmer._id);

    const loggedInFarmer = await Farmer.findById(farmer._id).select(
        "-password -refreshToken"
    );

    const options = {
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
                {
                    user: loggedInFarmer
                },
                "farmer logged in successfully"
            )
        )
})

const logoutFarmer = asyncHandler(async (req, res) => {
    await Farmer.findByIdAndUpdate(
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
                "farmer logged out successfully"
            )
        )
})

const farmer_refreshAccessToken = asyncHandler(async (req, res) => {
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

        const user = await Farmer.findById(decodedToken?._id)
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

const farmer_getCurrentUser = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User details"))
})

const farmer_updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, contactNumber, username, area, email } = req.body;

    // Check if all fields are provided
    if (!fullName || !contactNumber || !username || !area || !email) {
        throw new ApiError(400, "All fields are required");
    }

    // Check for unique `username`
    const existingUsername = await Farmer.findOne({ username, _id: { $ne: req.user._id } });
    if (existingUsername) {
        throw new ApiError(400, "Username is already in use");
    }

    // Check for unique `contactNumber`
    const existingContactNumber = await Farmer.findOne({ contactNumber, _id: { $ne: req.user._id } });
    if (existingContactNumber) {
        throw new ApiError(400, "Contact number is already in use");
    }

    // Check for unique `email`
    const existingEmail = await Farmer.findOne({ email, _id: { $ne: req.user._id } });
    if (existingEmail) {
        throw new ApiError(400, "Email is already in use");
    }

    // Update the farmer's details
    const farmer = await Farmer.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                fullName,
                contactNumber,
                username,
                area,
                email
            }
        },
        { new: true }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, farmer, "Farmer details updated successfully!"));
});

const updateFarmerCoverImage = asyncHandler(async (req, res) => {
    const CoverImageLocalPath = req.file?.path
    if(!CoverImageLocalPath){
        throw new ApiError(400,"CoverImage file is missing!")
    }

    const coverImage =await uploadOnCloudinary(CoverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400,"Error while uploading CoverImage to cloudinary!")
    }

    const user = await Farmer.findByIdAndUpdate(
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

const updateFarmerPassword = asyncHandler(async (req, res) => {
    const { newPassword, oldPassword } = req.body;

    // Check if all fields are provided
    if (!newPassword || !oldPassword) {
        throw new ApiError(400, "Both current and new passwords are required");
    }

    const farmer = await Farmer.findById(req.user._id);
    if (!farmer) {
        throw new ApiError(404, "User not found");
    }

    const isMatch = await farmer.isPasswordCorrect(oldPassword);
    if (!isMatch) {
        throw new ApiError(400, "Current password is incorrect");
    }

    // Hash the new password and save
    farmer.password = newPassword;
    await farmer.save();

    res.status(200).json( new ApiResponse(200, "Password updated successfully!") );
})

const getAllSuppliers = asyncHandler(async (req, res) => {
    const suppliers = await Supplier.find().select("-password -refreshToken");
    return res
    .status(200)
    .json(suppliers);
});


export{
    registerFarmer,
    loginFarmer,
    logoutFarmer,
    farmer_refreshAccessToken,
    farmer_getCurrentUser,
    farmer_updateAccountDetails,
    updateFarmerCoverImage,
    updateFarmerPassword,
    getAllSuppliers
}