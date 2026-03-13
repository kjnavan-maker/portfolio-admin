import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";

dotenv.config();
await connectDB();

const run = async () => {
  try {
    const existing = await Admin.findOne({ username: "admin" });

    if (existing) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await Admin.create({
      username: "admin",
      password: hashedPassword
    });

    console.log("Admin created successfully");
    process.exit();
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

run();