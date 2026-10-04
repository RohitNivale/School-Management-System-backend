const express = require("express");
const cors = require("cors");
const dns = require("dns");
require("dotenv").config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectToDatabase = require("./database");
const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const resultRoutes = require("./routes/resultRoutes");
const progressRoutes = require("./routes/progressRoutes");
const noticeRoutes = require("./routes/noticeRoutes");

const app = express();
const allowedOrigins = [
  "https://school-management--frontend.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use((req, res, next) => {
  connectToDatabase().then(() => next(), next);
});

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/notices", noticeRoutes);

app.get("/", (req, res) => {
  res.json({ message: "School Management API is running" });
});

module.exports = app;
