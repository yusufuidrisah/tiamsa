import React, { useContext, useMemo, useState, useEffect } from "react";
import {
  FiUsers,
  FiUserPlus,
  FiClock,
  FiAward,
  FiBell,
  FiArrowRight,
  FiBarChart2,
} from "react-icons/fi";
import { CourseContext } from "../context/CourseContext";
import { AnnouncementsContext } from "../context/AnnouncementsContext";
import "../styles/AdminDashboard.css";

export default function AdminDashboardContent({ onQuickNavigate }) {
  const { students, getGraduaters } = useContext(CourseContext);
  const { announcements } = useContext(AnnouncementsContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const totalStudents = students.length;
  const maleStudents = students.filter((s) => s.gender === "male").length;
  const femaleStudents = students.filter((s) => s.gender === "female").length;
  const pendingStudents = students.filter((s) => s.status === "pending").length;
  const totalGraduates = getGraduaters().length;
  const today = new Date().toLocaleDateString();
  const registeredToday = students.filter((s) => {
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
      label: "Total Graduates",
      value: totalGraduates,
      icon: <FiAward />,
      type: "normal",
    },
    {
      label: "Announcements",
      value: announcements.length,
      icon: <FiBell />,
      type: "normal",
    },
  ];

  const quickActions = [
    {
      title: "Review Pending Students",
      subtitle: `${pendingStudents} waiting for approval`,
      action: () => onQuickNavigate?.("students"),
    },
    {
      title: "Publish New Notice",
      subtitle: "Create or pin an official announcement",
      action: () => onQuickNavigate?.("announcements"),
    },
  ];

  const courseChart = useMemo(() => {
    const courseMap = students.reduce((acc, student) => {
      acc[student.course] = (acc[student.course] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(courseMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [students]);

  const levelChart = useMemo(() => {
    const labels = ["certificate", "diploma", "degree"];
    return labels.map((level) => ({
      label: level,
      value: students.filter((student) => student.level === level).length,
    }));
  }, [students]);

  const monthChart = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const monthCounts = new Map(months.map((month) => [month, 0]));
    students.forEach((student) => {
      const month = new Date(student.id).toLocaleString("en-US", {
        month: "short",
      });
      if (monthCounts.has(month)) {
        monthCounts.set(month, monthCounts.get(month) + 1);
      }
    });
    return Array.from(monthCounts.entries()).map(([label, value]) => ({
      label,
      value,
    }));
  }, [students]);

  const genderChart = [
    { label: "Male", value: maleStudents },
    { label: "Female", value: femaleStudents },
  ];

  const maxValue = (items) => Math.max(1, ...items.map((item) => item.value ?? item[1]));

  if (loading) {
    return (
      <div className="dashboard-content-wrapper">
        <div className="dashboard-skeleton hero"></div>
        <div className="dashboard-skeleton-grid">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="dashboard-skeleton card"></div>
          ))}
        </div>
        <div className="dashboard-skeleton large"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-content-wrapper">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Overview Analysis</h1>
        <p className="dashboard-subtitle">
          Real-time statistics from TIAMSA database
        </p>
      </div>

      <div className="dashboard-hero-panel">
        <div>
          <span className="dashboard-kicker">Admin Workspace</span>
          <h2>Everything important in one screen</h2>
          <p>
            Track registrations, review pending records, publish notices, and
            watch trends across courses and monthly activity.
          </p>
        </div>
        <div className="dashboard-hero-mini">
          <FiBarChart2 />
          <strong>{students.length}</strong>
          <span>active student records</span>
        </div>
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
            {/* Dark green indicator line at the bottom */}
            <div className="card-indicator"></div>
          </div>
        ))}
      </div>

      <div className="dashboard-quick-grid">
        {quickActions.map((item) => (
          <button
            key={item.title}
            type="button"
            className="dashboard-quick-card"
            onClick={item.action}
          >
            <div>
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </div>
            <FiArrowRight />
          </button>
        ))}
      </div>

      <div className="dashboard-chart-grid">
        <section className="dashboard-chart-card">
          <div className="chart-head">
            <h3>Top Courses</h3>
            <span>Registrations by course</span>
          </div>
          <div className="chart-list">
            {courseChart.map(([label, value]) => (
              <div key={label} className="chart-row">
                <div className="chart-label-line">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
                <div className="chart-bar-track">
                  <div
                    className="chart-bar-fill"
                    style={{ width: `${(value / maxValue(courseChart)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-chart-card">
          <div className="chart-head">
            <h3>Gender Split</h3>
            <span>Current student distribution</span>
          </div>
          <div className="chart-list compact">
            {genderChart.map((item) => (
              <div key={item.label} className="chart-row">
                <div className="chart-label-line">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
                <div className="chart-bar-track">
                  <div
                    className="chart-bar-fill alt"
                    style={{ width: `${(item.value / maxValue(genderChart)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-chart-card">
          <div className="chart-head">
            <h3>Study Level</h3>
            <span>Certificate, diploma, degree</span>
          </div>
          <div className="chart-list compact">
            {levelChart.map((item) => (
              <div key={item.label} className="chart-row">
                <div className="chart-label-line">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
                <div className="chart-bar-track">
                  <div
                    className="chart-bar-fill"
                    style={{ width: `${(item.value / maxValue(levelChart)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-chart-card">
          <div className="chart-head">
            <h3>Monthly Intake</h3>
            <span>Recent registration flow</span>
          </div>
          <div className="month-chart">
            {monthChart.map((item) => (
              <div key={item.label} className="month-chart-item">
                <div className="month-chart-track">
                  <div
                    className="month-chart-fill"
                    style={{ height: `${(item.value / maxValue(monthChart)) * 100}%` }}
                  ></div>
                </div>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

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
                    {s.f_name} {s.m_name} {s.l_name}
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
