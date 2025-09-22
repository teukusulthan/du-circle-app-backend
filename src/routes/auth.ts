import { Router } from "express";
import { login, profile, register } from "../controllers/auth";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema } from "../schemas/auth";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/profile", authenticate, profile);

export default router;
