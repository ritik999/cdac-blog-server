import { Posts } from "../models/post.model.js";
import { ApiError } from "../utils/apiError.js";

const create = async (req, res) => {
  console.log(req.user);
  if (req.user.userRole !== "admin") {
    throw new ApiError(401, "you are not allowed to create post");
  }

  if (!(req.body.title || req.body.content)) {
    throw new ApiError(404, "please provide all required fields");
  }

  const slug = req.body.title
  .split(' ')
  .join('-')
  .toLowerCase()
  .replace(/[^a-zA-Z0-9-]/g, '');

  try {
    const post=await Posts.create({
      ...req.body,
      user: req.user._id,
      slug
    });

    res
      .status(200)
      .json({ success: true, message: "post created successfully",post });
  } catch (error) {
    throw new ApiError(404, error.message);
  }
};

const getPosts = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order == "asc" ? 1 : -1;

    // console.log(req.query.postSlug);

    const posts=await Posts.find({
        ...(req.query.userId && {user:req.query.userId}),
        ...(req.query.category && {category:req.query.category}),
        ...(req.query.postId && {_id:req.query.postId}),
        ...(req.query.slug) && {slug:req.query.slug},
        ...(req.query.searchTerm && {
            $or:[
                {title:{$regex:req.query.searchTerm, $option:'i'}},
                {content:{$regex:req.query.searchTerm,$option:'i'}}
            ]
        })
    }).sort({updatedAt: sortDirection}).skip(startIndex).limit(limit)

    const totalPosts=await Posts.countDocuments();

    const now=new Date();

    const oneMonthAgo=new Date(
        now.getFullYear(),
        now.getMonth()-1,
        now.getDate()
    )

    const lastMonthPosts=await Posts.countDocuments({createdAt:{$gte:oneMonthAgo}});

    res.status(200).json({
        posts,
        totalPosts,
        lastMonthPosts
    })
  } catch (error) {
    throw new ApiError(403,error.message);
  }
};

const deletePost=async(req,res)=>{
    if(!(req.user.role=='admin' || req.user._id == req.params.postId)){
      throw new ApiError(404,'not allowed')
    }

    try {
      await Posts.findByIdAndDelete(req.params.postId);
      res.status(200).json({success:true,message:'post deleted successfully'});
    } catch (error) {
      throw new ApiError(404,error.message);
    }
}

const updatePost=async(req,res)=>{
  if(req.user.userRole !=='admin' && req.user._id == req.params.userId){
    throw new ApiError(404,'not allowed')
  }

  try {
    const post=await Posts.findByIdAndUpdate(req.params.postId,{
      $set:{
        title:req.body.title,
        content:req.body.content,
        category:req.body.category,
        image:req.body.image
      }
    },{new:true});
    res.status(200).json({success:true,message:'post deleted successfully',post});
  } catch (error) {
    throw new ApiError(404,error.message);
  }
}
export { create, getPosts, deletePost,updatePost };
