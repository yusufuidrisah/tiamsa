import React from "react";
import { FiUserPlus, FiArrowRight, FiBookOpen, FiHeart, FiUsers } from "react-icons/fi";
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

            <div className="hero-points">
              <div className="hero-point">
                <FiHeart />
                <span>Faith-centered growth</span>
              </div>
              <div className="hero-point">
                <FiBookOpen />
                <span>Academic support</span>
              </div>
              <div className="hero-point">
                <FiUsers />
                <span>Strong student community</span>
              </div>
            </div>

            <div className="hero-cta-group">
              <Link to="/register" className="btn btn-primary">
                <FiUserPlus /> Register Now
              </Link>
              <Link to="/announcements" className="btn btn-outline">
                View Announcements <FiArrowRight />
              </Link>
            </div>
          </div>

          <div className="hero-side-card">
            <div className="hero-side-label">Why Join TIAMSA</div>
            <h2>One place for spiritual, academic, and student-life support.</h2>
            <p>
              Stay connected to announcements, activities, and a welcoming
              community built for TIA students.
            </p>
            <div className="hero-side-stats">
              <div>
                <strong>Students</strong>
                <span>Registration support</span>
              </div>
              <div>
                <strong>Updates</strong>
                <span>Official announcements</span>
              </div>
              <div>
                <strong>Community</strong>
                <span>Events and engagement</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="home-footer">
        <div className="footer-content">
          <p>Copyright {new Date().getFullYear()} TIAMSA DSM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
