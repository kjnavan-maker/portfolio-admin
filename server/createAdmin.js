import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({ username: "admin" });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    await Admin.create({
      username: "admin",
      password: hashedPassword,
    });

    console.log("Admin created successfully");
    console.log("username: admin");
    console.log("password: 123456");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();