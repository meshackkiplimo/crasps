import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectBb=async () => {
    try {
        const uri = process.env.MONGODB_URI 
        if(!uri){
            throw new Error("mongodb is not defined in the env")
        }
        await mongoose.connect(uri,{})
        console.log("connected to mongodb")

    } catch (error) {
        console.log("error connected to db",error)
        
    }

    
}