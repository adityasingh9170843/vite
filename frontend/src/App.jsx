

import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import UserProvider, { UserContext } from "./context/userContext";
import ProtectedRoute from "./ProtectedRoute";

const TopNav = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: 12 }}>
      <div>
        <Link to="/dashboard">Dashboard</Link>
      </div>
      <div>
        <span style={{ marginRight: 12 }}>{user?.name || user?.email}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <TopNav />
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
