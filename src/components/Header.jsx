import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logoimage from "../assets/logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="nav-container">
        <img src={logoimage} alt="Logo" className="logo-png"></img>
        <h1 className="logo">TIAMSA</h1>

        {/* Desktop Links */}
        <div className={`links ${open ? "active" : ""}`}>
          <Link to="/" className="link">
            Home
          </Link>
          <Link to="/about" className="link">
            About
          </Link>
          <Link to="/register" className="link">
            Register
          </Link>
          <Link to="/announcements" className="link">
            Announcements
          </Link>
          <Link to="/admin/login" className="link">
            Admin
          </Link>
        </div>

        {/* Hamburger */}
        <div className="menu-icon" onClick={() => setOpen(!open)}>
          ☰
        </div>
      </div>
    </nav>
  );
}
