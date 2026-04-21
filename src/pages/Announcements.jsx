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
  FiBell,
  FiStar,
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
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  const sortedData = [...announcements].sort((a, b) => {
    if (Boolean(b.pinned) !== Boolean(a.pinned)) {
      return Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));
    }
    return b.id - a.id;
  });
  const totalPages = Math.max(1, Math.ceil(sortedData.length / perPage));
  const paginatedAnnouncements = sortedData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

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

  const pinnedAnnouncement = sortedData.find((item) => item.pinned);

  if (loading) {
    return (
      <div className="tiamsa-page">
        <Header />
        <div className="tiamsa-hero">
          <div className="hero-inner">
            <h1>Official Updates & Notices</h1>
          </div>
        </div>
        <main className="tiamsa-grid">
          <div className="announcement-skeleton banner"></div>
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="announcement-skeleton card"></div>
          ))}
        </main>
      </div>
    );
  }

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
              <span>{selectedItem.category || "General"}</span>
              <span>By: {selectedItem.publishedBy || "TIAMSA Admin"}</span>
              <span>
                <FiClock /> Updated: {selectedItem.updatedAt || selectedItem.date}
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
        <section className="announcement-summary-card">
          <div>
            <span className="announcement-summary-label">Published notices</span>
            <h2>{sortedData.length}</h2>
            <p>Browse every official update in smaller pages that feel cleaner on mobile.</p>
          </div>
          <div className="announcement-summary-icon">
            <FiBell />
          </div>
        </section>

        {pinnedAnnouncement && (
          <section
            className="pinned-announcement-banner"
            onClick={() => setSelectedItem(pinnedAnnouncement)}
          >
            <div>
              <span className="announcement-summary-label">Pinned Notice</span>
              <h2>{pinnedAnnouncement.title}</h2>
              <p>
                {pinnedAnnouncement.description || pinnedAnnouncement.content}
              </p>
            </div>
            <span
              className={`announcement-category-badge ${String(
                pinnedAnnouncement.category || "General",
              )
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              {pinnedAnnouncement.category || "General"}
            </span>
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
              className="tiamsa-card"
              onClick={() => setSelectedItem(item)}
            >
              <div className="tiamsa-card-body">
                <div className="tiamsa-card-topline">
                  <div className="tiamsa-meta-inline">
                    <div className="tiamsa-date-text">{item.date}</div>
                    {item.pinned && (
                      <span className="tiamsa-pin-badge">
                        <FiStar /> Pinned
                      </span>
                    )}
                  </div>
                  <div className="tiamsa-card-type">{item.category || "General"}</div>
                </div>

                <h2 className="tiamsa-title-text">{item.title}</h2>
                <p className="tiamsa-excerpt">{excerpt}</p>

                <div className="tiamsa-publisher-row">
                  <span>Published by {item.publishedBy || "TIAMSA Admin"}</span>
                  <span>Updated {item.updatedAt || item.date}</span>
                </div>

                {hasAttachment && (
                  <div className="tiamsa-attachment-row">
                    <span className="tiamsa-attachment-icon">
                      {isImage ? <FiImage /> : <FiFileText />}
                    </span>
                    <span className="tiamsa-attachment-text">
                      {isImage ? "Image attached" : "Document attached"}
                    </span>
                    {isDocument && (
                      <a
                        href={item.attachment}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="tiamsa-inline-attachment-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiDownload /> Download
                      </a>
                    )}
                  </div>
                )}

                {isImage && (
                  <div className="tiamsa-card-inline-media">
                    <img src={item.attachment} alt={item.title} />
                  </div>
                )}

                <div className="tiamsa-readmore-row">
                  <span className="tiamsa-readmore">Open announcement</span>
                </div>

                {isNew(item.id) && <div className="tiamsa-star-badge">NEW</div>}
              </div>
            </article>
          );
        })}

        {sortedData.length === 0 && (
          <div className="announcement-empty-state">
            No announcements have been published yet.
          </div>
        )}
      </main>

      {sortedData.length > 0 && (
        <div className="announcement-pagination-wrap">
          <button
            type="button"
            className="announcement-pagination-btn"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            <FiChevronLeft /> Previous
          </button>

          <div className="announcement-pagination-pages">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  className={`announcement-pagination-number ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <button
            type="button"
            className="announcement-pagination-btn"
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
