import React, { useState, useContext, useRef, useEffect } from "react";
import { AnnouncementsContext } from "../context/AnnouncementsContext";
import {
  FiTrash2,
  FiAlertCircle,
  FiEdit2,
  FiSearch,
  FiPaperclip,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiImage,
  FiStar,
} from "react-icons/fi";
import "../styles/CreateAnnouncement.css";

const announcementCategories = [
  "General",
  "Academic",
  "Exams",
  "Events",
  "Administration",
];

export default function CreateAnnouncement() {
  const {
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    updateAnnouncement,
    bulkDeleteAnnouncements,
  } = useContext(AnnouncementsContext);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    attachment: null,
    category: "General",
    pinned: false,
    publishedBy: "TIAMSA Admin",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnnouncements, setSelectedAnnouncements] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [tableDensity, setTableDensity] = useState("comfortable");
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const itemsPerPage = 4;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert("File under 2MB only.");
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData({ ...formData, attachment: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!formData.title.trim()) nextErrors.title = "Title is required.";
    if (!formData.publishedBy.trim()) nextErrors.publishedBy = "Publisher is required.";
    if (!formData.content.trim()) nextErrors.content = "Description is required.";
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (isEditing) {
      await updateAnnouncement(currentId, formData);
      setIsEditing(false);
    } else {
      await addAnnouncement(formData);
    }
    setFormData({
      title: "",
      content: "",
      attachment: null,
      category: "General",
      pinned: false,
      publishedBy: "TIAMSA Admin",
    });
    setFormErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = (a) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsEditing(true);
    setCurrentId(a.id);
    setFormData({
      title: a.title,
      content: a.description || a.content,
      attachment: a.attachment,
      category: a.category || "General",
      pinned: Boolean(a.pinned),
      publishedBy: a.publishedBy || "TIAMSA Admin",
    });
  };

  const filtered = announcements
    .filter((a) => {
      const title = a.title?.toLowerCase() || "";
      const content = (a.description || a.content || "").toLowerCase();
      const term = searchTerm.toLowerCase();

      return title.includes(term) || content.includes(term);
    })
    .sort((a, b) => {
      if (Boolean(b.pinned) !== Boolean(a.pinned)) {
        return Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));
      }
      const first = String(a[sortConfig.key] ?? "").toLowerCase();
      const second = String(b[sortConfig.key] ?? "").toLowerCase();
      if (first < second) return sortConfig.direction === "asc" ? -1 : 1;
      if (first > second) return sortConfig.direction === "asc" ? 1 : -1;
      return b.id - a.id;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginatedAnnouncements = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const getAttachmentType = (attachment) => {
    if (!attachment) return "No file";
    return attachment.includes("image") ? "Image" : "PDF";
  };

  const renderHighlightedText = (text, query) => {
    const value = String(text ?? "");
    const term = query.trim();

    if (!term) return value;

    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = value.split(new RegExp(`(${escaped})`, "gi"));

    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={`${part}-${index}`} className="search-highlight">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  const toggleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const toggleAnnouncementSelection = (id) => {
    setSelectedAnnouncements((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const toggleSelectAllVisible = () => {
    const ids = paginatedAnnouncements.map((item) => item.id);
    const allSelected = ids.every((id) => selectedAnnouncements.includes(id));
    setSelectedAnnouncements((current) =>
      allSelected
        ? current.filter((id) => !ids.includes(id))
        : [...new Set([...current, ...ids])],
    );
  };

  const exportSelectedAnnouncements = () => {
    if (selectedAnnouncements.length === 0) return;
    const rows = announcements.filter((item) => selectedAnnouncements.includes(item.id));
    const csv = [
      ["Title", "Category", "Published By", "Date", "Pinned"].join(","),
      ...rows.map((item) =>
        [
          `"${item.title}"`,
          item.category || "General",
          `"${item.publishedBy || "TIAMSA Admin"}"`,
          item.date || "",
          item.pinned ? "Yes" : "No",
        ].join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "selected-announcements.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBulkDelete = async () => {
    if (selectedAnnouncements.length === 0) return;
    const deleted = await bulkDeleteAnnouncements(selectedAnnouncements);
    if (deleted) setSelectedAnnouncements([]);
  };

  if (loading) {
    return (
      <div className="pro-admin-container">
        <div className="pro-skeleton large"></div>
        <div className="pro-skeleton medium"></div>
      </div>
    );
  }

  return (
    <div className="pro-admin-container">
      <header className="pro-header">
        <div className="title-area">
          <h2>
            <FiAlertCircle /> Announcement Manager
          </h2>
          <p>Create, update and manage portal notifications</p>
        </div>
      </header>

      <section className={`pro-card ${isEditing ? "is-editing" : ""}`}>
        <form onSubmit={handleSubmit}>
          <div className="pro-form-row">
            <div className="pro-input-group flex-2">
              <label className="pro-label">Announcement Title</label>
              <input
                type="text"
                placeholder="Ex: Graduation Ceremony 2026"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              {formErrors.title && <small className="form-error">{formErrors.title}</small>}
            </div>
            <div className="pro-input-group flex-1">
              <label className="pro-label">Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                {announcementCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="pro-input-group flex-1">
              <label className="pro-label">Attachment (Optional)</label>
              <div className="pro-file-wrapper">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  id="file"
                  hidden
                />
                <label htmlFor="file" className="pro-file-btn">
                  <FiPaperclip />{" "}
                  {formData.attachment ? "File Ready" : "Upload Image/PDF"}
                </label>
                {formData.attachment && (
                  <button
                    type="button"
                    className="pro-remove-link"
                    onClick={() =>
                      setFormData({ ...formData, attachment: null })
                    }
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="pro-form-row">
            <div className="pro-input-group flex-2">
              <label className="pro-label">Published By</label>
              <input
                type="text"
                value={formData.publishedBy}
                onChange={(e) =>
                  setFormData({ ...formData, publishedBy: e.target.value })
                }
                placeholder="TIAMSA Admin"
                required
              />
              {formErrors.publishedBy && (
                <small className="form-error">{formErrors.publishedBy}</small>
              )}
            </div>
            <div className="pro-input-group flex-1 pro-check-group">
              <label className="pro-label">Priority</label>
              <label className="pro-check-card">
                <input
                  type="checkbox"
                  checked={formData.pinned}
                  onChange={(e) =>
                    setFormData({ ...formData, pinned: e.target.checked })
                  }
                />
                <span>
                  <FiStar /> Pin this announcement
                </span>
              </label>
            </div>
          </div>

          <div className="pro-input-group">
            <label className="pro-label">Full Description</label>
            <textarea
              placeholder="Detailed information for the students..."
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
            />
            {formErrors.content && <small className="form-error">{formErrors.content}</small>}
          </div>

          {formData.attachment && (
            <div className="pro-attachment-preview">
              {formData.attachment.includes("image") ? (
                <img
                  src={formData.attachment}
                  alt="Attachment preview"
                  className="pro-attachment-image"
                />
              ) : (
                <div className="pro-attachment-doc">
                  <FiFileText />
                  <div>
                    <strong>Document attached</strong>
                    <p>The PDF is ready and will be visible to students.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pro-form-footer">
            <div className="spacer"></div>
            <div className="btn-group">
              {isEditing && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      title: "",
                      content: "",
                      attachment: null,
                      category: "General",
                      pinned: false,
                      publishedBy: "TIAMSA Admin",
                    });
                  }}
                >
                  Discard Changes
                </button>
              )}
              <button type="submit" className="btn-save">
                {isEditing ? "Update Announcement" : "Publish Announcement"}
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="pro-list-area">
        <div className="pro-list-header">
          <div>
            <h3>All Postings</h3>
            <p className="pro-list-copy">
              {filtered.length} announcement{filtered.length === 1 ? "" : "s"}{" "}
              available
            </p>
          </div>
          <div className="pro-search">
            <FiSearch className="pro-search-icon" />
            <input
              type="text"
              placeholder="Search title..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="pro-toolbar-row">
          <div className="density-switch">
            <button
              type="button"
              className={tableDensity === "compact" ? "active" : ""}
              onClick={() => setTableDensity("compact")}
            >
              Compact
            </button>
            <button
              type="button"
              className={tableDensity === "comfortable" ? "active" : ""}
              onClick={() => setTableDensity("comfortable")}
            >
              Comfortable
            </button>
          </div>
          {selectedAnnouncements.length > 0 && (
            <div className="pro-bulk-actions">
              <span>{selectedAnnouncements.length} selected</span>
              <button type="button" onClick={exportSelectedAnnouncements}>
                <FiFileText /> Export
              </button>
              <button type="button" className="danger" onClick={handleBulkDelete}>
                <FiTrash2 /> Delete
              </button>
            </div>
          )}
        </div>

        <div className="pro-table-wrapper">
          <table className={`pro-table density-${tableDensity}`}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      paginatedAnnouncements.length > 0 &&
                      paginatedAnnouncements.every((item) =>
                        selectedAnnouncements.includes(item.id),
                      )
                    }
                    onChange={toggleSelectAllVisible}
                  />
                </th>
                <th>
                  <button type="button" className="sort-btn" onClick={() => toggleSort("title")}>
                    Post Title
                  </button>
                </th>
                <th>
                  <button type="button" className="sort-btn" onClick={() => toggleSort("category")}>
                    Category
                  </button>
                </th>
                <th>Content Brief</th>
                <th>Meta</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAnnouncements.map((a) => (
                <tr key={a.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedAnnouncements.includes(a.id)}
                      onChange={() => toggleAnnouncementSelection(a.id)}
                    />
                  </td>
                  <td className="pro-td-title">
                    {renderHighlightedText(a.title, searchTerm)}
                  </td>
                  <td>
                    <span
                      className={`announcement-category-badge ${String(
                        a.category || "General",
                      )
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {a.category || "General"}
                    </span>
                  </td>
                  <td className="pro-td-desc">
                    {renderHighlightedText(
                      a.description || a.content,
                      searchTerm,
                    )}
                  </td>
                  <td>
                    <div className="pro-meta-stack">
                      <span>{getAttachmentType(a.attachment)}</span>
                      <span>{a.pinned ? "Pinned" : "Standard"}</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      className="pro-action-btn edit"
                      onClick={() => handleEdit(a)}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      type="button"
                      className="pro-action-btn del"
                      onClick={() => deleteAnnouncement(a.id, a.title)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedAnnouncements.length === 0 && (
                <tr>
                  <td colSpan="6" className="pro-empty-row">
                    <div className="pro-empty-state">
                      <strong>No announcements found</strong>
                      <p>
                        Try another search term or create a new announcement.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pro-mobile-list">
          {paginatedAnnouncements.map((a) => (
            <article key={a.id} className="pro-mobile-card">
              <div className="pro-mobile-card-top">
                <div>
                  <h4>{renderHighlightedText(a.title, searchTerm)}</h4>
                  <p>
                    {a.category || "General"} | {a.date}
                  </p>
                </div>
                <span className="pro-file-chip">
                  {a.attachment && a.attachment.includes("image") ? (
                    <FiImage />
                  ) : (
                    <FiFileText />
                  )}
                  {getAttachmentType(a.attachment)}
                </span>
              </div>
              <div className="pro-mobile-meta-line">
                <span>{a.publishedBy || "TIAMSA Admin"}</span>
                {a.pinned && <strong>Pinned</strong>}
              </div>
              <div className="pro-mobile-badge-row">
                <span
                  className={`announcement-category-badge ${String(
                    a.category || "General",
                  )
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {a.category || "General"}
                </span>
              </div>
              <p className="pro-mobile-desc">
                {renderHighlightedText(a.description || a.content, searchTerm)}
              </p>
              <div className="pro-mobile-actions">
                <button
                  type="button"
                  className="pro-mobile-action edit"
                  onClick={() => handleEdit(a)}
                >
                  <FiEdit2 /> Edit Card
                </button>
                <button
                  type="button"
                  className="pro-mobile-action del"
                  onClick={() => deleteAnnouncement(a.id, a.title)}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </article>
          ))}
          {paginatedAnnouncements.length === 0 && (
            <div className="pro-empty-state pro-empty-state-mobile">
              <strong>No announcements found</strong>
              <p>Try another search term or publish a new announcement.</p>
            </div>
          )}
        </div>

        {filtered.length > 0 && (
          <div className="pro-pagination">
            <button
              type="button"
              className="pro-pagination-btn"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              <FiChevronLeft /> Previous
            </button>

            <div className="pro-pagination-pages">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    className={`pro-pagination-number ${
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
              className="pro-pagination-btn"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next <FiChevronRight />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
