import Profile from "../models/profile.js";

export const getProfiles = async (req, res, next) => {
  try {
    const profiles = await Profile.findAll();

    res.json({
      success: true,
      data: { profiles },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOneByUserId(req.user.userId);

    if (!profile) {
      res.status(404);
      throw new Error("Profile not found");
    }

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: { profile },
    });
  } catch (err) {
    next(err);
  }
};

export const createOrUpdateProfile = async (req, res, next) => {
  try {
    const {
      name,
      title,
      location,
      bio,
      skills,
      education,
      github,
      portfolio,
      linkedin,
      linkedIn,
      avatar,
    } = req.body;

    const resolvedLinkedin = (linkedin || linkedIn)?.trim() || null;

    const uploadedAvatar =
      req.file?.path ||
      req.file?.secure_url ||
      req.file?.url ||
      (typeof avatar === "string" && avatar.trim() ? avatar.trim() : null);

    // Update user display name if provided
    if (name && typeof name === "string" && name.trim()) {
      const User = (await import("../models/user.js")).default;
      await User.findByIdAndUpdate(req.user.userId, { name: name.trim() });
    }

    // Normalize skills
    let normalizedSkills = [];

    if (Array.isArray(skills)) {
      normalizedSkills = skills
        .filter((skill) => typeof skill === "string")
        .map((skill) => skill.trim())
        .filter(Boolean);
    } else if (typeof skills === "string") {
      normalizedSkills = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    // Validate required fields
    const missingFields = [];

    if (!title?.trim()) {
      missingFields.push("title");
    }

    if (!location?.trim()) {
      missingFields.push("location");
    }

    if (!bio?.trim()) {
      missingFields.push("bio");
    }

    if (normalizedSkills.length === 0) {
      missingFields.push("skills");
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Required profile fields missing: ${missingFields.join(", ")}`,
      });
    }

    // Check if profile already exists
    const existingProfile = await Profile.findOneByUserId(
      req.user.userId
    );

    // Retain existing avatar if not explicitly overwritten
    const finalAvatar = uploadedAvatar || (existingProfile ? existingProfile.avatar : null);

    const profileData = {
      user: req.user.userId,
      userId: req.user.userId,
      title: title.trim(),
      location: location.trim(),
      bio: bio.trim(),
      skills: normalizedSkills,
      education: education?.trim() || null,
      github: github?.trim() || null,
      portfolio: portfolio?.trim() || null,
      linkedin: resolvedLinkedin,
      avatar: finalAvatar || null,
    };

    // Update existing profile
    if (existingProfile) {
      const profile = await Profile.updateByUserId(
        req.user.userId,
        profileData
      );

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: { profile },
      });
    }

    // Create new profile
    const profile = await Profile.createProfile(profileData);

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfileByUserId = async (req, res, next) => {
  try {
    const profile = await Profile.findOneByUserId(req.params.userId);

    if (!profile) {
      res.status(404);
      throw new Error("Profile not found");
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: { profile },
    });
  } catch (err) {
    next(err);
  }
};
