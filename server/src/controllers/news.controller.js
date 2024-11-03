import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Farmer } from "../models/farmer.model.js";
import { Supplier } from "../models/supplier.model.js";
import { News } from "../models/news.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadNews = asyncHandler(async (req, res) => {
    const { content, link } = req.body;
    const role = req.user.role;  // Assuming req.user contains a role (either "farmer" or "supplier")
    const _id = req.user._id;

    // Find the user based on the role
    let user;
    if (role === "farmer") {
        user = await Farmer.findById(_id);
    } else if (role === "supplier") {
        user = await Supplier.findById(_id);
    }

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Create a new news entry in the News collection
    const news = await News.create({
        user: user._id,
        userType: role.charAt(0).toUpperCase() + role.slice(1),  // Capitalize role to match "Farmer" or "Supplier"
        content,
        link
    });

    return res.status(201).json(
        new ApiResponse(
            200,
            news,
            "News uploaded successfully"
        )
    )
});

const updateNews = asyncHandler(async (req, res) => {

});

const deleteNews = asyncHandler(async (req, res) => {

});

export { 
    uploadNews 
};
