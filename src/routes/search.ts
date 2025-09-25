import { Router } from "express";
import { searchUsers } from "../controllers/search";
const router = Router();

router.get("/search", searchUsers);

export default router;
