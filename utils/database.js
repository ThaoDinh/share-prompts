import mongoose from "mongoose";
let isConnected = false; // track connection status
export const connectToDB = async () => {
  mongoose.set("strictQuery", true); // recommended, if not you will get a warning in console
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "shared_prompt",
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};
