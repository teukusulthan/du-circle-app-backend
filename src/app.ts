import express from "express";
import { corsMiddleware } from "./middlewares/cors";

const app = express();

//middlewares
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
