import { Router } from "express";
import { getThreads } from "../controllers/thread";

const router = Router();

router.get("/threads", getThreads);

export default router;
