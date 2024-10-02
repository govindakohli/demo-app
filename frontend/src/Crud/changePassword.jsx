import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const changePassword = () => {
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
    <>
      <h1>Change Password</h1>
      <Link to="/">
        <button type="button" className="backbtn">
          Back
        </button>
      </Link>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>Old Password</label>
          <input
            type="password"
            name="oldPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.oldPassword}
          />
          <span>
            {formik.touched.oldPassword && formik.errors.oldPassword
              ? formik.errors.oldPassword
              : null}
          </span>
        </div>
        <div>
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
          />
          <span>
            {formik.touched.newPassword && formik.errors.newPassword
              ? formik.errors.newPassword
              : null}
          </span>
        </div>
        <button type="submit">Change Password</button>
      </form>
    </>
  );
};

export default changePassword;
