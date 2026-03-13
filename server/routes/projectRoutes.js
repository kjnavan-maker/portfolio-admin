import express from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} from "../controllers/projectController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getProjects);
router.post("/", upload.single("image"), createProject);
router.put("/:id", upload.single("image"), updateProject);
router.delete("/:id", deleteProject);

export default router;