import { Router } from "express";
import { registerFarmer} from "../controllers/farmer.controller.js";
// import {upload} from "../middlewares/multer.middleware.js"
// import { verifyJWT } from "../middlewares/auth.middleware.js";

const router= Router();

router.route("/register").post(registerFarmer);
// router.route("/register").get((req, res) => {
//     res.send("GET route for testing");
// });


export default router