import React, { useState, useEffect } from "react";
import "./Read.css";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Cookies from "js-cookie"; // Import js-cookie

function Read() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to handle errors
  const [isAdmin, setIsAdmin] = useState(false); // Add isAdmin state to track if user is an admin
  const navigate = useNavigate(); // Use navigate to programmatically navigate the user

  // Function to check if the user is an admin
  function checkIfAdmin() {
    // Start loading
    setLoading(true);

    // Retrieve token from local storage
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);

    if (!token) {
      navigate("/login"); // Corrected the redirect logic
      setLoading(false);
      return;
    }

    // Set the token in cookies using js-cookie
    Cookies.set("token", token, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });

    // Perform the request to check admin status
    axios
      .get("http://localhost:5000/api/check-admin", {
        withCredentials: true, // Ensure cookies are sent with the request
      })
      .then((response) => {
        const adminStatus = response.data;

        if (typeof adminStatus !== "boolean") {
          throw new Error("Unexpected response format");
        }

        // Update isAdmin state
        setIsAdmin(adminStatus);

        // Fetch data based on admin status
        if (adminStatus) {
          getAllData(); // Fetch all customers if the user is an admin
        } else {
          getUserData(); // Fetch only the user's data if not an admin
        }
      })
      .catch((error) => {
        // Handle errors
        setError("Error checking admin status.");
        console.error("Error checking admin status:", error);
      })
      .finally(() => {
        // Stop loading after request completion
        setLoading(false);
      });
  }

  // Fetch all customers if admin
  function getAllData() {
    axios
      .get("http://localhost:5000/api/", {
        withCredentials: true, // Ensure cookies are sent with the request
      })
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        setError("Error fetching all customers.");
        console.error("There was an error fetching the data:", error);
      });
  }

  // Fetch only the logged-in user's data if not an admin
  function getUserData() {
    axios
      .get("http://localhost:5000/api/getUserData", {
        withCredentials: true, // Ensure cookies are sent with the request
      })
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        setError("Error fetching user data.");
        console.error("There was an error fetching the user data:", error);
      });
  }

  // Handle deletion of a customer
  function handleDelete(id) {
    axios
      .delete(`http://localhost:5000/api/getCustomer/${id}`, {
        withCredentials: true, // Ensure cookies are sent with the request
      })
      .then((response) => {
        console.log("Data deleted successfully:", response.data);
        isAdmin ? getAllData() : getUserData(); // Re-fetch data based on user role
      })
      .catch((error) => {
        setError("Error deleting customer.");
        console.error("There was an error deleting the data:", error);
      });
  }

  useEffect(() => {
    checkIfAdmin(); // Check the user's role on component mount
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <section className="customerpage">
      <h1>
        {isAdmin ? "Admin View - All Customer Data" : "Your Customer Data"}
      </h1>

      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Membership</th>
              <th>Action</th>
              {/* <th>created by </th> */}
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td>
                  
                  {customer.firstName} {customer.lastName}
                </td>
                <td>{customer.email}</td>
                <td>{customer.number}</td>
                <td>{customer.memberShip}</td>
                <td>
                  <NavLink to={`/update/${customer._id}`}>
                    <button className="edit-delete-button">
                      <FaUserEdit />
                    </button>
                  </NavLink>
                  <button
                    className="edit-delete-button"
                    onClick={() => handleDelete(customer._id)
                    }
                  >
                    <MdDelete />
                  </button>
                </td>
                {/* <td>{customer.createdBy}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <NavLink to="/create">
        <button className="adduserbtn">Add New Customer</button>
      </NavLink>
    </section>
  );
}

export default Read;
