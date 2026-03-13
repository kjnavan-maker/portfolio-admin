import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    description: { type: String, required: true },
    technologies: [{ type: String }],
    githubLink: { type: String, default: "" },
    liveLink: { type: String, default: "" },
    year: { type: String, default: "" },
    image: { type: String, default: "" }
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;