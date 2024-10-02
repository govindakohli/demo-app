import ErrorHandler from "../utility/errorHandler.js";

const error = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //Wrong MongoDB ID Error
  if (err.name === "CastError") {
    const message = `Resource Not Found Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  //Wrong JWT error
  if (err.name === "jsonWebTokenError") {
    const message = `Json web Token is invalid Try again`;
    err = new ErrorHandler(message, 400);
  }

  //JWT Expire error
  if (err.name === "TokenExpiredError") {
    const message = `Json web Token is Expired Try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default error;
