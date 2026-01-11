import React from "react";
import Header from "../components/Header";
import { FiTarget, FiEye, FiCheckCircle } from "react-icons/fi"; // Optional icons
import "../styles/About.css";

export default function About() {
  return (
    <div className="about-page">
      <Header />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay"></div>
        <div className="about-hero-content">
          <h1>About TIAMSA</h1>
          <div className="underline"></div>
          <p>
            TIAMSA (TIA Muslim Students Association) in Dar es Salaam is a
            premier student organization dedicated to promoting unity, profound
            knowledge, and core Islamic values among students at the Tanzania
            Institute of Accountancy.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="about-main">
        <div className="about-container">
          <div className="vision-mission-grid">
            <div className="about-section info-card">
              <FiTarget className="section-icon" />
              <h2>Our Mission</h2>
              <p>
                To empower students spiritually, academically, and socially
                while fostering brotherhood and leadership within the TIA
                community.
              </p>
            </div>

            <div className="about-section info-card">
              <FiEye className="section-icon" />
              <h2>Our Vision</h2>
              <p>
                To be a leading Muslim student association that shapes ethical,
                knowledgeable, and responsible graduates prepared for the Ummah.
              </p>
            </div>
          </div>

          <div className="about-section activities">
            <h2 className="section-title">Core Activities</h2>
            <div className="activities-cards">
              <div className="act-card">
                <FiCheckCircle className="card-icon" />
                <span>Islamic Classes & Talks</span>
              </div>
              <div className="act-card">
                <FiCheckCircle className="card-icon" />
                <span>Community Service & Charity</span>
              </div>
              <div className="act-card">
                <FiCheckCircle className="card-icon" />
                <span>Workshops & Seminars</span>
              </div>
              <div className="act-card">
                <FiCheckCircle className="card-icon" />
                <span>Sports & Cultural Events</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="about-footer">
        <p>
          © {new Date().getFullYear()} TIAMSA Dar es Salaam. All Rights
          Reserved.
        </p>
      </footer>
    </div>
  );
}
