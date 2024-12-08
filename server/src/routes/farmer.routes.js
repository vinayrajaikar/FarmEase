import { Router } from "express";
import { registerFarmer,loginFarmer, logoutFarmer, farmer_refreshAccessToken,farmer_getCurrentUser,farmer_updateAccountDetails,updateFarmerCoverImage, updateFarmerPassword, getAllSuppliers} from "../controllers/farmer.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


// import { verifyJWT } from "../middlewares/auth.middleware.js";

const router= Router();
// Farmer-----------------------------------------------------------------------------------------
// Register farmer 
router.route("/registerfarmer").post(
    upload.fields([
        {
            name: "coverImage", 
            maxCount: 1
        }
    ]),
    registerFarmer
);

//login farmer
router.route("/loginfarmer").post(loginFarmer);

//secured routes
//logout farmer
router.route("/logoutfarmer").post(verifyJWT, logoutFarmer)
router.route("/farmer-refreshAccess-token").post(farmer_refreshAccessToken)
router.route("/farmer-current-user").get(verifyJWT,farmer_getCurrentUser)
router.route("/farmer-update-account-details").post(verifyJWT, farmer_updateAccountDetails)
router.route("/update-farmer-cover-image").patch(verifyJWT, upload.single("coverImage"),updateFarmerCoverImage)
router.route("/update-farmer-password").patch(verifyJWT, updateFarmerPassword)
router.route("/get-all-suppliers").get(verifyJWT, getAllSuppliers)


export default router

