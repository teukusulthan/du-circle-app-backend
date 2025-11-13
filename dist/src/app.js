"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_1 = require("./middlewares/cors");
const errorHandler_1 = require("./middlewares/errorHandler");
const auth_1 = __importDefault(require("./routes/auth"));
const thread_1 = __importDefault(require("./routes/thread"));
const auth_2 = require("./middlewares/auth");
const follow_1 = __importDefault(require("./routes/follow"));
const search_1 = __importDefault(require("./routes/search"));
const app = (0, express_1.default)();
// swagger
const specPath = path_1.default.join(__dirname, "swagger.yaml");
const openapiDoc = js_yaml_1.default.load(fs_1.default.readFileSync(specPath, "utf8"));
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapiDoc));
app.get("/openapi.json", (_req, res) => res.json(openapiDoc));
// middlewares
app.use(cors_1.corsMiddleware);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static("uploads"));
// routes
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1", auth_2.authenticate, thread_1.default);
app.use("/api/v1", auth_2.authenticate, follow_1.default);
app.use("/api/v1", search_1.default);
// error handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
