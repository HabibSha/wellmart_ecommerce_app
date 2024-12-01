"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const responseController_1 = require("./controllers/responseController");
const secret_1 = require("./secret");
const database_1 = __importDefault(require("./config/database"));
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
//todo: Routers
app.use("/api/users", userRouter_1.default);
app.get("/", (_req, res, _next) => {
    res.status(200).json({ message: "hello" });
});
//todo: Not found error-handling middleware
app.use((_req, _res, next) => {
    next((0, http_errors_1.default)(404, "Router not found!"));
});
app.use((err, _req, res, _next) => {
    (0, responseController_1.errorResponse)(res, {
        statusCode: err.status || 500,
        message: err.message || "Internal server error!",
    });
});
// todo: Server
app.listen(secret_1.port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`server is running at http://localhost:${secret_1.port}`);
    yield (0, database_1.default)();
}));
