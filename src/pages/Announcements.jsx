import React, { useContext, useState } from "react";
import Header from "../components/Header";
import { FiCalendar, FiArrowLeft, FiClock, FiDownload } from "react-icons/fi";
import { AnnouncementsContext } from "../context/AnnouncementsContext";
import "../styles/Announcement.css";

export default function Announcements() {
  const { announcements } = useContext(AnnouncementsContext);
  const [selectedItem, setSelectedItem] = useState(null);

  const sortedData = [...announcements].sort((a, b) => b.id - a.id);

  const isNew = (timestamp) => {
    const fortyEightHours = 2 * 24 * 60 * 60 * 1000;
    return Date.now() - timestamp < fortyEightHours;
  };

  // --- 1. DETAILS VIEW ---
  if (selectedItem) {
    const attachmentUrl = selectedItem.attachment
      ? selectedItem.attachment.toLowerCase()
      : "";
    const isImage =
      attachmentUrl.includes("image") ||
      attachmentUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
    const isDoc = selectedItem.attachment && !isImage;

    return (
      <div className="tiamsa-page">
        <Header />
        <div className="tiamsa-hero">
          <div className="hero-inner">
            {/* <span className="hero-tag">TIAMSA DSM</span> */}
            <h1>Official Updates & Notices</h1>
            <p className="hero-description">
              Access the latest administrative news, academic circulars, and
              official announcements.
            </p>
          </div>
        </div>

        <main className="tiamsa-container">
          <button
            className="tiamsa-inline-back"
            onClick={() => setSelectedItem(null)}
          >
            <FiArrowLeft /> Back to List
          </button>

          <div className="post-header">
            <h1 className="post-title">{selectedItem.title}</h1>
            <div className="post-meta">
              <span>
                <FiCalendar /> Published: {selectedItem.date}
              </span>
              <span>
                <FiClock /> Official Release
              </span>
            </div>
          </div>

          <div className="tiamsa-divider"></div>

          {/* Image Section - Medium size, no crop */}
          {isImage && (
            <div className="post-img-container">
              <img
                src={selectedItem.attachment}
                alt="Announcement"
                className="post-img-detailed"
              />
            </div>
          )}

          {/* Styled Download Section */}
          {isDoc && (
            <div className="doc-download-section">
              <div className="doc-icon-circle">
                <FiDownload size={40} color="#10b981" />
              </div>
              <p>Official Announcement Document</p>
              <span className="doc-meta-text">
                Format: PDF/Document • Official TIAMSA Release
              </span>
              <a
                href={selectedItem.attachment}
                download
                target="_blank"
                rel="noreferrer"
                className="download-action-btn"
              >
                <FiDownload size={18} /> Download Now
              </a>
            </div>
          )}

          <div className="post-body">
            {selectedItem.description || selectedItem.content}
          </div>
        </main>
      </div>
    );
  }

  // --- 2. LIST VIEW (Grid 3) ---
  return (
    <div className="tiamsa-page">
      <Header />
      <div className="tiamsa-hero">
        <div className="hero-inner">
          <span className="hero-tag">TIAMSA DSM</span>
          <h1>Official Updates & Notices</h1>
          <p className="hero-description">
            Access the latest administrative news, academic circulars, and
            official announcements.
          </p>
        </div>
      </div>

      <main className="tiamsa-grid">
        {sortedData.map((item) => (
          <article
            key={item.id}
            className="tiamsa-card"
            onClick={() => setSelectedItem(item)}
          >
            <div className="tiamsa-card-img">
              <img src={item.attachment} alt="Thumbnail" />
            </div>
            <div className="tiamsa-card-info">
              <h2 className="tiamsa-title-text">{item.title}</h2>
              <div className="tiamsa-date-text">{item.date}</div>
              {isNew(item.id) && <div className="tiamsa-star-badge">NEW</div>}
            </div>
          </article>
        ))}
      </main>
    </div>
  );
}
