import React from "react";
import {
  FiArrowRight,
  FiBookOpen,
  FiCalendar,
  FiCompass,
  FiShield,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import heroImage from "../assets/tiamsa-back-ground.jpeg";
import "../styles/home.css";

export default function Home() {
  return (
    <div className="home-wrapper">
      <Header />

      <main
        className="home-hero-section"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-grid-pattern"></div>

        <div className="home-hero-container">
          <div className="home-hero-content">
            <span className="hero-tagline">
              Official TIA Muslim Students Association
            </span>
            <h1 className="hero-title">
              A more confident student community for faith, leadership, and
              academic growth.
            </h1>
            <p className="hero-subtitle">
              TIAMSA Dar es Salaam creates a structured environment where
              students stay connected to meaningful programmes, trusted
              announcements, and a strong culture of service.
            </p>

            <div className="hero-points institutional">
              <div className="hero-point">
                <FiCompass />
                <span>Faith-guided direction</span>
              </div>
              <div className="hero-point">
                <FiBookOpen />
                <span>Academic excellence</span>
              </div>
              <div className="hero-point">
                <FiUsers />
                <span>Connected student network</span>
              </div>
            </div>

            <div className="hero-cta-group">
              <Link to="/register" className="btn btn-primary">
                <FiUserPlus /> Register Now
              </Link>
              <Link to="/announcements" className="btn btn-outline">
                Latest Announcements <FiArrowRight />
              </Link>
            </div>
          </div>

          <div className="hero-side-card institutional-card">
            <div className="hero-side-label">Association Snapshot</div>
            <h2>Built to support student life with clarity and purpose.</h2>
            <p>
              From guided programmes to official communication, the association
              helps students stay informed, involved, and represented.
            </p>
            <div className="hero-side-stats">
              <div>
                <strong>Registration</strong>
                <span>Simple onboarding for members</span>
              </div>
              <div>
                <strong>Communication</strong>
                <span>Reliable notices and updates</span>
              </div>
              <div>
                <strong>Programmes</strong>
                <span>Events, learning, and service</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="home-metrics-strip">
        <div className="home-metric">
          <strong>Structured Leadership</strong>
          <span>Clear student coordination across activities and welfare.</span>
        </div>
        <div className="home-metric">
          <strong>Trusted Announcements</strong>
          <span>Centralized updates for events, notices, and engagement.</span>
        </div>
        <div className="home-metric">
          <strong>Member Growth</strong>
          <span>Balanced focus on spirituality, study, and responsibility.</span>
        </div>
      </section>

      <section className="home-pillars-section">
        <div className="home-section-heading">
          <span>What TIAMSA Offers</span>
          <h2>A more professional student experience from first registration to active participation.</h2>
        </div>

        <div className="home-pillars-grid">
          <article className="home-pillar-card">
            <FiShield />
            <h3>Organized student support</h3>
            <p>
              A dependable structure for member records, communication, and
              participation across the association.
            </p>
          </article>
          <article className="home-pillar-card">
            <FiCalendar />
            <h3>Consistent programmes</h3>
            <p>
              Activities designed to strengthen discipline, belonging, and
              steady student involvement throughout the year.
            </p>
          </article>
          <article className="home-pillar-card">
            <FiBookOpen />
            <h3>Academic and moral growth</h3>
            <p>
              An environment that values good character, shared learning, and
              meaningful student development.
            </p>
          </article>
        </div>
      </section>

      <section className="home-closing-section">
        <div className="home-closing-card">
          <span>Join the community</span>
          <h2>Start your TIAMSA membership with a clear and simple registration process.</h2>
          <p>
            Become part of a student association that takes communication,
            community, and student growth seriously.
          </p>
          <Link to="/register" className="btn btn-primary closing-btn">
            <FiUserPlus /> Begin Registration
          </Link>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-content">
          <p>Copyright {new Date().getFullYear()} TIAMSA DSM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
