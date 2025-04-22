const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./database");
const videoRoutes = require("./routes/videoRoutes");
const userRoutes = require("./routes/userRoutes");
const path = require("path");
const cors = require("cors");
const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//urlencoded means it is saying express read form data from the frontend or postman
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/videos", videoRoutes);
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.send(`<h1>Hello Backend is working</h1>`);
});
connectDB();
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
