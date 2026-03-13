import Skill from "../models/Skill.js";

export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch skills" });
  }
};

export const createSkill = async (req, res) => {
  try {
    const { name, level, icon } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Skill name is required" });
    }

    const skill = await Skill.create({
      name: name.trim(),
      level: level?.trim() || "",
      icon: icon?.trim() || ""
    });

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: "Failed to create skill" });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name?.trim() || skill.name,
        level: req.body.level?.trim() ?? skill.level,
        icon: req.body.icon?.trim() ?? skill.icon
      },
      { new: true, runValidators: true }
    );

    res.json(updatedSkill);
  } catch (error) {
    res.status(500).json({ message: "Failed to update skill" });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete skill" });
  }
};