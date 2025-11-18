import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "./context/userContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "/api/auth/register",
        { name, email, password },
        { withCredentials: true }
      );
      if (updateUser) updateUser(res.data);
      navigate("/dashboard");
    } catch (err) {
      console.error(err?.response?.data || err.message);
      alert("Registration failed: " + (err?.response?.data?.message || err?.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Register</h1>
        <form onSubmit={handleRegister} className="auth-form">
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <div className="actions">
            <button className="btn primary" type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
            <Link className="auth-link" to="/">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
