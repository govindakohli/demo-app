import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie to handle cookies
import { jwtDecode } from "jwt-decode"; // To decode JWT token
import "./AppBarStyles.css"; // Import your CSS file

export default function ButtonAppBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // For navigating to other routes

  // Get the token from localStorage or cookies
  const token = localStorage.getItem("token") || Cookies.get("token");

  // Decode the token to get the user ID (adjust based on your token structure)
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken ? decodedToken.id : null; // Replace with the correct field from your token

  const handleLogout = () => {
    // Clear the token from localStorage and cookies
    localStorage.removeItem("token"); // Remove token from local storage
    Cookies.remove("token"); // Remove token from cookies

    // Redirect to login page
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          CRUD
        </Link>

        <div className={`navbar-toggle ${isMenuOpen ? "active" : ""}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <li>
            <Link to="/create" className="menu-item" onClick={() => setIsMenuOpen(false)}>
              Create User
            </Link>
          </li>
          <li>
            <Link to="/changePassword" className="menu-item" onClick={() => setIsMenuOpen(false)}>
              Change Password
            </Link>
          </li>
          <li>
            <Link to="/changeProfile" className="menu-item" onClick={() => setIsMenuOpen(false)}>
              Change Profile
            </Link>
          </li>

          {token ? (
            <li>
              <button onClick={handleLogout} className="signin">Logout</button>
            </li>
          ) : (
            <li>
              <Link to="/login" className="signin" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
