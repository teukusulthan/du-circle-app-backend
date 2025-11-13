"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_1 = require("../controllers/search");
const router = (0, express_1.Router)();
router.get("/search", search_1.searchUsers);
exports.default = router;
