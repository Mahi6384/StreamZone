require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./database");
const experienceRoutes = require("./routes/experienceRoutes");
const userRoutes = require("./routes/userRoutes");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const app = express();

// Reflect request Origin so localhost + deployed SPAs work; pair with CORS headers in error handler below.
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
//urlencoded means it is saying express read form data from the frontend or postman
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/experiences", experienceRoutes);
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.send(`<h1>Hello Backend is working</h1>`);
});

/** JSON errors + CORS headers so browsers don’t report a misleading CORS failure on 500/HTML. */
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  }
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message, code: err.code });
  }
  const status = Number(err.status) || Number(err.statusCode) || 500;
  const message = err.message || "Server error";
  res.status(status).json({ error: message });
});

connectDB();
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
