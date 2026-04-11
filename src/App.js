import React from "react";
import { CourseProvider } from "./context/CourseContext";
import { AnnouncementsProvider } from "./context/AnnouncementsContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Register from "./pages/Register";
import Announcements from "./pages/Announcements";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <CourseProvider>
      <AnnouncementsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<Register />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </AnnouncementsProvider>
    </CourseProvider>
  );
}
