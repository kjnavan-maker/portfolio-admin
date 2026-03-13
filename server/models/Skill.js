import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    level: {
      type: String,
      default: "Beginner"
    },
    icon: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;