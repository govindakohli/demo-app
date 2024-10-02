import React from 'react'
import {useFormik} from 'formik';
import * as yup from 'yup';
import { Link,useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie'; // Assuming you're storing the token in cookies
import './Create.css';

const Create = () => {
    const navigate = useNavigate();
    const {handleChange,handleSubmit,handleBlur,errors,values,touched} = useFormik({
        initialValues:{
            firstName:"",
            lastName:"",
            email:"",
            number:"",
            memberShip:""

        },
        validationSchema:yup.object({
            firstName:yup.string().min(3,'please provide atleast 3 char.').required('please enter fullName'),
            lastName:yup.string().min(3,'please provide atleast 3 char.').required('please enter lastName'),
            email:yup.string().email().required('please enter valid email'),
            number:yup.string().required('plese enter contact number'),
            memberShip:yup.string().required('plese select your membership'),
        }),
        onSubmit:(values)=>{
          const token = localStorage.getItem("token") || Cookies.get("token"); // Get token from localStorage or cookies

            if (!token) {
                console.error("No token found, redirecting to login.");
                navigate("/login"); // Redirect to login if no token
                return;
            }
            axios.post(`http://localhost:5000/api/create`, values,{withCredentials: true})
            .then((response) => {
                 console.log('Data submitted successfully:', response.data);
                 navigate('/');
        })
             .catch((error) => {
                console.error('There was an error submitting the form:', error);
        });
        }
    })

    console.log(values)
  return (
    <>
    <h1>CREATE Opration</h1>
    <Link to="/"><button type="button">
          Show All Data
     </button>
    </Link>
    <form onSubmit={handleSubmit}>
    <div>
      <label>First Name:</label>
      <input
        type="text"
        name="firstName"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.firstName}
      />
      <span>{touched.firstName && errors.firstName ? errors.firstName : null}</span>
    </div>
    <div>
      <label>Last Name:</label>
      <input
        type="text"
        name="lastName"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.lastName}
      />
      <span>{touched.lastName && errors.lastName ? errors.lastName : null}</span>
    </div>
    <div>
      <label>Email:</label>
      <input
        type="email"
        name="email"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.email}
      />
      <span>{touched.email && errors.email ? errors.email : null}</span>
    </div>
    <div>
      <label>Contact Number:</label>
      <input
        type="text"
        name="number"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.number}
      />
      <span>{touched.number && errors.number ? errors.number : null}</span>
    </div>

    <div>
        <label>Membership:</label>
        <select
          name="memberShip"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.memberShip}
        >
          <option value="" label="Select memberShip" />
          <option value="Gold" label="Gold" />
          <option value="Diamond" label="Diamond" />
        </select>
        <span>{touched.memberShip && errors.memberShip ? errors.memberShip : null}</span>
      </div>

    <button type="submit">Submit</button>
  </form>
  </>
);
}

export default Create;