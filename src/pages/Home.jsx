import React from "react";
import Header from "../components/Header";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import heroImage from "../assets/tiamsa-back-ground.jpeg";

export default function Home() {
  return (
    <>
      <Header />
      <div className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to TIAMSA</h1>
          <p className="hero-subtitle">
            Tanzania Institute of Accountancy – Muslim Students Association
            <br />
            Empowering students with unity, knowledge and faith.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="btn register-btn">
              Register Now
            </Link>
            <Link to="/announcements" className="btn announce-btn">
              View Announcements
            </Link>
          </div>
        </div>
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} TIAMSA - All Rights Reserved
      </footer>
    </>
  );
}
