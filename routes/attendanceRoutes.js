const express = require("express");
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/students", auth, async (req, res) => {
  if (req.user.role !== "teacher") return res.status(403).json({ message: "Teacher access only." });
  const students = await User.find({ role: "student" }).select("-password").sort({ rollNo: 1, name: 1 });
  res.json(students);
});

router.post("/mark", auth, async (req, res) => {
  try {
    if (req.user.role !== "teacher") return res.status(403).json({ message: "Only teachers can mark attendance." });

    const { studentId, date, status } = req.body;
    if (!studentId || !date || !status) return res.status(400).json({ message: "All attendance fields are required." });

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const record = await Attendance.findOneAndUpdate(
      { studentId, date: { $gte: dayStart, $lt: dayEnd } },
      { studentId, date: dayStart, status, markedBy: req.user.id },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ message: "Attendance saved successfully.", attendance: record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/student/:studentId", auth, async (req, res) => {
  try {
    if (req.user.role === "student" && req.user.id !== req.params.studentId) {
      return res.status(403).json({ message: "You can only view your own attendance." });
    }
    const records = await Attendance.find({ studentId: req.params.studentId }).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;