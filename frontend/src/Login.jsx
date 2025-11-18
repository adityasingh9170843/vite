import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "./context/userContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", { email, password }, { withCredentials: true });
      if (updateUser) updateUser(res.data);
      navigate("/dashboard");
    } catch (err) {
      console.error(err?.response?.data || err.message);
      alert("Login failed: " + (err?.response?.data?.message || err?.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Sign In</h1>
        <form onSubmit={handleLogin} className="auth-form">
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <div className="actions">
            <button className="btn primary" type="submit" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
            <Link className="auth-link" to="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
