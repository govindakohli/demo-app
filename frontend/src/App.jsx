import React from "react";
import Create from "./Crud/Create";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Read from "./Crud/Read";
import Update from "./Crud/Update";
import ButtonAppBar from "./Home/ButtonAppBar";
import Register from "./User/Register";
import "./App.css";
import Login from "./User/Login";
import ChangePassword from "./Crud/changePassword";
import UpdateProfile from "./Crud/updateProfile";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Combine ButtonAppBar and Read components under the same route */}
          <Route
            path="/"
            element={
              <>
                <ButtonAppBar />
                <Read />
              </>
            }
          ></Route>
          <Route path="/create" element={<Create />}></Route>
          <Route path="/update/:id" element={<Update />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/changeProfile" element={<UpdateProfile />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
