import mongoose, { Schema } from "mongoose";

const postSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    title:{
        type:String,
        required:true,
        unique:true
    },
    content:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png'
    },
    category:{
        type:String,
        default:'uncategorized'
    },
    slug:{
        type:String,
        required:true,
        unique:true
    }
},
{
    timestamps:true
})

export const Posts=mongoose.model('Posts',postSchema);