import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Dislike } from "../models/dislike.model.js";
import { News } from "../models/news.model.js";

const toogleNewsDislike = asyncHandler(async (req, res) => {
    const { newsId } = req.params;
    const userId = req.user._id;    
    const userType = req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1);

    if (!mongoose.Types.ObjectId.isValid(newsId)) {
        throw new ApiError(400, "Invalid news ID");
    }

    // Check if the user has already disliked the news
    const dislikes = await Dislike.findOne({ news: newsId, dislikedBy: userId });

    if (dislikes) {
        // If already disliked, remove the dislike
        await Dislike.findByIdAndDelete(dislikes._id);
        return res
            .status(200)
            .json(new ApiResponse(200, "News un-disliked successfully"));
    }

    // Get the current count of dislikes
    const count = await Dislike.countDocuments({ news: newsId });

    if (count >= 1) {
        // Delete the news and its associated dislikes in parallel
        const [newsDeleteResult, dislikesDeleteResult] = await Promise.all([
            News.findByIdAndDelete(newsId),
            Dislike.deleteMany({ news: newsId }),
        ]);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "News deleted due to too many dislikes",
                    { newsDeleted: newsDeleteResult, dislikesDeleted: dislikesDeleteResult.deletedCount }
                )
            );
    }

    // dislike if it hasn't been disliked already
    const dislike = await Dislike.create({
        news: newsId,
        dislikedBy: userId,
        userType: userType,
    });

    if (!dislike) {
        throw new ApiError(500, "Failed to dislike news");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "News disliked successfully"));
});

const getDislikedNewsCount = asyncHandler(async (req, res) => {
    const { newsId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(newsId)) {
        throw new ApiError(400, "Invalid news ID");
    }   

    const count = await Dislike.countDocuments({ news: newsId});

    if (!count) {
        throw new ApiError(404, "News not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200,{count:count}, "Disliked news count retrieved successfully")
    );
})

export {toogleNewsDislike, getDislikedNewsCount}