import { Router } from "express";
import { login, patchProfile, profile, register } from "../controllers/auth";
import { validate } from "../middlewares/validate";
import {
  registerSchema,
  loginSchema,
  PatchProfileSchema,
} from "../schemas/auth";
import { authenticate } from "../middlewares/auth";
import { upload } from "../middlewares/multer";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, profile);
router.patch(
  "/me",
  authenticate,
  upload.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "banner_photo", maxCount: 1 },
  ]),
  validate(PatchProfileSchema),
  patchProfile
);

export default router;
