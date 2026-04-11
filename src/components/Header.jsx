import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiHome,
  FiInfo,
  FiUserPlus,
  FiBell,
  FiShield,
} from "react-icons/fi";
import "./Header.css";
import logoimage from "../assets/logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Kufunga menu mwanafunzi anapobonyeza link (kwenye simu)
  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <nav className={`nav ${isHomePage ? "nav-home" : ""}`}>
      <div className="nav-container">
        <Link to="/" className="logo-section">
          <img src={logoimage} alt="Logo" className="logo-png" />
          <h1 className="logo-text">TIAMSA</h1>
        </Link>

        {/* Desktop & Mobile Links */}
        <div className={`links-wrapper ${open ? "active" : ""}`}>
          <Link
            to="/"
            className={`link ${location.pathname === "/" ? "active-link" : ""}`}
          >
            <FiHome className="nav-icon" /> Home
          </Link>
          <Link
            to="/about"
            className={`link ${
              location.pathname === "/about" ? "active-link" : ""
            }`}
          >
            <FiInfo className="nav-icon" /> About
          </Link>
          <Link
            to="/register"
            className={`link ${
              location.pathname === "/register" ? "active-link" : ""
            }`}
          >
            <FiUserPlus className="nav-icon" /> Register
          </Link>
          <Link
            to="/announcements"
            className={`link ${
              location.pathname === "/announcements" ? "active-link" : ""
            }`}
          >
            <FiBell className="nav-icon" /> Announcements
          </Link>
          <Link to="/admin/login" className="link admin-btn">
            <FiShield className="nav-icon" /> Admin
          </Link>
        </div>

        {/* Hamburger Icon */}
        <button
          type="button"
          className="menu-icon"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>
      {open && (
        <button
          type="button"
          className="nav-overlay"
          aria-label="Close navigation overlay"
          onClick={() => setOpen(false)}
        />
      )}
    </nav>
  );
}
