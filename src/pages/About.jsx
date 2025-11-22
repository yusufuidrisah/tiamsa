import React from "react";
import Header from "../components/Header";
import "../styles/About.css";

export default function About() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About TIAMSA</h1>
          <p>
            TIAMSA (TIA Muslim Students Association) in Dar es Salaam is a
            student organization that promotes unity, knowledge, and Islamic
            values among students at the Tanzania Institute of Accountancy.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="about-main">
        <div className="about-container">
          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              To empower students spiritually, academically, and socially while
              fostering brotherhood and leadership.
            </p>
          </div>

          <div className="about-section">
            <h2>Our Vision</h2>
            <p>
              To be a leading Muslim student association that shapes ethical,
              knowledgeable, and responsible graduates.
            </p>
          </div>

          <div className="about-section activities">
            <h2>Our Activities</h2>
            <div className="activities-cards">
              <div className="card">Islamic classes & talks</div>
              <div className="card">Community service & charity</div>
              <div className="card">Workshops & seminars</div>
              <div className="card">Sports & cultural events</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} TIAMSA - All Rights Reserved
      </footer>
    </>
  );
}
