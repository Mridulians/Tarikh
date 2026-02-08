import { Router } from "express";
import {login, register , me} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post('/register' , register);
router.post('/login' , login)
router.get('/me' , authMiddleware , me)

// router.get('/protected' , authMiddleware , (req,res)=>{
//     res.status(200).json({message: "You have accessed a protected route!"})
// })


router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    // user: req.user,
  });
});





export default router