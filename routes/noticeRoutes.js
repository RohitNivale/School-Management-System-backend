const express = require("express");
const Notice = require("../models/Notice");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", auth, async (req, res) => {
  try {
    if (req.user.role !== "teacher") return res.status(403).json({ message: "Only teachers can publish notices." });

    const { title, description } = req.body;
    if (!title || !description) return res.status(400).json({ message: "Title and description are required." });

    const notice = await Notice.create({ title, description, createdBy: req.user.id });
    res.json({ message: "Notice published successfully.", notice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;