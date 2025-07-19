import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken"; 
import User from "../models/user.model.js"

export const signupController = async (req, res) => {
  const { username,email, password } = req.body;
  try {
    // 1. Input Validation
    if (!username ||!email || !password) {
      return res.status(400).json({ message: "Please enter all fields." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address." });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email }); 
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

   const hashedPassword = await bcrypt.hash(password, 10);
   const newUser = new User({ username, email, password: hashedPassword });
   await newUser.save();

    const payload = {
      user: {
        id: newUser._id,
        email: newUser.email,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }, 
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          message: "User registered successfully",
          token,
          userId: newUser._id,
          email: newUser.email,
        });
      }
    );
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ message: "Server error during signup." });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields." });
    }

    const user = await User.findOne({ email }); 
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials." }); 
    }

    // 4. Generate JWT
    const payload = {
      user: {
        id: user._id,
        email: user.email,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          message: "Logged in successfully",
          token,
          userId: user._id,
          email: user.email,
        });
      }
    );
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error during login." });
  }
};

export const logoutController = (req, res) => {
  res.status(200).json({ message: "Logged out successfully." });
};
