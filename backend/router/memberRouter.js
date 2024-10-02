import express from "express";
import {
  deleteCustomer,
  getAllCustomers,
  getSingleCustomer,
  loginUserData,
  newCustomer,
  updateCustomer,
} from "../controller/memberController.js";
import { isAuthenticated } from "../middleware/auth.js"; // Only keeping authentication

const router = express.Router();

// Get all customers (Admin only in original logic)
router.route("/").get(isAuthenticated, getAllCustomers);

// Create a new customer (Any authenticated user)
router.route("/create").post(isAuthenticated, newCustomer);

// Get logged-in user's data
router.route("/getUserData").get(isAuthenticated, loginUserData);

// Single customer CRUD operations
router
  .route("/getCustomer/:id")
  .get(isAuthenticated, getSingleCustomer) // Get single customer details
  .put(isAuthenticated, updateCustomer) // Update customer details
  .delete(isAuthenticated, deleteCustomer); // Delete customer

export default router;
