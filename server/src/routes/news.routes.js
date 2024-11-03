import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadNews} from "../controllers/news.controller.js";

const router= Router();

router.route("/createnews").post(verifyJWT, uploadNews);

export default router