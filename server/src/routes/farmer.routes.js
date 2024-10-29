import { Router } from "express";
import { registerFarmer} from "../controllers/farmer.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

// import { verifyJWT } from "../middlewares/auth.middleware.js";

const router= Router();

router.route("/register").post(
    upload.fields([
        {
            name: "coverImage", 
            maxCount: 1
        }
    ]),
    registerFarmer
);



export default router