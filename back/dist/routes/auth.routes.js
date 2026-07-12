"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.register);
router.post('/login', auth_controller_1.login);
router.get('/me', auth_middleware_1.authMiddleware, auth_controller_1.me);
// router.get('/protected' , authMiddleware , (req,res)=>{
//     res.status(200).json({message: "You have accessed a protected route!"})
// })
router.get("/profile", auth_middleware_1.authMiddleware, (req, res) => {
    res.json({
        message: "Protected route accessed",
        // user: req.user,
    });
});
exports.default = router;
