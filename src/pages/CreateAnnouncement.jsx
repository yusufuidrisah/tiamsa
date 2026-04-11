import React, { useState, useContext, useRef } from "react";
import { AnnouncementsContext } from "../context/AnnouncementsContext";
import {
  FiTrash2,
  FiAlertCircle,
  FiEdit2,
  FiSearch,
  FiPaperclip,
} from "react-icons/fi";
import "../styles/CreateAnnouncement.css";

export default function CreateAnnouncement() {
  const {
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    updateAnnouncement,
  } = useContext(AnnouncementsContext);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    attachment: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const fileInputRef = useRef(null);

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
    if (isEditing) {
      await updateAnnouncement(currentId, formData);
      setIsEditing(false);
    } else {
      await addAnnouncement(
        formData.title,
        formData.content,
        formData.attachment,
      );
    }
    setFormData({ title: "", content: "", attachment: null });
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
    });
  };

  const filtered = announcements
    .filter((a) => {
      const title = a.title?.toLowerCase() || "";
      const content = (a.description || a.content || "").toLowerCase();
      const term = searchTerm.toLowerCase();

      return title.includes(term) || content.includes(term);
    })
    .slice(0, 3);

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
          </div>

          <div className="pro-form-footer">
            <div className="spacer"></div>
            <div className="btn-group">
              {isEditing && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ title: "", content: "", attachment: null });
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
          <h3>Recent Postings</h3>
          <div className="pro-search">
            <FiSearch className="pro-search-icon" />
            <input
              type="text"
              placeholder="Search title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="pro-table-wrapper">
          <table className="pro-table">
            <thead>
              <tr>
                <th>Post Title</th>
                <th>Content Brief</th>
                <th>Attachment</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td className="pro-td-title">{a.title}</td>
                  <td className="pro-td-desc">{a.description || a.content}</td>
                  <td>
                    {a.attachment
                      ? a.attachment.includes("image")
                        ? "Image"
                        : "PDF"
                      : "-"}
                  </td>
                  <td className="text-right">
                    <button
                      className="pro-action-btn edit"
                      onClick={() => handleEdit(a)}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="pro-action-btn del"
                      onClick={() => deleteAnnouncement(a.id, a.title)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
