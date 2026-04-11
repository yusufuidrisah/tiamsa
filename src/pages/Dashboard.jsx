import React, { useState } from "react";
import { FiGrid, FiUsers, FiBell, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import Swal from "sweetalert2";
import "../styles/Dashboard.css";
import AnnouncementsList from "../pages/CreateAnnouncement";
import StudentsManagement from "../pages/StudentsList";
import AdminDashboardContent from "../pages/AdminDashboard";

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Log out?",
      text: "You will be returned to the admin login page.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Log out",
      cancelButtonText: "Stay here",
      confirmButtonColor: "#115c3a",
      cancelButtonColor: "#94a3b8",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      localStorage.removeItem("tiamsa_token");
      window.location.href = "/admin/login";
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FiGrid /> },
    { id: "students", label: "Students", icon: <FiUsers /> },
    { id: "announcements", label: "Announcements", icon: <FiBell /> },
  ];

  return (
    <div className="admin-dashboard">
      {/* Sidebar Overlay for Mobile */}
      {menuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <h2>TIAMSA</h2>
          <span>Admin Panel</span>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={active === item.id ? "active" : ""}
                onClick={() => {
                  setActive(item.id);
                  setMenuOpen(false);
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </li>
            ))}
            <li className="logout-item" onClick={handleLogout}>
              <span className="nav-icon">
                <FiLogOut />
              </span>
              Logout
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        <header className="top-header">
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
          <div className="user-profile-top">
            <span>Welcome, Admin</span>
            <div className="avatar-small">A</div>
          </div>
        </header>

        <main className="dashboard-content">
          {active === "dashboard" && <AdminDashboardContent />}
          {active === "students" && <StudentsManagement />}
          {active === "announcements" && <AnnouncementsList />}
        </main>
      </div>
    </div>
  );
}
