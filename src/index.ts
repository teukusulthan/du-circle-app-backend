import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import http from "http";
import { initWs } from "./ws";

const server = http.createServer(app);
const io = initWs(server);
app.set("io", io); //

const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
