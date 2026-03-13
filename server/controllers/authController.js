import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const generateToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(admin._id, admin.username),
      admin: {
        id: admin._id,
        username: admin.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req, res) => {
  res.json({
    admin: req.admin
  });
};