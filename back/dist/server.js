"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// if (!process.env.JWT_SECRET) {
//   throw new Error("JWT_SECRET is not defined in environment variables");
// }
const PORT = 4000;
app_1.default.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
console.log("DB URL:", process.env.DATABASE_URL);
