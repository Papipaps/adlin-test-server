import mongoose from "mongoose";

const url = "mongodb://localhost:27017/reservationadlin";
export const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}; 

