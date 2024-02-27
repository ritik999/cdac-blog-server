import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js"

const create=async(req,res)=>{
    try {
        const {content,userId,postId}=req.body;

        console.log(typeof(userId), ' ',req.user._id.toHexString());
        if(userId !== req.user._id.toHexString()){
            throw new ApiError(400,'unauthorized');
        }

        const comment=await Comment.create({
            content,
            postId,
            userId
        })
        res.status(200).json({success:true,message:'comment created successfully',createdComment:comment});
    } catch (error) {
        throw new ApiError(404,error.message);
    }
}

const getPostComments=async(req,res)=>{
    try {
        console.log(req.params);
        const comments=await Comment.find({postId:req.params.postId}).populate('userId').sort({cratedAt:-1});

        res.status(200).json({success:true,comments});
    } catch (error) {
        console.log(error.message);
        throw new ApiError(400,error.message);
    }
}

const editPostComments=async(req,res)=>{
    try {

        const comment=await Comment.findById(req.params.commentId);

        if(!comment){
            throw new ApiError(401,'no comment found');
        }

        if(req.user._id !== comment.userId && req.user.userRole !== 'admin'){
            throw new ApiError(400,'you are not allowed to edit comment');
        }

        const editedComments=await Comment.findByIdAndUpdate(req.params.commentId,{
            content:req.body.content
        },{new:true})

        res.status(200).json({success:true,editedComments});
    } catch (error) {
        throw new ApiError(400,error.message);
    }
}

const deletePostComments=async(req,res)=>{
    try {
        const comment=await Comment.findById(req.params.commentId);

        if(!comment){
            throw new ApiError(401,'no comment found');
        }

        if(req.user._id !== comment.userId && req.user.userRole !== 'admin'){
            throw new ApiError(400,'you are not allowed to edit comment');
        }

        const deleteComments=await Comment.findByIdAndDelete(req.params.commentId);

        res.status(200).json({success:true,message:'message deleted successfully'});
    } catch (error) {
        throw new ApiError(400,error.message);
    }
}

export {create, getPostComments, editPostComments, deletePostComments}