import React from "react";
import { FiUserPlus, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import heroImage from "../assets/tiamsa-back-ground.jpeg";
import "../styles/home.css";

export default function Home() {
  return (
    <div className="home-wrapper">
      <Header />

      <main
        className="hero-section"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-overlay"></div>

        <div className="hero-container">
          <div className="hero-content-box">
            <span className="hero-tagline">
              Official TIA Muslim Students Association
            </span>
            <h1 className="hero-title">
              Empowering Faith, <br />
              <span>Knowledge & Unity</span>
            </h1>
            <p className="hero-subtitle">
              Join TIAMSA Dar es Salaam to connect, grow spiritually, and excel
              academically at the Tanzania Institute of Accountancy.
            </p>

            <div className="hero-cta-group">
              <Link to="/register" className="btn btn-primary">
                <FiUserPlus /> Register Now
              </Link>
              <Link to="/announcements" className="btn btn-outline">
                View Announcements <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="home-footer">
        <div className="footer-content">
          <p>
            © 2026 - {new Date().getFullYear()} TIAMSA DSM. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
