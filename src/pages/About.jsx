import React from "react";
import Header from "../components/Header";
import {
  FiArrowRight,
  FiBriefcase,
  FiTarget,
  FiEye,
  FiCheckCircle,
  FiBookOpen,
  FiUsers,
  FiShield,
} from "react-icons/fi";
import "../styles/About.css";

export default function About() {
  return (
    <div className="about-page">
      <Header />

      <section className="about-hero">
        <div className="about-hero-shell">
          <div className="about-hero-content">
            <h1>About TIAMSA</h1>
            <p>
              TIAMSA Dar es Salaam is a student association at the Tanzania
              Institute of Accountancy focused on disciplined leadership,
              spiritual growth, academic encouragement, and responsible
              student engagement.
            </p>

            <div className="about-pill-row">
              <div className="about-pill">
                <FiShield />
                <span>Responsible leadership</span>
              </div>
              <div className="about-pill">
                <FiBookOpen />
                <span>Academic encouragement</span>
              </div>
              <div className="about-pill">
                <FiUsers />
                <span>Strong student belonging</span>
              </div>
            </div>
          </div>

          <div className="about-hero-panel">
            <div className="about-panel-label">Our Commitment</div>
            <h2>Helping students grow in faith, discipline, knowledge, and service.</h2>
            <p>
              We provide a platform where students stay informed, build
              meaningful relationships, and participate in programmes that
              strengthen both character and confidence.
            </p>
            <div className="about-panel-points">
              <div>
                <strong>Clear communication</strong>
                <span>Official updates and better coordination.</span>
              </div>
              <div>
                <strong>Student development</strong>
                <span>Programmes that encourage learning and leadership.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="about-main">
        <div className="about-container">
          <section className="about-intro-grid">
            <div className="intro-card">
              <strong>Purpose</strong>
              <span>Activities grounded in values, discipline, and direction.</span>
            </div>
            <div className="intro-card">
              <strong>Growth</strong>
              <span>Encouragement for academic focus and continuous improvement.</span>
            </div>
            <div className="intro-card">
              <strong>Belonging</strong>
              <span>A student network built on service, respect, and support.</span>
            </div>
          </section>

          <div className="vision-mission-grid">
            <div className="info-card">
              <h2>
                <FiTarget /> Our Mission
              </h2>
              <p>
                To strengthen students spiritually and academically while
                building leadership, responsibility, and a culture of service
                within the TIA community.
              </p>
            </div>

            <div className="info-card">
              <h2>
                <FiEye /> Our Vision
              </h2>
              <p>
                To cultivate principled, knowledgeable, and community-minded
                graduates who contribute with integrity and confidence.
              </p>
            </div>
          </div>

          <section className="about-story-section">
            <div className="about-section-copy">
              <span>How We Work</span>
              <h2>An association model that combines structure with student care.</h2>
              <p>
                TIAMSA is designed to be more than a social group. It offers a
                practical framework for communication, coordination, mentoring,
                and meaningful engagement so members can participate with
                clarity.
              </p>
            </div>
            <div className="about-story-grid">
              <article className="about-story-card">
                <FiBriefcase />
                <strong>Leadership culture</strong>
                <p>Students learn to organize, serve, and lead responsibly.</p>
              </article>
              <article className="about-story-card">
                <FiArrowRight />
                <strong>Guided participation</strong>
                <p>Members can follow programmes and updates more easily.</p>
              </article>
            </div>
          </section>

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
