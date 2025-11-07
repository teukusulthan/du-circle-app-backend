import { Router } from "express";
import { createThread, getThread, getThreads } from "../controllers/thread";
import { likeThread } from "../controllers/like";
import { upload } from "../middlewares/multer";
import { createReply, getReplies } from "../controllers/reply";
import { cacheGET } from "../middlewares/cache";

const router = Router();

router.get("/threads", cacheGET(15), getThreads);
router.get("/thread/:id", cacheGET(30), getThread);
router.get("/thread/:id/replies", cacheGET(30), getReplies);
router.post("/threads", upload.single("image"), createThread);
router.post("/thread/:id/like", likeThread);
router.post("/thread/:id/replies", upload.single("image"), createReply);

export default router;
