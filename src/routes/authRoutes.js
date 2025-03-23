import express from "express";
import User from "./../models/user.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const generateToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15d" }
  );
};

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    console.log(req.body);
    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fiels are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be at least 6 characters long" });
    }
    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username should be at least 3 characters long" });
    }
    // check if user is alraedy exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "User already exists" });
    }
    const existingUsername = await User.findOne({ email });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // get random avatar
    const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;
    const user = new User({
      email,
      username,
      password,
      profileImage: profileImage,
    });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log("Error in register route", error);
    res.status(500).json({ message: "Internal Error" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fiels are required" });
    }

    //check if exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const correctPassword = await user.comparePassword(password);
    if (!correctPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //generate token
    const token = generateToken(user._id);
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log("Error in register route", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
