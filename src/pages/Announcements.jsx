import React, { useContext, useState } from "react";
import Header from "../components/Header";
import {
  FiCalendar,
  FiArrowLeft,
  FiClock,
  FiDownload,
  FiFileText,
  FiImage,
} from "react-icons/fi";
import { AnnouncementsContext } from "../context/AnnouncementsContext";
import "../styles/Announcement.css";

export default function Announcements() {
  const { announcements } = useContext(AnnouncementsContext);
  const [selectedItem, setSelectedItem] = useState(null);

  const sortedData = [...announcements].sort((a, b) => b.id - a.id);

  const getAttachmentMeta = (attachment) => {
    const normalized = attachment ? attachment.toLowerCase() : "";
    const isImage =
      normalized.startsWith("data:image") ||
      normalized.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);

    return {
      hasAttachment: Boolean(attachment),
      isImage,
      isDocument: Boolean(attachment) && !isImage,
    };
  };

  const getExcerpt = (text = "") => {
    if (text.length <= 110) return text;
    return `${text.slice(0, 107).trim()}...`;
  };

  const isNew = (timestamp) => {
    const fortyEightHours = 2 * 24 * 60 * 60 * 1000;
    return Date.now() - timestamp < fortyEightHours;
  };

  if (selectedItem) {
    const { isImage, isDocument } = getAttachmentMeta(selectedItem.attachment);

    return (
      <div className="tiamsa-page">
        <Header />
        <div className="tiamsa-hero">
          <div className="hero-inner">
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

          {isImage && (
            <div className="post-img-container">
              <img
                src={selectedItem.attachment}
                alt={selectedItem.title}
                className="post-img-detailed"
              />
            </div>
          )}

          {isDocument && (
            <div className="doc-download-section">
              <div className="doc-icon-circle">
                <FiDownload size={40} color="#10b981" />
              </div>
              <p>Official Announcement Document</p>
              <span className="doc-meta-text">Format: PDF or document | Official TIAMSA release</span>
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
        {sortedData.map((item) => {
          const { hasAttachment, isImage, isDocument } = getAttachmentMeta(
            item.attachment,
          );
          const excerpt = getExcerpt(item.description || item.content || "");

          return (
            <article
              key={item.id}
              className="tiamsa-card"
              onClick={() => setSelectedItem(item)}
            >
              <div className="tiamsa-card-media">
                {isImage ? (
                  <img src={item.attachment} alt={item.title} />
                ) : (
                  <div className="tiamsa-card-file">
                    {isDocument ? <FiFileText /> : <FiImage />}
                    <span>{hasAttachment ? "Attachment" : "Notice"}</span>
                  </div>
                )}
              </div>
              <div className="tiamsa-card-info">
                <h2 className="tiamsa-title-text">{item.title}</h2>
                <p className="tiamsa-excerpt">{excerpt}</p>
                <div className="tiamsa-date-row">
                  <div className="tiamsa-date-text">{item.date}</div>
                  <div className="tiamsa-card-type">
                    {isDocument ? "Document" : isImage ? "Image" : "Post"}
                  </div>
                </div>
                {isNew(item.id) && <div className="tiamsa-star-badge">NEW</div>}
              </div>
            </article>
          );
        })}
      </main>
    </div>
  );
}
