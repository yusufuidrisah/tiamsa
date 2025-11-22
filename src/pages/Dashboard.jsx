import React, { useState } from "react";
import "../styles/Dashboard.css";
import StudentsList from "./StudentsList";
import CreateAnnouncement from "./CreateAnnouncement";
import Home from "./Home";

export default function Dashboard() {
  const [active, setActive] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false); // mobile hamburger toggle

  const handleLogout = () => {
    localStorage.removeItem("tiamsa_token");
    window.location.href = "/admin/login";
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar / Hamburger menu */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <h2>TIAMSA Admin</h2>
        <nav>
          <ul>
            <li
              className={active === "dashboard" ? "active" : ""}
              onClick={() => {
                setActive("dashboard");
                setMenuOpen(false);
              }}
            >
              Dashboard
            </li>
            <li
              className={active === "students" ? "active" : ""}
              onClick={() => {
                setActive("students");
                setMenuOpen(false);
              }}
            >
              Students
            </li>
            <li
              className={active === "announcements" ? "active" : ""}
              onClick={() => {
                setActive("announcements");
                setMenuOpen(false);
              }}
            >
              Announcements
            </li>
            <li className="logout" onClick={handleLogout}>
              Logout
            </li>
          </ul>
        </nav>
      </aside>

      {/* Hamburger button for mobile */}
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        &#9776; {/* ☰ symbol */}
      </button>

      {/* Main Content */}
      <main className="dashboard-content">
        {active === "dashboard" && <h1>Welcome to Admin Dashboard</h1>}
        {active === "students" && <StudentsList />}
        {active === "announcements" && <CreateAnnouncement />}
      </main>
    </div>
  );
}
