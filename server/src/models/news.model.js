import mongoose, { Schema } from "mongoose";

const newsSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'userType'  // This dynamically references either "Farmer" or "Supplier" based on `userType`
        },
        userType: {
            type: String,
            required: true,
            enum: ["Farmer", "Supplier"]  // Restricting to either "Farmer" or "Supplier"
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        link: {
            type: String,
            trim: true
        },
        upvotes: {
            type: Number,
            default: 0
        },
        downvotes: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export const News = mongoose.model("News", newsSchema);
