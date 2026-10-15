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
      title,
      location,
      bio,
      skills,
      education,
      github,
      portfolio,
      linkedin,
      avatar,
    } = req.body;

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
      linkedin: linkedin?.trim() || null,
      avatar: avatar?.trim() || null,
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
