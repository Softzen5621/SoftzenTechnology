const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is undefined");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (err) {
    console.log("DB ERROR:", err.message);
    process.exit(1);
  }
};
// taskkill /F /IM node.exe
module.exports = connectDB;
