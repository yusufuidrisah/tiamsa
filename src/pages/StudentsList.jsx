import React, { useState, useContext } from "react";
import { CourseContext } from "../context/CourseContext";
import Swal from "sweetalert2";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiSave,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import "../styles/Student-list.css";

export default function StudentsManagement() {
  const {
    students,
    updateStatus,
    deleteStudent,
    getGraduaters,
    handleRegister,
    courseOptions,
  } = useContext(CourseContext);

  const [mainFilter, setMainFilter] = useState("pending");
  const [levelFilter, setLevelFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewStudent, setViewStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);

  // LOGIC YA KUCHUJA
  let displayData =
    mainFilter === "graduates"
      ? getGraduaters(levelFilter)
      : students.filter(
          (s) =>
            s.status === mainFilter &&
            (levelFilter ? s.level === levelFilter : true),
        );

  if (searchTerm) {
    displayData = displayData.filter(
      (s) =>
        `${s.f_name} ${s.l_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        s.regNo.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "level") {
      setEditStudent({
        ...editStudent,
        level: value,
        year: value === "certificate" ? "1" : "",
      });
    } else {
      setEditStudent({ ...editStudent, [name]: value });
    }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    handleRegister(editStudent, true);
    const studentName = `${editStudent.f_name} ${editStudent.l_name}`;
    setEditStudent(null);
    await Swal.fire({
      title: "Updated",
      text: `${studentName} has been updated successfully.`,
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#115c3a",
    });
  };

  return (
    <div className="students-container">
      {/* HEADER SECTION */}
      <div className="management-header">
        <h2>Student Management System</h2>
        <div className="search-wrapper">
          <FiSearch className="search-icon-fixed" />
          <input
            type="text"
            className="modern-search"
            placeholder="Search name or RegNo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <FiX
              className="clear-search-icon"
              onClick={() => setSearchTerm("")}
            />
          )}
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="filter-tabs">
        <button
          className={mainFilter === "pending" ? "active" : ""}
          onClick={() => setMainFilter("pending")}
        >
          Pending
        </button>
        <button
          className={mainFilter === "registered" ? "active" : ""}
          onClick={() => setMainFilter("registered")}
        >
          Registered
        </button>
        <button
          className={mainFilter === "graduates" ? "active" : ""}
          onClick={() => setMainFilter("graduates")}
        >
          Graduates
        </button>

        <select
          className="level-select-modern"
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
        >
          <option value="">All Levels</option>
          <option value="certificate">Certificate</option>
          <option value="diploma">Diploma</option>
          <option value="degree">Bachelor Degree</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="students-table">
          <thead>
            <tr>
              <th>Student Identity</th>
              <th>Reg Number</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayData.length > 0 ? (
              displayData.map((st) => (
                <tr key={st.regNo}>
                  <td className="name-cell">
                    <img
                      src={st.studentID || "https://via.placeholder.com/40"}
                      className="table-img"
                      alt=""
                    />
                    <div className="student-info-cell">
                      <span className="full-name">
                        {st.f_name} {st.l_name}
                      </span>
                      <span className="sub-text">{st.course}</span>
                    </div>
                  </td>
                  <td>
                    <span className="reg-badge">{st.regNo}</span>
                  </td>
                  <td>
                    <span className={`gender-pill ${st.gender}`}>
                      {st.gender || "N/A"}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="action-btn view"
                      onClick={() => setViewStudent(st)}
                    >
                      <FiEye />
                    </button>
                    <button
                      className="action-btn edit"
                      onClick={() => setEditStudent({ ...st })}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() =>
                        deleteStudent(st.regNo, `${st.f_name} ${st.l_name}`)
                      }
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Hakuna data iliyopatikana.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {viewStudent && (
        <div className="overlay" onClick={() => setViewStudent(null)}>
          <div
            className="student-modal modern-view"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-accent"></div>
            <div className="modal-body">
              <img
                src={viewStudent.studentID}
                className="modal-profile-img"
                alt="ID"
              />
              <h3>
                {viewStudent.f_name} {viewStudent.l_name}
              </h3>
              <p className="modal-subtitle">{viewStudent.course}</p>

              <div className="info-grid-modern">
                <div className="info-item">
                  <strong>Reg No:</strong> <span>{viewStudent.regNo}</span>
                </div>
                <div className="info-item">
                  <strong>Gender:</strong>
                  <span className={`gender-text ${viewStudent.gender}`}>
                    {viewStudent.gender}
                  </span>
                </div>
                <div className="info-item">
                  <strong>Level:</strong> <span>{viewStudent.level}</span>
                </div>
                <div className="info-item">
                  <strong>Year:</strong> <span>{viewStudent.year || "1"}</span>
                </div>
                <div className="info-item">
                  <strong>Campus:</strong> <span>{viewStudent.campus}</span>
                </div>
                <div className="info-item full">
                  <strong>
                    <FiMail /> Email:
                  </strong>{" "}
                  <span>{viewStudent.email}</span>
                </div>
                <div className="info-item full">
                  <strong>
                    <FiPhone /> Phone:
                  </strong>{" "}
                  <span>{viewStudent.phone}</span>
                </div>
              </div>

              <div className="modal-footer-btns">
                <button
                  className="btn-close"
                  onClick={() => setViewStudent(null)}
                >
                  Close
                </button>
                {viewStudent.status === "pending" && (
                  <button
                    className="btn-approve"
                    onClick={async () => {
                      await updateStatus(
                        viewStudent.regNo,
                        "registered",
                        `${viewStudent.f_name} ${viewStudent.l_name}`,
                      );
                      setViewStudent(null);
                    }}
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editStudent && (
        <div className="overlay">
          <div
            className="modern-edit-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="edit-card-header">
              <h3>Update Student Profile</h3>
              <button className="close-x" onClick={() => setEditStudent(null)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={saveEdit} className="edit-card-body">
              <div className="form-section-row">
                <div className="input-field">
                  <label>First Name</label>
                  <input
                    name="f_name"
                    value={editStudent.f_name}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="input-field">
                  <label>Middle Name</label>
                  <input
                    name="m_name"
                    value={editStudent.m_name}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="input-field">
                  <label>Last Name</label>
                  <input
                    name="l_name"
                    value={editStudent.l_name}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div className="form-section-row">
                <div className="input-field">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={editStudent.gender}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="input-field">
                  <label>Level</label>
                  <select
                    name="level"
                    value={editStudent.level}
                    onChange={handleEditChange}
                  >
                    <option value=""> Select level </option>
                    <option value="certificate">Certificate</option>
                    <option value="diploma">Diploma</option>
                    <option value="degree">Bachelor Degree</option>
                  </select>
                </div>
              </div>

              <div className="form-section-row">
                <div className="input-field">
                  <label>Year of Study</label>
                  {editStudent.level === "certificate" ? (
                    <input value="Year 1 Only" readOnly className="read-only" />
                  ) : (
                    <select
                      name="year"
                      value={editStudent.year}
                      onChange={handleEditChange}
                      required
                    >
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      {editStudent.level === "degree" && (
                        <option value="3">Year 3</option>
                      )}
                    </select>
                  )}
                </div>
                <div className="input-field">
                  <label>Campus</label>
                  <input
                    name="campus"
                    value={editStudent.campus}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div className="input-field full">
                <label>Course</label>
                <select
                  name="course"
                  value={editStudent.course || ""}
                  onChange={handleEditChange}
                  required
                >
                  <option value=""> Select Course </option>

                  {editStudent.level &&
                    courseOptions[editStudent.level]?.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-section-row">
                <div className="input-field">
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    value={editStudent.email}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="input-field">
                  <label>Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    value={editStudent.phone}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div className="edit-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setEditStudent(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  <FiSave /> Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
