import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toogleNewsLike, getLikedNewsCount } from "../controllers/like.controller.js";



const router= Router();

// like-----------------------------------------------------------------------------------------

router.route("/add-news-like").post(verifyJWT, toogleNewsLike );
router.route("/get-liked-news-count").get(verifyJWT, getLikedNewsCount);


export default router