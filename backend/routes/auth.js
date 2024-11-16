const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// POST /api/auth/register route
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please provide a username, email, and password.",
    });
  }

  try {
    // Check if email or username already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    // Respond with token and user information (excluding password)
    res.status(201).json({
      message: "User registered successfully.",
      token,
      user: { _id: newUser._id, username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// POST /api/auth/login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide both email and password.",
    });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // Compare provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate JWT token using the user's ID and secret key from the .env file
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h", // Token expiration time (1 hour)
    });

    // Respond with token and user information (excluding password)
    res.json({
      message: "Login successful.",
      token,
      user: { _id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login." });
  }
});

module.exports = router;
