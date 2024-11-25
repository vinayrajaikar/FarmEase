import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {toogleNewsDislike, getDislikedNewsCount} from "../controllers/dislike.controller.js";

const router= Router();

// dislike-----------------------------------------------------------------------------------------

router.route("/add-news-dislike/:newsId").post(verifyJWT, toogleNewsDislike );
router.route("/get-disliked-news-count/:newsId").get(verifyJWT, getDislikedNewsCount);


export default router