import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const farmerSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        fullName:{
            type: String,
            required: true,
            trim: true,
            index: true
        },

        password:{
            type: String,
            required: [true,'Password is required'],
        },

        contactNumber:{
            type: Number,
            required: true,
            unique: true
        },

        coverImage: {
            type: String
            // required: true
        },

        area:{
            type: String,
            required: true
        },

        role:{
            type: String,
            default: "farmer",
            // enum: ["farmer", "supplier"]
        },

        refreshToken: {
            type: String
        }
    
    },
    {
        timestamps: true
    }
)

farmerSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// To validate the encrypted password and farmer password 
farmerSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

farmerSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullName: this.fullName,
            contactNumber: this.contactNumber,
            pincode: this.pincode,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

farmerSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullName: this.fullName,
            contactNumber: this.contactNumber,
            pincode: this.pincode
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export  const Farmer = mongoose.model("Farmer", farmerSchema);