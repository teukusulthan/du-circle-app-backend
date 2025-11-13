"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const validate_1 = require("../middlewares/validate");
const auth_2 = require("../schemas/auth");
const auth_3 = require("../middlewares/auth");
const multer_1 = require("../middlewares/multer");
const auth_4 = require("../controllers/auth");
const router = (0, express_1.Router)();
router.post("/register", (0, validate_1.validate)(auth_2.registerSchema), auth_1.register);
router.post("/login", (0, validate_1.validate)(auth_2.loginSchema), auth_1.login);
router.get("/me", auth_3.authenticate, auth_1.profile);
router.get("/suggestion", auth_3.authenticate, auth_4.suggestUser);
router.patch("/me", auth_3.authenticate, multer_1.upload.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "banner_photo", maxCount: 1 },
]), (0, validate_1.validate)(auth_2.PatchProfileSchema), auth_1.patchProfile);
exports.default = router;
