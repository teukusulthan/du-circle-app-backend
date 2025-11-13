"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateThreadSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.CreateThreadSchema = zod_1.default.object({
    content: zod_1.default.string().trim().min(1).max(1000),
    image: zod_1.default.string().optional(),
});
