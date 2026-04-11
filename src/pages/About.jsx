import React from "react";
import Header from "../components/Header";
import {
  FiTarget,
  FiEye,
  FiCheckCircle,
  FiBookOpen,
  FiUsers,
  FiHeart,
} from "react-icons/fi";
import "../styles/About.css";

export default function About() {
  return (
    <div className="about-page">
      <Header />

      <section className="about-hero">
        <div className="about-hero-shell">
          <div className="about-hero-content">
            <span className="about-tag">Who We Are</span>
            <h1>About TIAMSA</h1>
            <p>
              TIAMSA (TIA Muslim Students Association) Dar es Salaam is a
              student association focused on spiritual growth, academic
              excellence, leadership, and unity at the Tanzania Institute of
              Accountancy.
            </p>

            <div className="about-pill-row">
              <div className="about-pill">
                <FiHeart />
                <span>Spiritual development</span>
              </div>
              <div className="about-pill">
                <FiBookOpen />
                <span>Academic support</span>
              </div>
              <div className="about-pill">
                <FiUsers />
                <span>Student community</span>
              </div>
            </div>
          </div>

          <div className="about-hero-panel">
            <div className="about-panel-label">Our Focus</div>
            <h2>Helping students grow in faith, knowledge, and character.</h2>
            <p>
              We create a space where students can stay informed, participate
              in meaningful activities, and build a strong sense of belonging.
            </p>
          </div>
        </div>
      </section>

      <main className="about-main">
        <div className="about-container">
          <section className="about-intro-grid">
            <div className="intro-card">
              <strong>Faith</strong>
              <span>Programs that nurture spiritual discipline and values.</span>
            </div>
            <div className="intro-card">
              <strong>Learning</strong>
              <span>Academic encouragement and knowledge-sharing activities.</span>
            </div>
            <div className="intro-card">
              <strong>Unity</strong>
              <span>A supportive student network built on service and respect.</span>
            </div>
          </section>

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
                society with integrity.
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
        <p>Copyright {new Date().getFullYear()} TIAMSA Dar es Salaam. All rights reserved.</p>
      </footer>
    </div>
  );
}
