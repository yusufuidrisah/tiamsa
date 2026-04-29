import React, { useContext, useState, useEffect } from "react";
import Header from "../components/Header";
import {
  FiCalendar,
  FiArrowLeft,
  FiClock,
  FiDownload,
  FiFileText,
  FiImage,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiBell,
} from "react-icons/fi";
import { AnnouncementsContext } from "../context/AnnouncementsContext";
import "../styles/Announcement.css";

export default function Announcements() {
  const { announcements } = useContext(AnnouncementsContext);

  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const perPage = 6;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const sortedData = [...announcements].sort((a, b) => {
    if (Boolean(b.pinned) !== Boolean(a.pinned)) {
      return Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));
    }
    return b.id - a.id;
  });

  const pinnedAnnouncement = sortedData.find((item) => item.pinned);
  const normalAnnouncements = sortedData.filter((item) => !item.pinned);

  const totalPages = Math.max(
    1,
    Math.ceil(normalAnnouncements.length / perPage),
  );

  const paginatedAnnouncements = normalAnnouncements.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

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
    return text.slice(0, 105) + "...";
  };

  const handleOpenAnnouncement = (item) => {
    setSelectedItem(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="tiamsa-page">
        <Header />
        <div className="loading">Loading announcements...</div>
      </div>
    );
  }

  if (selectedItem) {
    const { isImage, isDocument } = getAttachmentMeta(selectedItem.attachment);
    const detailContent = selectedItem.description || selectedItem.content;

    return (
      <div className="tiamsa-page">
        <Header />

        <main className="announcement-detail">
          <button className="back-btn" onClick={() => setSelectedItem(null)}>
            <FiArrowLeft /> Back
          </button>

          <section className="detail-hero-card">
            <div className="detail-hero-main">
              <span className="detail-page-kicker">Official Notice</span>
              <h1 className="detail-title">{selectedItem.title}</h1>

              <div className="detail-meta">
                <span>
                  <FiCalendar /> Published: {selectedItem.date}
                </span>

                <span>
                  <FiClock /> Updated: {selectedItem.updatedAt || selectedItem.date}
                </span>

                <span className="detail-category">
                  {selectedItem.category || "General"}
                </span>
              </div>

              <p className="detail-intro">
                Review the full notice below. Any attached document or image is
                provided in the attachment section for download.
              </p>
            </div>

            <aside className="detail-summary-card">
              <h2>Notice Summary</h2>
              <div className="detail-summary-row">
                <span>Status</span>
                <strong>{selectedItem.pinned ? "Priority" : "Published"}</strong>
              </div>
              <div className="detail-summary-row">
                <span>Category</span>
                <strong>{selectedItem.category || "General"}</strong>
              </div>
              <div className="detail-summary-row">
                <span>Attachment</span>
                <strong>
                  {isImage
                    ? "Image"
                    : isDocument
                      ? "Document"
                      : "No attachment"}
                </strong>
              </div>
            </aside>
          </section>

          {(isImage || isDocument) && (
            <section className="detail-section-card">
              <div className="section-heading">
                <h2>Attachment</h2>
                <span>
                  {isImage ? "Attached image preview" : "Attached document"}
                </span>
              </div>

              {isImage && (
                <div className="image-preview-container">
                  <img
                    src={selectedItem.attachment}
                    alt={selectedItem.title}
                    className="detail-image"
                  />

                  <div className="image-actions">
                    <a
                      href={selectedItem.attachment}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="download-btn"
                    >
                      <FiDownload /> Download Image
                    </a>
                  </div>
                </div>
              )}

              {isDocument && (
                <div className="doc-box">
                  <FiFileText size={40} />

                  <p>Official announcement document attached to this notice.</p>

                  <a
                    href={selectedItem.attachment}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="download-btn"
                  >
                    <FiDownload /> Download Document
                  </a>
                </div>
              )}
            </section>
          )}

          <section className="detail-section-card">
            <div className="section-heading">
              <h2>Full Announcement</h2>
              <span>Read the complete notice details below</span>
            </div>

            <div className="detail-body">{detailContent}</div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="tiamsa-page">
      <Header />

      <div className="hero">
        <div className="hero-shell">
          <div className="hero-copy">
            <span className="hero-kicker">
              <FiBell /> Official Announcements
            </span>
            <h1>Announcement Board</h1>
            <p>
              Official notices, student communication, and academic updates from
              TIAMSA.
            </p>
          </div>

          <div className="hero-stats">
            <div className="hero-stat-card">
              <span className="stat-label">Published notices</span>
              <strong>{announcements.length}</strong>
            </div>
            <div className="hero-stat-card">
              <span className="stat-label">Priority notices</span>
              <strong>{pinnedAnnouncement ? "1" : "0"}</strong>
            </div>
          </div>
        </div>

        <div className="hero-divider" />
      </div>

      <main className="announcement-grid">
        {pinnedAnnouncement && (
          <section
            className="pinned-banner"
            onClick={() => handleOpenAnnouncement(pinnedAnnouncement)}
          >
            <div className="pinned-copy">
              <span className="pinned-label">
                <FiStar /> Pinned Notice
              </span>

              <h2>{pinnedAnnouncement.title}</h2>

              <p>
                {getExcerpt(
                  pinnedAnnouncement.description || pinnedAnnouncement.content,
                )}
              </p>
            </div>

            <button type="button" className="pinned-action">
              View notice
            </button>
          </section>
        )}

        {paginatedAnnouncements.map((item) => {
          const { hasAttachment, isImage, isDocument } = getAttachmentMeta(
            item.attachment,
          );

          const excerpt = getExcerpt(item.description || item.content || "");

          return (
            <article
              key={item.id}
              className="announcement-card"
              onClick={() => handleOpenAnnouncement(item)}
            >
              <div className="card-meta">
                <span>
                  <FiCalendar /> {item.date}
                </span>

                <span className="category">{item.category || "General"}</span>
              </div>

              <h2 className="card-title">{item.title}</h2>

              <p className="card-text">{excerpt}</p>

              {hasAttachment && (
                <div className="card-attachment">
                  {isImage && <FiImage />}
                  {isDocument && <FiFileText />}

                  <span>
                    {isImage ? "Image attached" : "Document attached"}
                  </span>
                </div>
              )}

              <div className="read-more">View announcement</div>
            </article>
          );
        })}
      </main>

      {normalAnnouncements.length > 0 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
            <FiChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={currentPage === page ? "active" : ""}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
