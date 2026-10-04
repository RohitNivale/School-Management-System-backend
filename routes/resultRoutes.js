const express = require("express");
const Result = require("../models/Result");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", auth, async (req, res) => {
  try {
    if (req.user.role !== "teacher") return res.status(403).json({ message: "Only teachers can add results." });

    const { studentId, subject, marks, exam } = req.body;
    if (!studentId || !subject || marks === undefined || !exam) {
      return res.status(400).json({ message: "All result fields are required." });
    }

    const result = await Result.create({
      studentId, subject, marks: Number(marks), exam, enteredBy: req.user.id
    });

    res.json({ message: "Result saved successfully.", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/student/:studentId", auth, async (req, res) => {
  try {
    if (req.user.role === "student" && req.user.id !== req.params.studentId) {
      return res.status(403).json({ message: "You can only view your own results." });
    }
    const results = await Result.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;