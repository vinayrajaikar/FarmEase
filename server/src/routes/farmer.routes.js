import { Router } from "express";
import { registerFarmer,loginFarmer, logoutFarmer, refreshAccessToken,getCurrentUser,updateAccountDetails,updateFarmerCoverImage, updateFarmerPassword} from "../controllers/farmer.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


// import { verifyJWT } from "../middlewares/auth.middleware.js";

const router= Router();

// Register farmer 
router.route("/register").post(
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
router.route("/refresh-token").post(refreshAccessToken)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account-details").post(verifyJWT, updateAccountDetails)
router.route("/update-cover-image").patch(verifyJWT, upload.single("coverImage"),updateFarmerCoverImage)
router.route("/update-farmer-password").patch(verifyJWT, updateFarmerPassword)




export default router