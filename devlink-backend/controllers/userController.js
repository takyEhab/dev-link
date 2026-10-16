import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Profile from "../models/profile.js";

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true" || isProduction,
  sameSite: process.env.COOKIE_SAME_SITE || (isProduction ? "none" : "lax"),
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

const enrichUserWithProfile = async (user) => {
  if (!user) return user;
  const userObj = user.toObject ? user.toObject() : { ...user };
  const { password: _password, __v, ...safeUser } = userObj;

  try {
    const profile = await Profile.findOne({ user: user._id || user.id });
    if (profile) {
      safeUser.avatar = profile.avatar || null;
      safeUser.title = profile.title || null;
      safeUser.location = profile.location || null;
      safeUser.bio = profile.bio || null;
    } else {
      safeUser.avatar = null;
      safeUser.title = null;
    }
  } catch (err) {
    console.error("Error attaching profile to user:", err);
  }

  return safeUser;
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !name || !password) {
      const error = new Error("Please enter both name and email and password");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOneByEmail(email);
    if (existingUser) {
      const error = new Error("Email already exists");
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      },
    );

    res.cookie("token", token, cookieOptions);

    const safeUser = await enrichUserWithProfile(newUser);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: { user: safeUser, token },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Please enter both email and password");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOneByEmail(email);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.cookie("token", token, cookieOptions);

    const safeUser = await enrichUserWithProfile(user);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: { user: safeUser, token },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const safeUser = await enrichUserWithProfile(user);

    res.status(200).json({ isAuthenticated: true, user: safeUser });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", cookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
