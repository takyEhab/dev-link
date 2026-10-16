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
    const project = await Project.findById(req.params.projectId);
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

export const getProjectsByUser = async (req, res, next) => {
  try {
    const projects = await Project.findByUserId(req.params.userId);
    res.json(projects);
  } catch (err) {
    next(err);
  }
};
