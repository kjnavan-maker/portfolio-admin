import express from "express";
import {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate
} from "../controllers/certificateController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getCertificates);
router.post("/", upload.single("image"), createCertificate);
router.put("/:id", upload.single("image"), updateCertificate);
router.delete("/:id", deleteCertificate);

export default router;