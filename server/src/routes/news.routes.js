import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadNews,updateNews,deleteNews,getAllNews} from "../controllers/news.controller.js";

const router= Router();

router.route("/upload-news").post(verifyJWT, uploadNews);
router.route("/update-news/:newsId").post(verifyJWT, updateNews);
router.route("/delete-news/:newsId").post(verifyJWT, deleteNews);
router.route("/get-all-news").get(verifyJWT, getAllNews);

export default router