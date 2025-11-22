import React, { useState, useContext } from "react";
import { AnnouncementsContext } from "../context/AnnouncementsContext";
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
    if (!newAnnouncement.title || !newAnnouncement.content)
      return alert("Fill all fields");

    addAnnouncement(newAnnouncement.title, newAnnouncement.content);

    setNewAnnouncement({ title: "", content: "" });
  };

  return (
    <div className="announcements-container">
      <h2>Announcements</h2>

      <form className="announcements-form" onSubmit={handleAdd}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newAnnouncement.title}
          onChange={handleChange}
        />
        <textarea
          name="content"
          placeholder="Content"
          value={newAnnouncement.content}
          onChange={handleChange}
        />
        <button type="submit">Add Announcement</button>
      </form>

      <table className="announcements-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.description}</td>
              <td>
                <button onClick={() => deleteAnnouncement(a.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
