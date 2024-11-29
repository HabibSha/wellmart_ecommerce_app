"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoUri = exports.port = void 0;
exports.port = process.env.PORT || 5002;
exports.mongoUri = process.env.MongoDB_URI || "mongodb://localhost:27017/WellMartDB";
