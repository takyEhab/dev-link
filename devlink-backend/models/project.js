import mongoose from "mongoose";
import "./user.js";

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    technologies: {
      type: [String],
      default: [],
    },
    github_link: {
      type: String,
      default: null,
    },
    live_demo: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    duration: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

projectSchema.virtual("githubLink")
  .get(function () { return this.github_link; })
  .set(function (val) { this.github_link = val; });

projectSchema.virtual("liveDemo")
  .get(function () { return this.live_demo; })
  .set(function (val) { this.live_demo = val; });

projectSchema.virtual("user_id").get(function () {
  return (
    this.user?._id?.toString() ||
    this.user?.id?.toString() ||
    (typeof this.user === "string" ? this.user : null)
  );
});

projectSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id?.toString() || ret.id;
    ret.user_id =
      ret.user?._id?.toString() ||
      ret.user?.id?.toString() ||
      (typeof ret.user === "string" ? ret.user : null);
    ret.githubLink = ret.github_link;
    ret.liveDemo = ret.live_demo;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

projectSchema.set("toObject", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id?.toString() || ret.id;
    ret.user_id =
      ret.user?._id?.toString() ||
      ret.user?.id?.toString() ||
      (typeof ret.user === "string" ? ret.user : null);
    ret.githubLink = ret.github_link;
    ret.liveDemo = ret.live_demo;
    delete ret._id;
    delete ret.__v;
  },
});

const normalizeTechnologies = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    return val.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

projectSchema.statics.findByIdWithAuthor = async function (projectId) {
  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    return null;
  }
  const Profile = mongoose.model("Profile");
  const project = await this.findOne({ _id: projectId }).populate("user", "name email");
  if (!project) return null;

  const user = project.user;
  const profile = user ? await Profile.findOne({ user: user._id || user }) : null;

  const obj = project.toObject();
  const authorId = (user?._id || user || "").toString();
  return {
    ...obj,
    id: obj._id?.toString() || obj.id,
    author: {
      id: authorId,
      _id: authorId,
      name: user?.name || "Developer",
      title: profile?.title || "Developer",
      location: profile?.location || "Remote",
    },
  };
};

projectSchema.statics.findAllWithAuthor = async function () {
  const Profile = mongoose.model("Profile");
  const projects = await this.find().populate("user", "name email").sort({ created_at: -1 });

  return Promise.all(
    projects.map(async (p) => {
      const user = p.user;
      const profile = user ? await Profile.findOne({ user: user._id }) : null;
      const obj = p.toObject();
      return {
        ...obj,
        author: user?.name || "Developer",
        category: profile?.title || "Developer Project",
        featured: false,
        premium: false,
        likes: 0,
        views: 0,
      };
    })
  );
};

projectSchema.statics.findByUserId = async function (userId) {
  const projects = await this.find({ user: userId }).sort({ created_at: -1 });
  return projects.map((p) => p.toObject());
};

projectSchema.statics.createProject = async function (data) {
  const doc = new this({
    user: data.userId || data.user,
    title: data.title,
    description: data.description,
    technologies: normalizeTechnologies(data.technologies),
    github_link: data.githubLink || data.github_link,
    live_demo: data.liveDemo || data.live_demo,
    image: data.image,
    duration: data.duration,
  });
  await doc.save();
  return doc.toObject();
};

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

// Backwards-compatible aliases for controllers
Project.findAll = Project.findAllWithAuthor;
Project.findByIdWithAuthor = Project.findByIdWithAuthor;
Project.create = Project.createProject;

export default Project;
