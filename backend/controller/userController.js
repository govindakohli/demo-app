import User from "../model/user.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utility/errorHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secret = "dnvkjdsfniuehfsiunfsklnf2545646848646548454sdfskjfif";

//Register user
export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("all fields are required", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User With This Email Already Exists!", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ user: user._id }, secret, { expiresIn: "6h" });

  res.status(200).cookie("token", token, { httpOnly: true }).json({
    success: true,
    user,
    token,
  });
});

//Login user

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email and Password", 400));
  }

  // Find user by email and explicitly select the password
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }

  // Compare the provided password with the stored hashed password
  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }

  // Generate the JWT token
  const token = jwt.sign({ user: user._id }, secret, { expiresIn: "5h" });

  // Send response with token
  res.status(200).cookie("token", token, { httpOnly: true }).json({
    success: true,
    user,
    token,
  });
});

// Logout user
export const logout = catchAsyncError(async (req, res, next) => {
  res.status(200).clearCookie("token", { httpOnly: true }).json({
    message: "Logout successful",
  });
});

// Change Password
export const changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(new ErrorHandler("Please enter old and new password", 400));
  }

  // Find user by ID
  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check if old password matches
  const isMatched = await bcrypt.compare(oldPassword, user.password);
  if (!isMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  // Hash the new password and save it
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

// Update User Profile
export const updateProfile = catchAsyncError(async (req, res) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
  });

  res.status(200).json({
    success: true,
  });
});

// Route to check if the user is an admin
export const isAdmin = catchAsyncError(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("Please log in", 401)); // Ensure user is logged in
  }

  // Check if the user's role is 'admin'
  const isAdmin = req.user.role === "admin";

  res.status(200).json(isAdmin);
});
