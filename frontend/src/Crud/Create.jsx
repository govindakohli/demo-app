import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie'; // Assuming you're storing the token in cookies
import './Create.css';

const Create = () => {
    const navigate = useNavigate();
    const { handleChange, handleSubmit, handleBlur, errors, values, touched } = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            number: "",
            memberShip: ""
        },
        validationSchema: yup.object({
            firstName: yup.string().min(3, 'Please provide at least 3 characters.').required('Please enter your full name.'),
            lastName: yup.string().min(3, 'Please provide at least 3 characters.').required('Please enter your last name.'),
            email: yup.string().email().required('Please enter a valid email.'),
            number: yup.string().required('Please enter your contact number.'),
            memberShip: yup.string().required('Please select your membership.'),
        }),
        onSubmit: (values) => {
            const token = localStorage.getItem("token") || Cookies.get("token"); // Get token from localStorage or cookies

            if (!token) {
                console.error("No token found, redirecting to login.");
                navigate("/login"); // Redirect to login if no token
                return;
            }
            axios.post(`http://localhost:5000/api/create`, values, { withCredentials: true })
                .then((response) => {
                    console.log('Data submitted successfully:', response.data);
                    navigate('/');
                })
                .catch((error) => {
                    console.error('There was an error submitting the form:', error);
                });
        }
    });

    return (
        <div className="create-container">
            <h1>Create Operation</h1>
            <Link to="/">
                <button type="button" className="show-data-button">Show All Data</button>
            </Link>
            <form onSubmit={handleSubmit} className="create-form">
                <div className="form-group">
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.firstName}
                        className={touched.firstName && errors.firstName ? 'input-error' : ''}
                    />
                    <span className="error-message">{touched.firstName && errors.firstName ? errors.firstName : null}</span>
                </div>
                <div className="form-group">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.lastName}
                        className={touched.lastName && errors.lastName ? 'input-error' : ''}
                    />
                    <span className="error-message">{touched.lastName && errors.lastName ? errors.lastName : null}</span>
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        className={touched.email && errors.email ? 'input-error' : ''}
                    />
                    <span className="error-message">{touched.email && errors.email ? errors.email : null}</span>
                </div>
                <div className="form-group">
                    <label>Contact Number:</label>
                    <input
                        type="text"
                        name="number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.number}
                        className={touched.number && errors.number ? 'input-error' : ''}
                    />
                    <span className="error-message">{touched.number && errors.number ? errors.number : null}</span>
                </div>

                <div className="form-group">
                    <label>Membership:</label>
                    <select
                        name="memberShip"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.memberShip}
                        className={touched.memberShip && errors.memberShip ? 'input-error' : ''}
                    >
                        <option value="" label="Select membership" />
                        <option value="Gold" label="Gold" />
                        <option value="Diamond" label="Diamond" />
                    </select>
                    <span className="error-message">{touched.memberShip && errors.memberShip ? errors.memberShip : null}</span>
                </div>

                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
}

export default Create;
