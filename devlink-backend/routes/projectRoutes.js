import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectsByUser,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { upload } from "../config/config.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/id/:projectId", getProjectById);

router.post("/", authenticate, upload.single("image"), createProject);
router.put("/:projectId", authenticate, upload.single("image"), updateProject);
router.put("/id/:projectId", authenticate, upload.single("image"), updateProject);
router.delete("/:projectId", authenticate, deleteProject);
router.delete("/id/:projectId", authenticate, deleteProject);

router.get("/user/:userId", getProjectsByUser);
router.get("/:userId", getProjectsByUser);

export default router;
