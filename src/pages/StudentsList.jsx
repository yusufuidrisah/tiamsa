import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiCamera,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import "../styles/Student-list.css";

const courseOptions = {
  certificate: ["BTCA", "BTCPLM", "BTCBA", "BTCHRM", "BTCMPR", "BTCPSAF"],
  diploma: ["DIT", "DBA", "Procurement"],
  degree: ["BAC", "BPLM", "BBA", "BHRM", "BMPR", "BPSAF"],
  masters: ["MSc ACC & FIN", "MSc PSM", "MBA PM", "MHRM-IT"],
};

const emptyForm = {
  f_name: "",
  m_name: "",
  l_name: "",
  regNo: "",
  level: "",
  course: "",
  email: "",
  phone: "",
  campus: "Dar es Salaam",
  gender: "",
  studentID: null,
};

export default function StudentsManagement() {
  const [students, setStudents] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewStudent, setViewStudent] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("students")) || [];
    setStudents(data);
  }, []);

  useEffect(() => {
    if (form.level) {
      setFilteredCourses(courseOptions[form.level] || []);
    }
  }, [form.level]);

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
    if (show)
      setTimeout(() => setAlert({ show: false, msg: "", type: "" }), 3000);
  };

  const saveLS = (data) =>
    localStorage.setItem("students", JSON.stringify(data));

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024)
      return showAlert(true, "error", "File too large! Max 1MB.");

    const reader = new FileReader();
    reader.onloadend = () =>
      setForm((prev) => ({ ...prev, studentID: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updated;
    if (editMode) {
      updated = students.map((s) => (s.regNo === form.regNo ? form : s));
      showAlert(true, "success", "Record updated successfully!");
    } else {
      if (students.find((s) => s.regNo === form.regNo))
        return showAlert(true, "error", "Registration Number already exists!");
      updated = [...students, form];
      showAlert(true, "success", "Student registered successfully!");
    }
    setStudents(updated);
    saveLS(updated);
    setForm(emptyForm);
    setEditMode(false);
  };

  const handleDelete = (regNo) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      const filtered = students.filter((s) => s.regNo !== regNo);
      setStudents(filtered);
      saveLS(filtered);
      showAlert(true, "error", "Record deleted.");
    }
  };

  const filteredData = students.filter((s) => {
    const searchStr =
      `${s.f_name} ${s.m_name} ${s.l_name} ${s.regNo}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredData.length / studentsPerPage);
  const currentStudents = filteredData.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  return (
    <div className="students-container">
      {alert.show && (
        <div className={`flash-alert ${alert.type}`}>{alert.msg}</div>
      )}

      <div className="page-header">
        <h2>Student Management System</h2>
        <button className="export-btn" onClick={() => window.print()}>
          <FiDownload /> Print List
        </button>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <h3>{editMode ? "Edit Student Details" : "Register New Student"}</h3>
          <div className="input-group">
            <input
              name="f_name"
              value={form.f_name}
              onChange={handleChange}
              placeholder="First Name"
              required
            />
            <input
              name="m_name"
              value={form.m_name}
              onChange={handleChange}
              placeholder="Middle Name"
            />
            <input
              name="l_name"
              value={form.l_name}
              onChange={handleChange}
              placeholder="Last Name"
              required
            />
            <input
              name="regNo"
              value={form.regNo}
              onChange={handleChange}
              placeholder="Registration No"
              disabled={editMode}
              required
            />

            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              required
            >
              <option value="">Select Level</option>
              {Object.keys(courseOptions).map((l) => (
                <option key={l} value={l}>
                  {l.toUpperCase()}
                </option>
              ))}
            </select>

            <select
              name="course"
              value={form.course}
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

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
            />

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <div className="file-upload-section">
              <label htmlFor="studentID" className="file-label">
                <FiCamera /> {form.studentID ? "Change Photo" : "Upload Photo"}
              </label>
              <input
                id="studentID"
                type="file"
                accept="image/*"
                onChange={handleFile}
                style={{ display: "none" }}
              />
              {form.studentID && (
                <div className="img-preview">
                  <img src={form.studentID} alt="preview" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, studentID: null })}
                  >
                    <FiX />
                  </button>
                </div>
              )}
            </div>
          </div>
          <button type="submit" className="submit-btn">
            {editMode ? "Save Changes" : "Register Student"}
          </button>
        </form>
      </div>

      <div className="table-section">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            placeholder="Search by name or registration number..."
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="table-wrapper">
          <table className="students-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Reg No</th>
                <th>Course</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((st) => (
                <tr key={st.regNo}>
                  <td className="name-cell">
                    <img
                      src={st.studentID || "https://via.placeholder.com/40"}
                      className="table-img"
                      alt=""
                    />
                    <div>
                      <strong>
                        {st.f_name} {st.m_name} {st.l_name}
                      </strong>
                    </div>
                  </td>
                  <td>
                    <span className="reg-badge">{st.regNo}</span>
                  </td>
                  <td>{st.course}</td>
                  <td className="actions">
                    <button
                      className="view-btn"
                      title="View"
                      onClick={() => setViewStudent(st)}
                    >
                      <FiEye />
                    </button>
                    <button
                      className="edit-btn"
                      title="Edit"
                      onClick={() => {
                        setForm(st);
                        setEditMode(true);
                      }}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="delete-btn"
                      title="Delete"
                      onClick={() => handleDelete(st.regNo)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <FiChevronLeft />
          </button>
          <span>
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {viewStudent && (
        <div className="overlay" onClick={() => setViewStudent(null)}>
          <div className="student-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bg"></div>
            <div className="modal-content">
              <img
                src={viewStudent.studentID || "https://via.placeholder.com/100"}
                alt="Profile"
              />
              <h3>
                {viewStudent.f_name} {viewStudent.m_name} {viewStudent.l_name}
              </h3>
              <div className="details-grid">
                <p>
                  <strong>Reg No:</strong> {viewStudent.regNo}
                </p>
                <p>
                  <strong>Course:</strong> {viewStudent.course} (
                  {viewStudent.level})
                </p>
                <p>
                  <strong>Phone:</strong> {viewStudent.phone || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {viewStudent.email || "N/A"}
                </p>
                <p>
                  <strong>Campus:</strong> {viewStudent.campus}
                </p>
                <p>
                  <strong>Gender:</strong> {viewStudent.gender}
                </p>
              </div>
              <button
                className="close-btn"
                onClick={() => setViewStudent(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
