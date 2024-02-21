import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connect.host}`);
    } catch (error) {
        console.log('MONGODB connection error',error);
        process.exit(1);  // to exit process
    }
}

export default connectDB;