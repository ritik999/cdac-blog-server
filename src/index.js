import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import cookieParser from 'cookie-parser';

dotenv.config({path:'../.env'});

const app=express();
app.use(express.json({limit:'16kb'}))
app.use(cookieParser());

import userRouter from './routes/user.route.js';
import { postRouter } from './routes/post.route.js';

app.use('/api/v1/users',userRouter);
app.use('/api/v1/posts',postRouter)

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`app is running on port: ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log('MongoDB connection ERROR: ',err);
})