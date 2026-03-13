import Education from "../models/Education.js";

export const getEducation = async (req, res) => {
  try {
    const education = await Education.find().sort({ createdAt: -1 });
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch education" });
  }
};

export const createEducation = async (req, res) => {
  try {
    const { title, institution, year, description } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Education title is required" });
    }

    if (!institution?.trim()) {
      return res.status(400).json({ message: "Institution is required" });
    }

    const education = await Education.create({
      title: title.trim(),
      institution: institution.trim(),
      year: year?.trim() || "",
      description: description?.trim() || "",
    });

    res.status(201).json(education);
  } catch (error) {
    res.status(500).json({ message: "Failed to create education" });
  }
};

export const updateEducation = async (req, res) => {
  try {
    const education = await Education.findById(req.params.id);

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    const updatedEducation = await Education.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title?.trim() || education.title,
        institution: req.body.institution?.trim() || education.institution,
        year: req.body.year?.trim() ?? education.year,
        description: req.body.description?.trim() ?? education.description,
      },
      { new: true, runValidators: true }
    );

    res.json(updatedEducation);
  } catch (error) {
    res.status(500).json({ message: "Failed to update education" });
  }
};

export const deleteEducation = async (req, res) => {
  try {
    const education = await Education.findById(req.params.id);

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    await Education.findByIdAndDelete(req.params.id);

    res.json({ message: "Education deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete education" });
  }
};