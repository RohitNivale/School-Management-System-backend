const express = require("express");
const Attendance = require("../models/Attendance");
const Result = require("../models/Result");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/student/:studentId", auth, async (req, res) => {
  try {
    const { studentId } = req.params;

    if (req.user.role === "student" && req.user.id !== studentId) {
      return res.status(403).json({ message: "You can only view your own progress." });
    }

    const attendance = await Attendance.find({ studentId });
    const results = await Result.find({ studentId });

    const now = new Date();

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const weeklyAttendance = attendance.filter(a => new Date(a.date) >= weekStart);
    const monthlyAttendance = attendance.filter(a => new Date(a.date) >= monthStart);

    const percentage = list => list.length
      ? (list.filter(a => a.status === "Present").length / list.length) * 100
      : 0;

    const academic = results.length
      ? results.reduce((sum, r) => sum + Number(r.marks), 0) / results.length
      : 0;

    res.json({
      weekly: {
        attendance: Number(percentage(weeklyAttendance).toFixed(2)),
        academic: Number(academic.toFixed(2)),
        records: weeklyAttendance.length
      },
      monthly: {
        attendance: Number(percentage(monthlyAttendance).toFixed(2)),
        academic: Number(academic.toFixed(2)),
        records: monthlyAttendance.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;