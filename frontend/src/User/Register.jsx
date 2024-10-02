import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const { handleChange, handleSubmit, handleBlur, errors, values, touched } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        password: "",
      },
      validationSchema: yup.object({
        name: yup
          .string()
          .min(3, "Please provide at least 3 characters.")
          .required("Please enter full name"),
        email: yup.string().email().required("Please enter a valid email"),
        password: yup.string().required("Please enter a password"),
      }),
      onSubmit: (values) => {
        axios
          .post("http://localhost:5000/api/register", values)
          .then((response) => {
            const token = response.data.token;
            localStorage.setItem("token", token);
            navigate("/");
          })
          .catch((error) => {
            console.error("Error during registration:", error);
          });
      },
    });

  return (
    <>
      <div className="register-container">
        <h1 className="register-title">REGISTRATION</h1>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label className="form-label">Name:</label>
            <input
              className="form-input"
              type="text"
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
            />
            <span className="error-message">
              {touched.name && errors.name ? errors.name : null}
            </span>
          </div>
          <div className="form-group">
            <label className="form-label">Email:</label>
            <input
              className="form-input"
              type="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            <span className="error-message">
              {touched.email && errors.email ? errors.email : null}
            </span>
          </div>
          <div className="form-group">
            <label className="form-label">Password:</label>
            <input
              className="form-input"
              type="text"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            <span className="error-message">
              {touched.password && errors.password ? errors.password : null}
            </span>
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
