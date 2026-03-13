import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    year: {
      type: String
    },
    description: {
      type: String
    }
  },
  { timestamps: true }
);

const Education = mongoose.model("Education", educationSchema);

export default Education;