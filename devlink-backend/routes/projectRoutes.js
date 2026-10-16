import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectsByUser,
} from "../controllers/projectController.js";
import { upload } from "../config/config.js";
import authenticate from "../middlewares/authMiddleware.js"; // assuming you have auth

const router = express.Router();

router.get("/", getAllProjects);
router.get("/id/:projectId", getProjectById);

router.post("/", authenticate, upload.single("image"), createProject);
router.get("/user/:userId", getProjectsByUser);
router.get("/:userId", getProjectsByUser);

export default router;
