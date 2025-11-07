import express from "express";
import path from "path";
import fs from "fs";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";

import { corsMiddleware } from "./middlewares/cors";
import { errorHandler } from "./middlewares/errorHandler";
import authRoute from "./routes/auth";
import threadRoute from "./routes/thread";
import { authenticate } from "./middlewares/auth";
import followRoute from "./routes/follow";
import searchRoute from "./routes/search";

const app = express();

// swagger
const specPath = path.join(__dirname, "swagger.yaml");
const openapiDoc = yaml.load(fs.readFileSync(specPath, "utf8")) as object;
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDoc));
app.get("/openapi.json", (_req, res) => res.json(openapiDoc));

// middlewares
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1", authenticate, threadRoute);
app.use("/api/v1", authenticate, followRoute);
app.use("/api/v1", searchRoute);

// error handler
app.use(errorHandler);

export default app;
