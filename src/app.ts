import express from "express";
import { corsMiddleware } from "./middlewares/cors";
import { errorHandler } from "./middlewares/errorHandler";
import authRoute from "./routes/auth";
import threadRoute from "./routes/thread";
import { authenticate } from "./middlewares/auth";
import followRoute from "./routes/follow";
import searchRoute from "./routes/search";

const app = express();

//middlewares
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1", authenticate, threadRoute);
app.use("/api/v1", authenticate, followRoute);
app.use("/api/v1", searchRoute);

app.use(errorHandler);

export default app;
