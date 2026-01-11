import React, { useContext } from "react";
import Header from "../components/Header";
import { FiBell, FiCalendar, FiChevronRight } from "react-icons/fi";
import { AnnouncementsContext } from "../context/AnnouncementsContext";
import "../styles/Announcement.css";

export default function Announcements() {
  const { announcements } = useContext(AnnouncementsContext);

  return (
    <div className="announcements-page">
      <Header />

      <div className="announcements-hero">
        <div className="hero-content">
          <FiBell className="hero-icon" />
          <h1>Announcements</h1>
          <p>Latest news and important updates from TIAMSA.</p>
        </div>
      </div>

      <section className="announcements-container">
        {announcements.length === 0 ? (
          <div className="empty-state">
            <p>Kwa sasa hakuna matangazo mapya.</p>
          </div>
        ) : (
          announcements.map((item) => (
            <div key={item.id} className="announcement-card">
              <div className="card-accent"></div>
              <div className="card-body">
                <div className="date-badge">
                  <FiCalendar /> {item.date || "Today"}
                </div>
                <h2>{item.title}</h2>
                {/* PRE-WRAP */}
                <p className="description">
                  {item.content || item.description}
                </p>
                <div className="card-footer-link">
                  TIAMSA Official Update <FiChevronRight />
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} TIAMSA DSM - All Rights Reserved</p>
      </footer>
    </div>
  );
}
