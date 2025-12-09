import { useContext } from "react";
import { CourseContext } from "../context/CourseContext";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import "../styles/register.css";

export default function Register() {
  const {
    formData,
    setFormData,
    handleChange,
    handleFile,
    handleSubmit,
    filteredCourses,
    setFilteredCourses,
    courseOptions,
  } = useContext(CourseContext);
  return (
    <>
      <Header />
      <div className="register-hero">
        <h1>Student Registration</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label>Full Name (As on Student ID)</label>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="regNo"
              value={formData.regNo}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label>Registration Number</label>
          </div>

          {/* LEVEL */}
          <div className="form-group">
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
            >
              <option value="">Select Level</option>
              <option value="certificate">Certificate</option>
              <option value="diploma">Diploma</option>
              <option value="degree">Degree</option>
              <option value="masters">Masters</option>
            </select>
            <label>Level</label>
          </div>

          {/* COURSE – DYNAMIC */}
          <div className="form-group">
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
            >
              <option value="">Select Course</option>
              {filteredCourses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <label>Course</label>
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label>Email</label>
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) => {
                // Remove non-digit characters
                const value = e.target.value.replace(/\D/g, "");
                // Limit to 9 digits max
                if (value.length <= 10) {
                  setFormData({ ...formData, phone: value });
                }
              }}
              required
              placeholder=" "
            />
            <label>Phone Number</label>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="campus"
              value={formData.campus}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label>Campus</label>
          </div>

          <div className="form-group">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <label>Gender</label>
          </div>

          {/* FILE UPLOAD */}
          <div className="form-group">
            <input
              type="file"
              name="studentID"
              accept="image/*,application/pdf"
              onChange={handleFile}
              required
            />
            <label>Upload Student ID</label>
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
