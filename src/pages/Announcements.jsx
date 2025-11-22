import React, { useContext } from "react";
import Header from "../components/Header";
import "../styles/Announcement.css";
import { AnnouncementsContext } from "../context/AnnouncementsContext";

export default function Announcements() {
  const { announcements } = useContext(AnnouncementsContext);

  return (
    <>
      <Header />

      <div className="announcements-hero">
        <h1>Announcements</h1>
      </div>

      <section className="announcements-container">
        {announcements.map((item) => (
          <div key={item.id} className="announcement-card">
            <h2>{item.title}</h2>
            <span className="date">{item.date}</span>
            <p>{item.description}</p>
          </div>
        ))}
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} TIAMSA - All Rights Reserved
      </footer>
    </>
  );
}
