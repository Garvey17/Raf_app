import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://gamingsentral9_db_user:MDqfYTDXwXGKTsW6@cluster0.o693qvu.mongodb.net/af-raf";

if (!MONGODB_URI) {
  throw new Error("Please add MONGO_URI to .env");
}

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};


connectDB()