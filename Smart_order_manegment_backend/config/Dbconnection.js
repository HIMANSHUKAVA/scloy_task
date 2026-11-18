import mongoose from "mongoose";

export async function GetMongoConnection() {
    
    try {
        console.log("mongo connecting....");
        await mongoose.connect(process.env.MONGO_URL , {
            serverSelectionTimeoutMS: 5000,
        })
        console.log("mongodb connected");
        
    } catch (error) {
        console.log("connecting error" , error.message);
        
    }
}