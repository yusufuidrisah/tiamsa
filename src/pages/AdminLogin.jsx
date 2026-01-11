import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn, FiArrowLeft } from "react-icons/fi";
import Header from "../components/Header";
import "../styles/admin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Temporary logic
    if (credentials.email && credentials.password) {
      setCredentials({ email: "", password: "" });
      navigate("/admin/dashboard");
    } else {
      alert("Tafadhali jaza email na password.");
    }
  };

  return (
    <div className="login-page-wrapper">
      <Header />
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="icon-circle">
              <FiLock />
            </div>
            <h1>Admin Portal</h1>
          </div>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="input-with-icon">
              <FiMail className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Admin Email"
                value={credentials.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-with-icon">
              <FiLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="login-submit-btn">
              Login Now <FiLogIn />
            </button>
          </form>

          <div className="login-footer">
            <button onClick={() => navigate("/")} className="back-home">
              <FiArrowLeft /> Back to Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
