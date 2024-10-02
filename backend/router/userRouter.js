import express from "express";
import {
  changePassword,
  isAdmin,
  login,
  logout,
  register,
  updateProfile,
} from "../controller/userController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/password/change").put(isAuthenticated, changePassword);
router.route("/update").put(isAuthenticated, updateProfile);

router.route("/check-admin").get(isAuthenticated, isAdmin);

export default router;
