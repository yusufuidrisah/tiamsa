import React from "react";
import { FiUsers, FiUserCheck, FiBell, FiTrendingUp } from "react-icons/fi"; // Install react-icons
import "../styles/AdminDashboard.css";

export default function AdminDashboardContent() {
  const stats = [
    { label: "Total Students", value: 120, icon: <FiUsers />, type: "normal" },
    { label: "Male Students", value: 70, icon: <FiUsers />, type: "normal" },
    { label: "Female Students", value: 50, icon: <FiUsers />, type: "normal" },
    { label: "Announcements", value: 8, icon: <FiBell />, type: "normal" },
    { label: "New Today", value: 3, icon: <FiUserCheck />, type: "highlight" },
    {
      label: "Monthly Growth",
      value: 15,
      icon: <FiTrendingUp />,
      type: "highlight",
    },
  ];

  return (
    <div className="dashboard-content-wrapper">
      <h1 className="dashboard-title">Overview Analysis</h1>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.type}`}>
            <div className="card-header">
              <h3>{stat.label}</h3>
              <span className="icon-wrapper">{stat.icon}</span>
            </div>
            <p>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Hapa unaweza kuongeza sehemu ya "Recent Activity" baadaye */}
    </div>
  );
}
