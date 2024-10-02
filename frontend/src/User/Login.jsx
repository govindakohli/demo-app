import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { handleChange, handleSubmit, handleBlur, errors, values, touched } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: yup.object({
        email: yup.string().email().required("Please enter a valid email"),
        password: yup.string().required("Please enter a password"),
      }),
      onSubmit: (values) => {
        axios
          .post("http://localhost:5000/api/login", values)
          .then((response) => {
            const token = response.data.token;
            // Store the token in localStorage or sessionStorage
            localStorage.setItem("token", token);

            // Redirect to home page or protected route
            navigate("/");
          })
          .catch((error) => {
            console.error("Error during login:", error);
          });
      },
    });
  return (
    <>
      <div className="login-container">
        <h1 className="login-title">LOGIN</h1>
        <Link to="/register">
          <button className="show-data-button" type="button">
            Register
          </button>
        </Link>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email:</label>
            <input
              type="email"
              name="email"
              className="form-input"
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
              type="text"
              name="password"
              className="form-input"
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

export default Login;
