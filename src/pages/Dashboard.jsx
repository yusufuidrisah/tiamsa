import React, { useState } from "react";
import {
  FiGrid,
  FiUsers,
  FiBell,
  FiLogOut,
  FiMenu,
  FiX,
  FiMoon,
  FiSun,
  FiChevronRight,
} from "react-icons/fi";
import Swal from "sweetalert2";
import "../styles/Dashboard.css";
import AnnouncementsList from "../pages/CreateAnnouncement";
import StudentsManagement from "../pages/StudentsList";
import AdminDashboardContent from "../pages/AdminDashboard";

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");

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

  const activeItem = menuItems.find((item) => item.id === active) || menuItems[0];

  return (
    <div className={`admin-dashboard theme-${theme}`}>
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
          <div className="header-title-group">
            <div className="breadcrumb-row">
              <span>Admin</span>
              <FiChevronRight />
              <span>{activeItem.label}</span>
            </div>
            <strong className="header-screen-title">{activeItem.label}</strong>
          </div>
          <div className="header-actions">
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={() =>
                setTheme((current) => (current === "light" ? "dark" : "light"))
              }
            >
              {theme === "light" ? <FiMoon /> : <FiSun />}
              <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
            </button>
            <div className="user-profile-top">
              <span>Welcome, Admin</span>
              <div className="avatar-small">A</div>
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          {active === "dashboard" && (
            <AdminDashboardContent onQuickNavigate={setActive} />
          )}
          {active === "students" && <StudentsManagement />}
          {active === "announcements" && <AnnouncementsList />}
        </main>

        <nav className="mobile-bottom-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={active === item.id ? "active" : ""}
              onClick={() => setActive(item.id)}
            >
              <span>{item.icon}</span>
              <small>{item.label}</small>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
