import express from 'express';
import authRouter from './routes/auth.routes';
import caseRouter from './routes/case.routes';
// import { authMiddleware } from './middleware/auth.middleware';
import cors from "cors";


const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/auth' , authRouter);
app.use('/api/cases' , caseRouter);

app.get('/healthy' , (req,res)=>{
    res.status(200).json({message: "Server is healthy and running fine"})
})

export default app;