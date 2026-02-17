import mongoose from "mongoose";

export const connectMongo = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/coderhouse_backend");
    console.log("MongoDB conectado");
  } catch (error) {
    console.error("Error MongoDB:", error.message);
    process.exit(1);
  }
};
