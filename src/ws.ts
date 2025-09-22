import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { verifyToken } from "./utils/jwt";
export function initWs(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: { origin: ["http://localhost:5173"], credentials: true },
    transports: ["websocket"],
  });

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.authorization?.replace("Bearer ", "");
      if (!token) return next(new Error("No token"));
      const user = verifyToken(token); // { id, username, ... }
      (socket.data as any).user = user;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const user = (socket.data as any).user;
    socket.join("timeline:global");
    socket.join(`user:${user.id}`);
    console.log("joined global:", user?.id);
  });

  return io;
}
