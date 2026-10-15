import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    title: {
      type: String,
      trim: true,
      default: "Developer",
    },
    location: {
      type: String,
      trim: true,
      default: "Remote",
    },
    skills: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    education: {
      type: String,
      trim: true,
      default: "",
    },
    portfolio: {
      type: String,
      trim: true,
      default: "",
    },
    github: {
      type: String,
      trim: true,
      default: "",
    },
    linkedin: {
      type: String,
      trim: true,
      default: "",
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

profileSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

profileSchema.set("toObject", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const formatProfile = (doc, projectCount = 0) => {
  if (!doc) return null;
  const p = doc.toObject ? doc.toObject() : doc;
  const user = p.user;
  const userId = user?._id || user?.id || user;
  return {
    ...p,
    id: p._id?.toString() || p.id,
    user_id: userId?.toString(),
    user: user && typeof user === "object"
      ? {
          id: (user._id || user.id || userId).toString(),
          name: user.name,
          email: user.email,
        }
      : { id: userId?.toString() },
    skills: Array.isArray(p.skills) ? p.skills : [],
    projectCount,
  };
};

profileSchema.statics.findAll = async function () {
  const Project = mongoose.model("Project");
  const profiles = await this.find().populate("user", "name email").sort({ created_at: -1 });

  return Promise.all(
    profiles.map(async (p) => {
      const count = await Project.countDocuments({ user: p.user?._id || p.user });
      return formatProfile(p, count);
    })
  );
};

profileSchema.statics.findOneByUserId = async function (userId) {
  const profile = await this.findOne({ user: userId }).populate("user", "name email");
  return formatProfile(profile);
};

profileSchema.statics.createProfile = async function (profileData) {
  const doc = await this.create({
    user: profileData.userId,
    title: profileData.title,
    location: profileData.location,
    skills: profileData.skills,
    bio: profileData.bio,
    education: profileData.education,
    portfolio: profileData.portfolio,
    github: profileData.github,
    linkedin: profileData.linkedin,
    avatar: profileData.avatar,
  });
  return this.findOneByUserId(profileData.userId);
};

profileSchema.statics.updateByUserId = async function (userId, profileData) {
  await this.findOneAndUpdate(
    { user: userId },
    {
      $set: {
        title: profileData.title,
        location: profileData.location,
        skills: profileData.skills,
        bio: profileData.bio,
        education: profileData.education,
        portfolio: profileData.portfolio,
        github: profileData.github,
        linkedin: profileData.linkedin,
        avatar: profileData.avatar,
      },
    },
    { new: true }
  );
  return this.findOneByUserId(userId);
};

const Profile = mongoose.models.Profile || mongoose.model("Profile", profileSchema);

export default Profile;
