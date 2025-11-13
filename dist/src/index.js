"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("./ws");
const server = http_1.default.createServer(app_1.default);
const io = (0, ws_1.initWs)(server);
app_1.default.set("io", io);
const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
