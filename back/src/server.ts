import app from './app';

// if (!process.env.JWT_SECRET) {
//   throw new Error("JWT_SECRET is not defined in environment variables");
// }

const PORT = 4000;

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})