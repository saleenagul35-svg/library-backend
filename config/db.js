const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("Mongoose connected");
  } catch (error) {
    console.log("MongoDB connection error:", error);
    throw error;
  }
};

module.exports = connectDB;