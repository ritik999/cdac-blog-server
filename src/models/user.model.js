import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const userSchema=new Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        default:'https://t4.ftcdn.net/jpg/03/40/12/49/360_F_340124934_bz3pQTLrdFpH92ekknuaTHy8JuXgG7fi.jpg'
    },
    userRole:{
        type:String,
        default:'user'
    }
},{
    timestamps:true
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    this.password=await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect=async function(password){
    
    return await bcrypt.compare(String(password),this.password);
}

userSchema.methods.generateAccessToken=async function(){
    return jwt.sign({id:this._id,email:this.email,username:this.username,role:this.userRole},process.env.ACCESS_KEY_SECRET,{
        expiresIn:process.env.ACCESS_KEY_EXPIRY
    })
}

export const User=mongoose.model('User',userSchema);