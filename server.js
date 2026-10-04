const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");
require("dotenv").config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const resultRoutes = require("./routes/resultRoutes");
const progressRoutes = require("./routes/progressRoutes");
const noticeRoutes = require("./routes/noticeRoutes");

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/notices", noticeRoutes);

app.get("/", (req, res) => {
  res.json({ message: "School Management API is running" });
});

async function run() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to MongoDB");
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

run().catch((error) => {
  console.error("MongoDB connection failed:", error.message);
  process.exitCode = 1;
});