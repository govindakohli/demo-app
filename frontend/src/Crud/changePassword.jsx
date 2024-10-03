import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./changePassword.css";

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
    },
    validationSchema: yup.object({
      oldPassword: yup.string().required("Please enter your old password."),
      newPassword: yup
        .string()
        .min(6, "New password must be at least 6 characters long.")
        .required("Please enter your new password."),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token") || Cookies.get("token");
        if (!token) {
          console.error("No token found, redirecting to login.");
          navigate("/login");
          return;
        }

        // Send change password request
        const response = await axios.put(
          `http://localhost:5000/api/password/change`,
          {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
          },
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Password changed successfully:", response.data);
        setIsLoading(false);
        navigate("/"); // Redirect to profile or any other page
      } catch (error) {
        console.error("Error changing password:", error);
        setIsLoading(false);
      }
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="change-password-container">
      <h1 className="change-password-title">Change Password</h1>
      <Link to="/" className="back-link">
        <button type="button" className="back-btn">Back</button>
      </Link>
      <form onSubmit={formik.handleSubmit} className="change-password-form">
        <div className="form-group">
          <label htmlFor="oldPassword" className="form-label">Old Password</label>
          <input
            type="password"
            name="oldPassword"
            id="oldPassword"
            className="form-input"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.oldPassword}
          />
          <span className="error-message">
            {formik.touched.oldPassword && formik.errors.oldPassword
              ? formik.errors.oldPassword
              : null}
          </span>
        </div>
        <div className="form-group">
          <label htmlFor="newPassword" className="form-label">New Password</label>
          <input
            type="password"
            name="newPassword"
            id="newPassword"
            className="form-input"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
          />
          <span className="error-message">
            {formik.touched.newPassword && formik.errors.newPassword
              ? formik.errors.newPassword
              : null}
          </span>
        </div>
        <button type="submit" className="submit-btn">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
