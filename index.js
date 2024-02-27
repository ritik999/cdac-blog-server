import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/db/index.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config({path:'../.env'});

const app=express();
const __dirname=path.resolve();
// console.log(path.join(__dirname,'../client'));
app.use(express.json({limit:'16kb'}))
app.use(cookieParser());

import userRouter from './src/routes/user.route.js';
import { postRouter } from './src/routes/post.route.js';
import { commentRouter } from './src/routes/comment.route.js';

app.use('/api/v1/users',userRouter);
app.use('/api/v1/posts',postRouter)
app.use('/api/v1/comments',commentRouter);
app.use(express.static(path.join(__dirname,'../client/dist')))

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'../client/dist/index.html'));
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`app is running on port: ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log('MongoDB connection ERROR: ',err);
})