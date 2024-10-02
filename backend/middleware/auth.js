import jwt from "jsonwebtoken";
import catchAsyncError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utility/errorHandler.js";
import User from "../model/user.js";

const secret = "dnvkjdsfniuehfsiunfsklnf2545646848646548454sdfskjfif";

// Middleware to check if the user is authenticated
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  // console.log(token);

  if (!token) {
    return next(new ErrorHandler("Please Login to Access this Resource", 401));
  }

  const decodeData = jwt.verify(token, secret);

  const user = await User.findById(decodeData.user);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Assign the full user data to req.user for further access in routes
  req.user = user;
  next();
});

// Middleware to authorize specific roles for accessing resources
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new ErrorHandler("Role information is missing", 403));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};
