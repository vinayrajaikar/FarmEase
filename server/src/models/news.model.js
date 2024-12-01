import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import {Farmer} from './farmer.model.js';
import {Supplier} from "./supplier.model.js";

const newsSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'userType' // This dynamically references either "Farmer" or "Supplier" based on `userType`
        },
        userType: {
            type: String,
            required: true,
            enum: ["Farmer", "Supplier"]  // Restricting to either "Farmer" or "Supplier"
        },

        userName: {
            type: String,
            required: true,
            trim: true
        },

        content: {
            type: String,
            required: true,
            trim: true
        },
        link: {
            type: String,
            required: true,
            trim: true
        },

    },
    {
        timestamps: true
    }
);

newsSchema.plugin(mongooseAggregatePaginate);

export const News = mongoose.model("News", newsSchema);
