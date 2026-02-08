import express from 'express';
import authRouter from './routes/auth.routes';
// import { authMiddleware } from './middleware/auth.middleware';


const app = express();

app.use(express.json());

app.use('/api/auth' , authRouter);

app.get('/healthy' , (req,res)=>{
    res.status(200).json({message: "Server is healthy and running fine"})
})

export default app;