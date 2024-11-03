import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const likeSchema = new Schema(
    {
        news: {
            type: Schema.Types.ObjectId,
            required: true,
            ref:  'News'  // This references the "News" model
        },
        likedBy: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'userType'  // This dynamically references either "Farmer" or "Supplier" based on `userType`
        },
        userType: {
            type: String,
            required: true,
            enum: ["Farmer", "Supplier"]  // Restricting to either "Farmer" or "Supplier"
        },
    },
    {
        timestamps: true
    }
);

likeSchema.plugin(mongooseAggregatePaginate)

export const Like = mongoose.model("Like", likeSchema);

