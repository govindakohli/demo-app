import Customer from "../model/member.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utility/errorHandler.js";

// Get all customers
export const getAllCustomers = catchAsyncError(async (req, res, next) => {
  const customers = await Customer.find();
  if (!customers) {
    return next(new ErrorHandler("customer not find!", 400));
  }
  res.status(200).json(customers);
});

//Get Single Customer
export const getSingleCustomer = catchAsyncError(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return next(new ErrorHandler("customer not find!", 400));
  }
  res.status(200).json(customer);
});

// Create a new customer
export const newCustomer = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, number, email, memberShip } = req.body;

  if (!firstName || !lastName || !number || !email || !memberShip) {
    return next(new ErrorHandler("all fields are required!", 400));
  }

  const customer = new Customer({
    firstName,
    lastName,
    number,
    email,
    memberShip,
    createdBy: req.user._id,
  });
  const savedCustomer = await customer.save();

  if (!savedCustomer) {
    return next(new ErrorHandler("customer not saved!", 400));
  }

  res.status(200).json(savedCustomer);
});

// Update a customer
export const updateCustomer = catchAsyncError(async (req, res, next) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!customer) {
    return next(new ErrorHandler("customer not update!", 400));
  }
  res.status(200).json(customer);
});

// Delete a customer
export const deleteCustomer = catchAsyncError(async (req, res, next) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer) {
    return next(new Error("Customer not found", 404));
  }

  res.status(200).json({
    message: "Customer Deleted Successfully",
  });
});

//Get loging user data
export const loginUserData = catchAsyncError(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("Please Login to Access this Resource", 400));
  }
  const getUserData = await Customer.find({ createdBy: req.user._id });

  if (!getUserData) {
    return next(new ErrorHandler("user not found", 400));
  }

  res.status(200).json(getUserData);
});
