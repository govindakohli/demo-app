import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie"; // Assuming token is stored in cookies or localStorage

const Update = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    number: "",
    memberShip: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCx = async () => {
      try {
        const token = localStorage.getItem("token") || Cookies.get("token"); // Get token from localStorage or cookies
        if (!token) {
          console.error("No token found, redirecting to login.");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/getCustomer/${id}`,
          {
            withCredentials: true,
          }
        );
        const customer = response.data;

        setInitialValues({
          firstName: customer.firstName || "",
          lastName: customer.lastName || "",
          email: customer.email || "",
          number: customer.number || "",
          memberShip: customer.memberShip || "",
        });
        setIsLoading(false);
      } catch (error) {
        console.error("There was an error fetching the customer data:", error);
        setIsLoading(false); // Stop loading even if error occurs
      }
    };

    fetchCx();
  }, [id, navigate]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true, // Reinitialize the form when initialValues change
    validationSchema: yup.object({
      firstName: yup
        .string()
        .min(3, "Please provide at least 3 characters.")
        .required("Please enter full name."),
      lastName: yup
        .string()
        .min(3, "Please provide at least 3 characters.")
        .required("Please enter last name."),
      email: yup
        .string()
        .email("Please enter a valid email.")
        .required("Please enter email."),
      number: yup.string().required("Please enter contact number."),
      memberShip: yup.string().required("Please select your membership."),
    }),
    onSubmit: (values) => {
      const token = localStorage.getItem("token") || Cookies.get("token"); // Get token again for the request
      if (!token) {
        console.error("No token found, redirecting to login.");
        navigate("/login");
        return;
      }

      axios
        .put(`http://localhost:5000/api/getCustomer/${id}`, values, {
          withCredentials: true,
        })
        .then((response) => {
          console.log("Data updated successfully:", response.data);
          navigate("/");
        })
        .catch((error) => {
          console.error("There was an error updating the form:", error);
        });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>UPDATE Operation</h1>
      <Link to="/">
        <button type="button" className="backbtn">
          Back
        </button>
      </Link>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
          />
          <span>
            {formik.touched.firstName && formik.errors.firstName
              ? formik.errors.firstName
              : null}
          </span>
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
          />
          <span>
            {formik.touched.lastName && formik.errors.lastName
              ? formik.errors.lastName
              : null}
          </span>
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          <span>
            {formik.touched.email && formik.errors.email
              ? formik.errors.email
              : null}
          </span>
        </div>
        <div>
          <label>Contact Number:</label>
          <input
            type="text"
            name="number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.number}
          />
          <span>
            {formik.touched.number && formik.errors.number
              ? formik.errors.number
              : null}
          </span>
        </div>
        <div>
          <label>Membership:</label>
          <select
            name="memberShip"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.memberShip}
          >
            <option value="" label="Select membership" />
            <option value="Gold" label="Gold" />
            <option value="Diamond" label="Diamond" />
          </select>
          <span>
            {formik.touched.memberShip && formik.errors.memberShip
              ? formik.errors.memberShip
              : null}
          </span>
        </div>
        <button type="submit">Update</button>
      </form>
    </>
  );
};

export default Update;
