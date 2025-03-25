import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("mongodb connected suceesfully");
        
    }catch(error){
        console.log("Error connecting to mogodb",error);
        
    }
}

export default connectDB