require("dotenv").config();
const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      // useNewParder: true,
      // useUnifiedTopology: true,
    });
    console.log("mongodb is working");
  } catch (err) {
    console.log("Error aagyi bhaisaab   ", err);
    process.exit(1);
  }
};

module.exports = connectDB;
