const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, className, rollNo, subject } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    if (!name || !normalizedEmail || !password || !role) {
      return res.status(400).json({ message: "Name, email, password and role are required." });
    }
    if (!["teacher", "student"].includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(400).json({ message: "Email already registered." });

    const user = await User.create({
      name: name.trim(), email: normalizedEmail, password: await bcrypt.hash(password, 10),
      role, className, rollNo, subject
    });

    res.status(201).json({ message: "Registration successful", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail || !password || !["teacher", "student"].includes(role)) {
      return res.status(400).json({ message: "Email, password and portal are required." });
    }
    const user = await User.findOne({ email: normalizedEmail, role });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token, role: user.role, userId: user._id, name: user.name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;