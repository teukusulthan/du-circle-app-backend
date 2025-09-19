import { Router } from "express";
import { createThread, getThread, getThreads } from "../controllers/thread";
import { likeThread } from "../controllers/like";
import { upload } from "../middlewares/multer";
import { createReply, getReplies } from "../controllers/reply";

const router = Router();

router.get("/threads", getThreads);
router.get("/thread/:id", getThread);
router.get("/thread/:id/replies", getReplies);

router.post("/threads", upload.single("image"), createThread);
router.post("/thread/:id/like", likeThread);
router.post("/thread/:id/replies", upload.single("image"), createReply);

export default router;
