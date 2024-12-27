import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Farmer } from "../models/farmer.model.js";
import { Supplier } from "../models/supplier.model.js";
import { News } from "../models/news.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

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

    // console.log(user);

    // Create a new news entry in the News collection
    const news = await News.create({
        user: user._id,
        userName: user.username,
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
    const {newsId} = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(newsId)) { 
        throw new ApiError(400, "Invalid news ID");
    }

    // Find the user based on the role
    // let user;
    let role= req.user.role;
    let user;
    if (role === "farmer") {
        user = await Farmer.findById(userId);
    } else if (role === "supplier") {
        user= await Supplier.findById(userId);
    }

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if the news belongs to the user
    const news = await News.findById(newsId);
    if (!news) {
        throw new ApiError(404, "News not found");
    }
    if (news.user.toString() !== userId.toString()) {
        throw new ApiError(403, "Access denied, news does not belong to the user");
    }

    // Update the news entry
    
    const newsupdate = await News.findByIdAndUpdate(
        newsId, 
        req.body, 
        { new: true }
    );

    if (!newsupdate) {
        throw new ApiError(404, "News updation failed");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            newsupdate,
            "News updated successfully"
        )
    )

});

const deleteNews = asyncHandler(async (req, res) => {
    const { newsId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(newsId)) {
        throw new ApiError(400, "Invalid news ID");
    }

    // Find the user based on the role
    let role= req.user.role;
    let user;
    if (role === "farmer") {
        user = await Farmer.findById(userId);
    } else if (role === "supplier") {
        user= await Supplier.findById(userId);
    }

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if the news belongs to the user
    const news = await News.findById(newsId);
    if (!news) {
        throw new ApiError(404, "News not found");
    }
    if (news.user.toString() !== userId.toString()) {
        throw new ApiError(403, "Access denied, news does not belong to the user");
    }

    // Delete the news entry
    const newsdelete = await News.findByIdAndDelete(newsId);

    if (!newsdelete) {
        throw new ApiError(404, "News deletion failed");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            newsdelete,
            "News deleted successfully"
        )
    )
});

// const getAllNews = asyncHandler(async (req, res) => {
//     const news = await News.find().sort({ createdAt: -1 });
//     return res.status(200).json(
//         new ApiResponse(
//             200,
//             news,
//             "News retrieved successfully"
//         )
//     )
// })

const getAllNews = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const newsWithLikesAndDislikes = await News.aggregate([
        {
            $lookup: {
                from: "likes",               // The 'Like' collection name
                localField: "_id",           // The _id of News
                foreignField: "news",        // The 'news' field in Like that references News
                as: "likes"                  // Name the resulting array as "likes"
            }
        },
        {
            $lookup: {
                from: "dislikes",            // The 'Dislike' collection name
                localField: "_id",           // The _id of News
                foreignField: "news",        // The 'news' field in Dislike that references News
                as: "dislikes"               // Name the resulting array as "dislikes"
            }
        },
        {
            $addFields: {
                likeCount: { $size: "$likes" },          // Adds a new field 'likeCount' as the size of the 'likes' array
                dislikeCount: { $size: "$dislikes" },    // Adds a new field 'dislikeCount' as the size of the 'dislikes' array
                likedByUser: {
                    $in: [userId, "$likes.likedBy"]  // Check if the user's ID is in the 'likes' array
                }
            }
        },
        {
            $project: {
                likes: 0,                             // Optionally exclude the 'likes' array to return only the count
                dislikes: 0,                          // Optionally exclude the 'dislikes' array to return only the count
            }
        },
        { $sort: { createdAt: -1 } }          // Sort by creation date (most recent first)
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            newsWithLikesAndDislikes,
            "News retrieved successfully"
        )
    );
});




export { 
    uploadNews,
    updateNews,
    deleteNews,
    getAllNews
};
