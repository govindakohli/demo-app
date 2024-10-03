import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./updateProfile.css"

const UpdateProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token") || Cookies.get("token");
        if (!token) {
          console.error("No token found, redirecting to login.");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/getProfile`, // Adjust the route if necessary
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const user = response.data.user;
        setInitialValues({
          name: user.name || "",
          email: user.email || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: yup.object({
      name: yup
        .string()
        .min(3, "Please provide at least 3 characters.")
        .required("Please enter your full name."),
      email: yup
        .string()
        .email("Please enter a valid email.")
        .required("Please enter your email."),
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

        const response = await axios.put(
          `http://localhost:5000/api/update`, // Adjust the route if necessary
          values,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Profile updated successfully:", response.data);
        setIsLoading(false);
        navigate("/"); // Redirect to profile or any other page
      } catch (error) {
        console.error("Error updating profile:", error);
        setIsLoading(false);
      }
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="profile-container">
        <h1 className="profile-heading">Update Profile</h1>
        <Link to="/">
          <button type="button" className="back-btn">
            Back
          </button>
        </Link>
        <form onSubmit={formik.handleSubmit} className="profile-form">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="form-input"
            />
            <span className="form-error">
              {formik.touched.name && formik.errors.name
                ? formik.errors.name
                : null}
            </span>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="form-input"
            />
            <span className="form-error">
              {formik.touched.email && formik.errors.email
                ? formik.errors.email
                : null}
            </span>
          </div>
          <button type="submit" className="submit-btn">
            Update Profile
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateProfile;
