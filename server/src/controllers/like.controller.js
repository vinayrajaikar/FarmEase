import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";


const toogleNewsLike = asyncHandler(async (req, res) => {
    const { newsId } = req.params;
    const userId = req.user._id;    
    const userType = req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1);

    if (!mongoose.Types.ObjectId.isValid(newsId)) {
        throw new ApiError(400, "Invalid news ID");
    }

    const news = await Like.findOne({ news: newsId, likedBy: userId });

    if (news) {
        await Like.findByIdAndDelete(news._id);
        return res
        .status(200)
        .json(new ApiResponse(200, "News unliked successfully")
    );
    }

    const like = await Like.create(
        { news: newsId, 
          likedBy: userId,
          userType: userType
        }
    );

    if (!like) {
        throw new ApiError(500, "Failed to like news");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "News liked successfully")
    );

})

const getLikedNewsCount = asyncHandler(async (req, res) => {
    const { newsId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(newsId)) {
        throw new ApiError(400, "Invalid news ID");
    }    

    const count = await Like.countDocuments({ news: newsId});

    // if (!count) {
    //     throw new ApiError(500, "Failed to get liked news count");
    // }

    return res
        .status(200)
        .json(new ApiResponse(200,{count:count}, "Liked news count retrieved successfully")    
    );
})

export { toogleNewsLike, getLikedNewsCount };
