import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Profile =
  mongoose.models.Profile || mongoose.model("Profile", profileSchema);

export default Profile;