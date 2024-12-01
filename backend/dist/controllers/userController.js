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
exports.handleUserRegister = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const userModel_1 = __importDefault(require("../models/userModel"));
const responseController_1 = require("./responseController");
const handleUserRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            throw (0, http_errors_1.default)(409, "User with this email already exists. Please sign in.");
        }
        const newUser = { name, email, password };
        const user = yield userModel_1.default.create(newUser);
        (0, responseController_1.successResponse)(res, {
            statusCode: 201,
            message: "User was registered successfully",
            payload: user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.handleUserRegister = handleUserRegister;
exports.default = { handleUserRegister: exports.handleUserRegister };
