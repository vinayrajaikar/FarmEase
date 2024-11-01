import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { Farmer as FarmerUser } from "../models/farmer.model.js";
import { Supplier as SupplierUser } from "../models/supplier.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    //   console.log(req.cookies.accessToken);
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    //   console.log("Token received:", token);

      if (!token) {
          throw new ApiError(401, "Unauthorized request");
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //   console.log("Decoded Token:", decodedToken);

      // Choose model based on role or other criteria
      let user;
      if (decodedToken.role === "farmer") {
        user = await FarmerUser.findById(decodedToken?._id).select("-password -refreshToken");
      } else if (decodedToken.role === "supplier") {
        user = await SupplierUser.findById(decodedToken?._id).select("-password -refreshToken");
      }

      if (!user) {
          throw new ApiError(401, "Invalid Access Token");
      }

      req.user = user;
    //   console.log("Working")
      next();
  } catch (error) {
      console.error("Error during JWT verification:", error.message);
      throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});



  



