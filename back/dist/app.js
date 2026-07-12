"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const case_routes_1 = __importDefault(require("./routes/case.routes"));
const client_routes_1 = __importDefault(require("./routes/client.routes"));
// import { authMiddleware } from './middleware/auth.middleware';
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/cases', case_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use('/api/clients', client_routes_1.default);
app.get('/healthy', (req, res) => {
    res.status(200).json({ message: "Server is healthy and running fine" });
});
exports.default = app;
