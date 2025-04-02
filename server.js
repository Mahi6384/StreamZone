const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const connectDB = require("./database");

const PORT = 5000;
const app = express();

connectDB();
app.get("/", (req, res) => {
  res.send(`<h1>Hello Backend is working</h1>`);
});

app.get("/hello", (req, res) => {
  res.json({ message: "Hello, welcome!!!!" });
});

app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
