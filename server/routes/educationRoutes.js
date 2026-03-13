import express from "express";
import {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation
} from "../controllers/educationController.js";

const router = express.Router();

router.get("/", getEducation);
router.post("/", createEducation);
router.put("/:id", updateEducation);
router.delete("/:id", deleteEducation);

export default router;