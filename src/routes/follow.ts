import { Router } from "express";
import { getFollows, follow, unfollow } from "../controllers/follow";

const router = Router();

router.get("/follows", getFollows);
router.post("/follow", follow);
router.delete("/follow", unfollow);

export default router;
