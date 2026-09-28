import mongoose from "mongoose";

const connectDB = async () => {
    try {

       const db =  await mongoose.connect(process.env.MONGODB_URL);
       console.log("DB connected successfully!!")
        
    } catch (error) {
        console.error("DB connection error", error)

        
    }
}

export default connectDB;