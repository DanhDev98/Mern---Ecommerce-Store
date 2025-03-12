import { generateToken } from "../lib/util.js";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { redis } from "../lib/redis.js";
import jwt from "jsonwebtoken";
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

const setCookie = (res, refreshToken, accessToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, //15P minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
  });
};
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already registered" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    // bycrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    //authenticate user
    const { accessToken, refreshToken } = generateToken(newUser._id);
    await storeRefreshToken(newUser._id, refreshToken);
    setCookie(res, refreshToken, accessToken);
    res.status(201).json({
      message: "User registered successfully",
      newUser: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log("Error in signup: ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not registered" });
    }
    //check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password incorrect" });
    }

    //authenticate user
    const { accessToken, refreshToken } = generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookie(res, refreshToken, accessToken);
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        cartItems: user.cartItems
      },
    });
  } catch (error) {
    console.log("Error in login: ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      redis.del(`refresh token:${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error in logout: ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const refreshTokens = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token" });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const token = await redis.get(`refresh token:${decoded.userId}`);
    if (token !== refreshToken) {
      return res.status(400).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, //15P minutes
    });
    res.status(200).json({ message: "Refresh token successful" });
  } catch (error) {
    console.log("Error in refreshTokens: ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user data" });
    }

    res.json({ user: req.user }); // Trả về user đúng format
  } catch (error) {
    console.log("Error from getProfile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

