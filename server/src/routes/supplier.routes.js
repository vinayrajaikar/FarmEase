import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { registerSupplier,loginSupplier } from "../controllers/supplier.controller.js";

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

export default router