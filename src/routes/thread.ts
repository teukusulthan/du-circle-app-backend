import { Router } from "express";
import { createThread, getThreads } from "../controllers/thread";
import { upload } from "../middlewares/multer";

const router = Router();

router.get("/threads", getThreads);
router.post("/threads", upload.single("image"), createThread);

export default router;
