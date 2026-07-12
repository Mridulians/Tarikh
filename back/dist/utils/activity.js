"use strict";
// utils/activity.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActivity = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const logActivity = async ({ caseId, userId, action, message, metadata = {}, }) => {
    await client_1.default.caseActivity.create({
        data: {
            caseId,
            performedById: userId,
            action,
            message,
            metadata,
        },
    });
};
exports.logActivity = logActivity;
