import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()
const url = process.env.MONGODB_EXPRESS_URL;


export const connectDB = async () => {
  try {
    await mongoose.connect(String(url));
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};