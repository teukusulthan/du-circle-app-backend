"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWs = initWs;
const socket_io_1 = require("socket.io");
const jwt_1 = require("./utils/jwt");
function initWs(httpServer) {
    const io = new socket_io_1.Server(httpServer, {
        cors: { origin: ["http://localhost:5173"], credentials: true },
        transports: ["websocket"],
    });
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token ||
                socket.handshake.headers.authorization?.replace("Bearer ", "");
            if (!token)
                return next(new Error("No token"));
            const user = (0, jwt_1.verifyToken)(token);
            socket.data.user = user;
            next();
        }
        catch {
            next(new Error("Invalid token"));
        }
    });
    io.on("connection", (socket) => {
        const user = socket.data.user;
        socket.join("timeline:global");
        socket.join(`user:${user.id}`);
        console.log("joined global:", user?.id);
        socket.on("join:thread", (threadId) => {
            if (!threadId)
                return;
            socket.join(`thread:${threadId}`);
        });
        socket.on("leave:thread", (threadId) => {
            if (!threadId)
                return;
            socket.leave(`thread:${threadId}`);
        });
    });
    return io;
}
