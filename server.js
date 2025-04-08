const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./database");
const videoRoutes = require("./routes/videoRoutes");
const path = require("path");

const PORT = 5000;
const app = express();

app.use(express.json());
app.use("/api/videos", videoRoutes);
app.use(express.urlencoded({ extended: true }));
//urlencoded means it is saying express read form data from the frontend or potman
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
connectDB();

app.get("/", (req, res) => {
  res.send(`<h1>Hello Backend is working</h1>`);
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
