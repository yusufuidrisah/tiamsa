import React, { useContext } from "react";
import { FiUsers, FiTrendingUp, FiUserPlus, FiClock } from "react-icons/fi";
import { CourseContext } from "../context/CourseContext";
import "../styles/AdminDashboard.css";

export default function AdminDashboardContent() {
  const { students } = useContext(CourseContext);

  // LOGIC YA KUHESABU DATA HALISI
  const totalStudents = students.length;
  const maleStudents = students.filter((s) => s.gender === "male").length;
  const femaleStudents = students.filter((s) => s.gender === "female").length;
  const pendingStudents = students.filter((s) => s.status === "pending").length;

  // Kuhesabu waliojisajili leo (Today's Registration)
  const today = new Date().toLocaleDateString();
  const registeredToday = students.filter((s) => {
    // Tunachukua mwanafunzi aliyeumbwa leo kwa kutumia ID (Date.now())
    const studentDate = new Date(s.id).toLocaleDateString();
    return studentDate === today;
  }).length;

  const stats = [
    {
      label: "Total Students",
      value: totalStudents,
      icon: <FiUsers />,
      type: "normal",
    },
    {
      label: "Male Students",
      value: maleStudents,
      icon: <FiUsers />,
      type: "normal",
    },
    {
      label: "Female Students",
      value: femaleStudents,
      icon: <FiUsers />,
      type: "normal",
    },
    {
      label: "Pending Approval",
      value: pendingStudents,
      icon: <FiClock />,
      type: "highlight",
    },
    {
      label: "New Today",
      value: registeredToday,
      icon: <FiUserPlus />,
      type: "highlight",
    },
    {
      label: "Growth Rate",
      value: totalStudents > 0 ? "Active" : "Stable",
      icon: <FiTrendingUp />,
      type: "normal",
    },
  ];

  return (
    <div className="dashboard-content-wrapper">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Overview Analysis</h1>
        <p className="dashboard-subtitle">
          Real-time statistics from TIAMSA database
        </p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.type}`}>
            <div className="card-inner">
              <div className="stat-info">
                <h3>{stat.label}</h3>
                <p>{stat.value}</p>
              </div>
              <span className="icon-wrapper">{stat.icon}</span>
            </div>
            {/* Hii inatengeneza kale kamstari ka rangi chini */}
            <div className="card-indicator"></div>
          </div>
        ))}
      </div>

      {/* Sehemu ya nyongeza: Recent Activity Preview */}
      <div className="recent-section">
        <h3>Recent Registrations</h3>
        <div className="recent-list">
          {students
            .slice(-4)
            .reverse()
            .map((s, i) => (
              <div key={i} className="recent-item">
                <div className="recent-avatar">
                  {s.f_name[0]}
                  {s.l_name[0]}
                </div>
                <div className="recent-details">
                  <strong>
                    {s.f_name} {s.l_name}
                  </strong>
                  <span>{s.course}</span>
                </div>
                <span className={`status-pill ${s.status}`}>{s.status}</span>
              </div>
            ))}
          {students.length === 0 && <p>No recent activity found.</p>}
        </div>
      </div>
    </div>
  );
}
