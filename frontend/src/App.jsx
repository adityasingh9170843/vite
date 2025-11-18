

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
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <strong style={{ fontSize: 18 }}>App</strong>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ marginRight: 8 }}>{user?.name || user?.email}</span>
        <button onClick={handleLogout} className="btn">Logout</button>
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
