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
const mongoose_1 = __importDefault(require("mongoose"));
const secret_1 = require("../secret");
const connectDatabase = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (options = {}) {
    try {
        yield mongoose_1.default.connect(secret_1.mongoUri, options);
        console.log("Database connected successfully");
        // Attach event listeners to mongoose.connection
        mongoose_1.default.connection.on("error", (error) => {
            console.error("Database connection error: ", error.message);
        });
        mongoose_1.default.connection.on("connected", () => {
            console.log("Mongoose connected to the database");
        });
        mongoose_1.default.connection.on("disconnected", () => {
            console.log("Mongoose disconnected from the database");
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log("Failed to connect to the database:", error.message);
        }
        else {
            console.log("Failed to connect to the database:", error);
        }
    }
});
exports.default = connectDatabase;
