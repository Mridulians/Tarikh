"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = __importDefault(require("../prisma/client"));
async function createAdmin() {
    const hashedPassword = await bcrypt_1.default.hash("admin123", 10);
    const admin = await client_1.default.user.create({
        data: {
            name: "Admin",
            email: "admin@mail.com",
            password: hashedPassword,
            role: "ADMIN",
        },
    });
    console.log("✅ Admin created:", admin);
}
createAdmin()
    .catch((e) => {
    console.error(e);
})
    .finally(async () => {
    await client_1.default.$disconnect();
});
// command to run this script: 
// npx ts-node src/scripts/createAdmin.ts
