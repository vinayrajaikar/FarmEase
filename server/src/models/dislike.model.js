import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const dislikeSchema = new Schema(
    {
        news: {
            type: Schema.Types.ObjectId,
            required: true,
            ref:  'News'  // This references the "News" model
        },
        dislikedBy: {
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

dislikeSchema.plugin(mongooseAggregatePaginate)

export const Dislike = mongoose.model("Dislike", dislikeSchema);

