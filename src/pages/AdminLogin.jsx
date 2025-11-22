import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    // Temporary alert; baadaye tutafanya authentication
    if (credentials.email && credentials.password) {
      alert(`Logging in as ${credentials.email}`);
      setCredentials({ email: "", password: "" });
      navigate("/admin/dashboard"); // Redirect to dashboard
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <>
      <Header />
      <div className="admin-login-hero">
        <h1>Admin Login</h1>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}
