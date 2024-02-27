import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import jwt from 'jsonwebtoken'

export const verifyUser=(req,_,next)=>{
    const token=req.cookies?.accessToken;
    if(!token){
        throw new ApiError(400,'unauthorized user');
    }

    jwt.verify(token,process.env.ACCESS_KEY_SECRET,async(err,user)=>{
        console.log(user);
        if(err){
            throw new ApiError(402,'unauthorized user');
        }else{
            const userData=await User.findById(user.id).select('-password');
            console.log(userData)
            if(!userData){
                throw new ApiError(401,'unauthorized user');
            }
    
            req.user=userData;
            next();
        }
    })
}
