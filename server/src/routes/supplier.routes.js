import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { registerSupplier,loginSupplier, logoutSupplier, supplier_refreshAccessToken, supplier_getCurrentUser, supplier_updateAccountDetails, updateSupplierPassword, updateSupplierCoverImage, getAllFarmers } from "../controllers/supplier.controller.js";

const router= Router();

// supplier-----------------------------------------------------------------------------------------

router.route("/register-supplier").post(
    upload.fields([
        {
            name: "coverImage", 
            maxCount: 1
        }
    ]),
    registerSupplier
);

router.route("/login-supplier").post(loginSupplier);

//secured routes
router.route("/logout-supplier").post(verifyJWT, logoutSupplier)
router.route("/supplier-refreshAccess-token").post(verifyJWT, supplier_refreshAccessToken)
router.route("/supplier-current-user").get(verifyJWT, supplier_getCurrentUser)
router.route("/supplier-update-account-details").post(verifyJWT, supplier_updateAccountDetails)
router.route("/supplier-update-coverimage").patch(verifyJWT, upload.single("coverImage"), updateSupplierCoverImage)
router.route("/supplier-update-password").post(verifyJWT, updateSupplierPassword)
router.route("/get-all-farmers").get(verifyJWT, getAllFarmers)

export default router