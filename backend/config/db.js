
import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect(`${process.env.MONGODB_URL}/food-del`).then(()=>console.log("DB Connected"));
}






