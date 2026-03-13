import fs from "fs";
import path from "path";
import Profile from "../models/Profile.js";

const deleteFileIfExists = (filePath) => {
  if (!filePath) return;

  const fullPath = path.join(process.cwd(), filePath.replace(/^\/+/, ""));
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

export const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();

    if (!profile) {
      profile = await Profile.create({
        fullName: "Navaneethan Karunashankar",
        email: "kjnavaneethan019@gmail.com",
        phone: "+94 764304068",
        location: "Jaffna, Sri Lanka",
        bio: "Motivated Software Engineering student.",
        image: "",
        showAboutImage: false,
      });
    }

    res.json(profile);
  } catch (error) {
    console.error("getProfile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      location,
      bio,
      removeImage,
      showAboutImage,
    } = req.body;

    if (!fullName?.trim()) {
      return res.status(400).json({ message: "Full name is required" });
    }

    if (!email?.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    let profile = await Profile.findOne();

    if (!profile) {
      profile = new Profile({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone?.trim() || "",
        location: location?.trim() || "",
        bio: bio?.trim() || "",
        image: "",
        showAboutImage: showAboutImage === "true",
      });
    } else {
      profile.fullName = fullName.trim();
      profile.email = email.trim();
      profile.phone = phone?.trim() || "";
      profile.location = location?.trim() || "";
      profile.bio = bio?.trim() || "";
      profile.showAboutImage = showAboutImage === "true";
    }

    if (removeImage === "true") {
      if (profile.image) {
        deleteFileIfExists(profile.image);
      }
      profile.image = "";
    }

    if (req.file) {
      if (profile.image) {
        deleteFileIfExists(profile.image);
      }
      profile.image = `/uploads/${req.file.filename}`;
    }

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error("updateProfile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};