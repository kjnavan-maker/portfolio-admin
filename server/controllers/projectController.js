import Project from "../models/Project.js";

const normalizeTechnologies = (technologies) => {
  if (!technologies) return [];

  if (Array.isArray(technologies)) {
    return technologies.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof technologies === "string") {
    return technologies
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error("getProjects error:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

export const createProject = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      technologies,
      githubLink,
      liveLink,
      year,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Project title is required" });
    }

    if (!description?.trim()) {
      return res.status(400).json({ message: "Project description is required" });
    }

    const project = await Project.create({
      title: title.trim(),
      subtitle: subtitle?.trim() || "",
      description: description.trim(),
      technologies: normalizeTechnologies(technologies),
      githubLink: githubLink?.trim() || "",
      liveLink: liveLink?.trim() || "",
      year: year?.trim() || "",
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("createProject error:", error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      technologies,
      githubLink,
      liveLink,
      year,
    } = req.body;

    const existingProject = await Project.findById(req.params.id);

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title: title?.trim() || existingProject.title,
        subtitle: subtitle?.trim() ?? existingProject.subtitle,
        description: description?.trim() || existingProject.description,
        technologies:
          technologies !== undefined
            ? normalizeTechnologies(technologies)
            : existingProject.technologies,
        githubLink: githubLink?.trim() ?? existingProject.githubLink,
        liveLink: liveLink?.trim() ?? existingProject.liveLink,
        year: year?.trim() ?? existingProject.year,
        image: req.file ? `/uploads/${req.file.filename}` : existingProject.image,
      },
      { new: true, runValidators: true }
    );

    res.json(updatedProject);
  } catch (error) {
    console.error("updateProject error:", error);
    res.status(500).json({ message: "Failed to update project" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("deleteProject error:", error);
    res.status(500).json({ message: "Failed to delete project" });
  }
};