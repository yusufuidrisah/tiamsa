import React, { useState, useContext } from "react";
import { AnnouncementsContext } from "../context/AnnouncementsContext";
import { FiSend, FiTrash2, FiAlertCircle } from "react-icons/fi";
import "../styles/CreateAnnouncement.css";

export default function AnnouncementsList() {
  const { announcements, addAnnouncement, deleteAnnouncement } =
    useContext(AnnouncementsContext);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  });

  const handleChange = (e) => {
    setNewAnnouncement({ ...newAnnouncement, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      return alert("Tafadhali jaza kichwa cha habari na maelezo.");
    }

    addAnnouncement(newAnnouncement.title, newAnnouncement.content);
    setNewAnnouncement({ title: "", content: "" });
  };

  return (
    <div className="announcements-container">
      <div className="announcement-header">
        <h2>
          <FiAlertCircle /> Announcements Management
        </h2>
        <p>Create and manage all TIAMSA announcements here.</p>
      </div>

      {/* FORM CARD */}
      <div className="announcement-form-card">
        <form onSubmit={handleAdd}>
          <div className="input-field">
            <label>Announcement Title</label>
            <input
              type="text"
              name="title"
              placeholder="Mfano: Taarifa ya Mitihani..."
              value={newAnnouncement.title}
              onChange={handleChange}
            />
          </div>

          <div className="input-field">
            <label>Detailed Content (Supports New Lines)</label>
            <textarea
              name="content"
              placeholder="Andika tangazo lako hapa. Ukibonyeza 'Enter' kwenda mstari mpya, itaonekana hivyo hivyo..."
              value={newAnnouncement.content}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="publish-btn">
            <FiSend /> Publish Announcement
          </button>
        </form>
      </div>

      {/* TABLE SECTION */}
      <div className="announcement-list-section">
        <h3>Recent Announcements</h3>
        <div className="table-responsive">
          <table className="announcements-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Content Description</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {announcements.length === 0 ? (
                <tr>
                  <td colSpan="3" className="no-data">
                    No announcements have been published yet.
                  </td>
                </tr>
              ) : (
                announcements.map((a) => (
                  <tr key={a.id}>
                    <td data-label="Title" className="title-td">
                      {a.title}
                    </td>
                    <td data-label="Content" className="content-td">
                      {a.description || a.content}
                    </td>
                    <td data-label="Action" className="text-center">
                      <button
                        className="delete-icon-btn"
                        onClick={() => deleteAnnouncement(a.id)}
                        title="Futa Tangazo"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
