import mongoose from "mongoose";
import Project from "../models/project.js";

export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.findAll();
    res.json({ success: true, data: { projects } });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findByIdWithAuthor(req.params.projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ success: true, data: { project } });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { title, description, technologies, githubLink, liveDemo, duration } =
      req.body;

    let imageUrl =
      req.file?.path ||
      req.file?.secure_url ||
      req.file?.url ||
      (typeof req.body.image === "string" ? req.body.image.trim() : null) ||
      (typeof req.body.imageUrl === "string" ? req.body.imageUrl.trim() : null);

    const project = await Project.create({
      userId: req.user.userId,
      title,
      description,
      technologies,
      githubLink,
      liveDemo,
      duration,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: { project },
      ...project,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = await Project.findOne({ _id: projectId });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectAuthorId = (project.user?._id || project.user || "").toString();
    if (projectAuthorId !== req.user.userId.toString()) {
      return res
        .status(403)
        .json({ error: "You are not authorized to edit this project" });
    }

    const {
      title,
      description,
      technologies,
      githubLink,
      liveDemo,
      duration,
      removeImage,
    } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ error: "Project title is required" });
    }

    if (title !== undefined) project.title = title.trim();
    if (description !== undefined) project.description = description.trim();
    if (technologies !== undefined) {
      project.technologies = Array.isArray(technologies)
        ? technologies.map((t) => t.trim()).filter(Boolean)
        : typeof technologies === "string"
        ? technologies.split(",").map((t) => t.trim()).filter(Boolean)
        : [];
    }
    if (githubLink !== undefined) {
      project.github_link = githubLink ? githubLink.trim() : null;
    }
    if (liveDemo !== undefined) {
      project.live_demo = liveDemo ? liveDemo.trim() : null;
    }
    if (duration !== undefined) {
      project.duration = duration ? duration.trim() : null;
    }

    // Handle image update
    if (req.file) {
      project.image = req.file.path || req.file.secure_url || req.file.url;
    } else if (removeImage === true || removeImage === "true") {
      project.image = null;
    } else if (typeof req.body.imageUrl === "string") {
      const trimmed = req.body.imageUrl.trim();
      project.image = trimmed || null;
    } else if (typeof req.body.image === "string") {
      const trimmed = req.body.image.trim();
      project.image = trimmed || null;
    }

    await project.save();

    res.json({
      success: true,
      message: "Project updated successfully",
      data: { project: project.toObject() },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = await Project.findOne({ _id: projectId });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectAuthorId = (project.user?._id || project.user || "").toString();
    if (projectAuthorId !== req.user.userId.toString()) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this project" });
    }

    await Project.deleteOne({ _id: projectId });

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectsByUser = async (req, res, next) => {
  try {
    const projects = await Project.findByUserId(req.params.userId);
    res.json(projects);
  } catch (err) {
    next(err);
  }
};
