import express from "express";
import { corsMiddleware } from "./middlewares/cors";
import { errorHandler } from "./middlewares/errorHandler";
import authRoute from "./routes/auth";

const app = express();

//middlewares
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoute);

app.use(errorHandler);

export default app;
