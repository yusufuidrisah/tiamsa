import React from "react";
import Header from "../components/Header";
import { FiTarget, FiEye, FiCheckCircle } from "react-icons/fi";
import "../styles/About.css";

export default function About() {
  return (
    <div className="about-page">
      <Header />

      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About TIAMSA</h1>
          <p>
            TIAMSA (TIA Muslim Students Association) Dar es Salaam is a
            professional student body focused on academic excellence, spiritual
            growth, and community unity at the Tanzania Institute of
            Accountancy.
          </p>
        </div>
      </section>

      <main className="about-main">
        <div className="about-container">
          <div className="vision-mission-grid">
            <div className="info-card">
              <h2>
                <FiTarget /> Our Mission
              </h2>
              <p>
                To empower students spiritually and academically while fostering
                leadership within the TIA community.
              </p>
            </div>

            <div className="info-card">
              <h2>
                <FiEye /> Our Vision
              </h2>
              <p>
                To produce ethical and knowledgeable graduates ready to serve
                the society with integrity.
              </p>
            </div>
          </div>

          <div className="activities-section">
            <h2 className="section-title">Core Activities</h2>
            <div className="activities-cards">
              <div className="act-card">
                <FiCheckCircle className="card-icon" /> Islamic Classes
              </div>
              <div className="act-card">
                <FiCheckCircle className="card-icon" /> Charity Works
              </div>
              <div className="act-card">
                <FiCheckCircle className="card-icon" /> Academic Seminars
              </div>
              <div className="act-card">
                <FiCheckCircle className="card-icon" /> Sports Events
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="about-footer">
        <p>
          © {new Date().getFullYear()} TIAMSA Dar es Salaam. All Rights
          Reserved.
        </p>
      </footer>
    </div>
  );
}
