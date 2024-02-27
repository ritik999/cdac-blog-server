import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";

const option={
  httpOnly: true,
  secure:true
}

const testUser = async (req, res) => {
  res.status(200).json({ msg: "hi" });
};

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const isUserExist = await User.findOne({ $or: [{ email }, { username }] });

  if (isUserExist) throw new ApiError(404, "user already exist");

  const user = await User.create({ username, email, password });

  if (!user) {
    throw new ApiError(500, "unable to create user");
  }

  res.status(200).json({ success: true, message: "user created", user });
};


const loginUser=async(req,res)=>{
  const {username,email,password}=req.body;

  if(!(username || email || password)){
    throw new ApiError(404,'all fields are required');
  }

  const user=await User.findOne({$or:[{username},{email}]});

  if(!user){
    throw new ApiError(400,'Invalid user');
  }

  const isPasswordCorrect=await user.isPasswordCorrect(password);

  if(!isPasswordCorrect){
    throw new ApiError(404,'Incorrect password');
  }

  const generateAccessToken=await user.generateAccessToken();
  console.log(generateAccessToken);

  

  res.status(200)
  .cookie('accessToken',generateAccessToken,option)
  .json({success:true,accessToken:generateAccessToken,message:'user logged-in successfully',user});
}

const google=async(req,res)=>{
  const {name,email,googlePhotoUrl}=req.body;
  console.log(name,email,googlePhotoUrl);
  try {
    const user=await User.findOne({email}).select('-password');
    console.log(user);
    if(user){
      const token=await user.generateAccessToken();

      console.log(token);
      res.status(200).cookie('access-token',token,option).json({success:true,accessToken:token,message:'user logged-in successfully',user});
    }else{
      const generatePassword=Math.random().toString(36).slice(-8);

      // const hashedPassword=await User.hashedPassword();

      const addUser=await User.create({
        username:name.toLowerCase().split(' ').join('')+Math.random().toString(36).slice(-4),
        email:email,
        password:generatePassword,
        profilePicture:googlePhotoUrl
      })

      const token=await addUser.generateAccessToken();
      console.log(token);

      res.status(200).cookie('access-token',token,option).json({success:true,accessToken:token,message:'user logged-in successfully',user:addUser});
    }

  } catch (error) {
    console.log(error.message);
  }
}

const updateUser=async(req,res)=>{
    if(req.user.id !== req.params.id){
      throw new ApiError(404,'you are not allowed to make changes');
    }

    try {
      const user=await User.findByIdAndUpdate(req.user._id,{$set:{
        username:req.body.username,
        email:req.body.email,
        profilePicture:req.body.profilePicture,
        password:req.body.password
      }},{new:true}).select('-password');

      res.status(200).json({success:true,message:'updated successfully',user})
    } catch (error) {
      throw new ApiError(404,error?.message)
    }
}

const deleteUser=async(req,res)=>{
  if(req.user.userRole !== 'admin' && req.user._id !== req.params.id){
    throw new ApiError(403,'you are not allowed to delete.')
  }
console.log(req.user._id);
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({success:true,message:'user deleted successfully'});
  } catch (error) {
    throw new ApiError(402,error.message);
  }
}

const signoutUser=async(req,res)=>{
  try {
    res.status(200).clearCookie('accessToken').json({success:true,message:'signout successfully'});  
  } catch (error) {
    throw new ApiError(400,error.message);
  }
}

const getUsers=async(req,res)=>{
  console.log(req.user);
  if(req.user.userRole !== 'admin'){
    throw new ApiError(404,'not allowed')
  }

  try {
    const startIndex=parseInt(req.query.startIndex) || 0;
    const limit=parseInt(req.query.limit) || 9;
    const shortDirection=req.query.sort='asc'?1:-1;

    const user=await User.find().sort({createdAt:shortDirection}).skip(startIndex).limit(limit).select('-password');

    const totalUser=await User.countDocuments();

    const now= new Date();

    const oneMonthAgo=new Date(
      now.getFullYear(),
      now.getMonth()-1,
      now.getDate()
    )

    const lastMonthUser=await User.countDocuments({createdAt:{$gte:oneMonthAgo}});

    res.status(200).json({success:true,user,totalUser,lastMonthUser});
  } catch (error) {
    throw new ApiError(400,error.message);
  }
}

export { testUser, registerUser, loginUser, updateUser, signoutUser,deleteUser, getUsers, google };
