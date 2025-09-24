import { Router } from "express";
import { searchUser } from "../controllers/search";
const router = Router();

router.get("/search", searchUser);

export default router;
