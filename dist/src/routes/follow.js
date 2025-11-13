"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const follow_1 = require("../controllers/follow");
const router = (0, express_1.Router)();
router.get("/follows", follow_1.getFollows);
router.post("/follow", follow_1.follow);
router.delete("/follow", follow_1.unfollow);
exports.default = router;
