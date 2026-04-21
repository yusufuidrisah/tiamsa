import React, { useState, useContext, useEffect, useMemo } from "react";
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
  FiChevronLeft,
  FiChevronRight,
  FiCheckSquare,
  FiDownload,
  FiFilter,
  FiSliders,
  FiUser,
  FiBookOpen,
  FiInfo,
} from "react-icons/fi";
import "../styles/Student-list.css";

export default function StudentsManagement() {
  const {
    students,
    updateStatus,
    deleteStudent,
    bulkUpdateStatus,
    bulkDeleteStudents,
    getGraduaters,
    handleRegister,
    courseOptions,
  } = useContext(CourseContext);

  const [mainFilter, setMainFilter] = useState("pending");
  const [levelFilter, setLevelFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewStudent, setViewStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "f_name",
    direction: "asc",
  });
  const [tableDensity, setTableDensity] = useState("comfortable");
  const [activeProfileTab, setActiveProfileTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [editErrors, setEditErrors] = useState({});
  const [courseFilter, setCourseFilter] = useState("");
  const [campusFilter, setCampusFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const studentsPerPage = 5;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
  });

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

  if (courseFilter) {
    displayData = displayData.filter((student) => student.course === courseFilter);
  }

  if (campusFilter) {
    displayData = displayData.filter((student) => student.campus === campusFilter);
  }

  if (genderFilter) {
    displayData = displayData.filter((student) => student.gender === genderFilter);
  }

  const advancedOptions = useMemo(
    () => ({
      courses: [...new Set(students.map((student) => student.course).filter(Boolean))],
      campuses: [...new Set(students.map((student) => student.campus).filter(Boolean))],
      genders: ["male", "female"],
    }),
    [students],
  );

  displayData = [...displayData].sort((a, b) => {
    const first = String(a[sortConfig.key] ?? "").toLowerCase();
    const second = String(b[sortConfig.key] ?? "").toLowerCase();
    if (first < second) return sortConfig.direction === "asc" ? -1 : 1;
    if (first > second) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    setCurrentPage(1);
    setSelectedStudents([]);
  }, [mainFilter, levelFilter, searchTerm, courseFilter, campusFilter, genderFilter]);

  const totalPages = Math.max(1, Math.ceil(displayData.length / studentsPerPage));
  const startIndex = (currentPage - 1) * studentsPerPage;
  const paginatedStudents = displayData.slice(
    startIndex,
    startIndex + studentsPerPage,
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const renderHighlightedText = (text, query) => {
    const value = String(text ?? "");
    const term = query.trim();

    if (!term) return value;

    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = value.split(new RegExp(`(${escaped})`, "gi"));

    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={`${part}-${index}`} className="search-highlight">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditErrors((prev) => ({ ...prev, [name]: "" }));
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

  const handleImageEdit = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditStudent((prev) => ({
        ...prev,
        studentID: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const validateEditForm = () => {
    const nextErrors = {};
    if (!editStudent?.f_name?.trim()) nextErrors.f_name = "First name is required.";
    if (!editStudent?.l_name?.trim()) nextErrors.l_name = "Last name is required.";
    if (!editStudent?.gender) nextErrors.gender = "Select a gender.";
    if (!editStudent?.level) nextErrors.level = "Select a study level.";
    if (!editStudent?.course) nextErrors.course = "Select a course.";
    if (!editStudent?.campus?.trim()) nextErrors.campus = "Campus is required.";
    if (!editStudent?.email?.trim()) nextErrors.email = "Email is required.";
    if (!editStudent?.phone?.trim()) nextErrors.phone = "Phone is required.";
    setEditErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!validateEditForm()) return;
    handleRegister(editStudent, true);
    const studentName = `${editStudent.f_name} ${editStudent.l_name}`;
    setEditStudent(null);
    await toast.fire({
      title: "Updated",
      text: `${studentName} has been updated successfully.`,
      icon: "success",
    });
  };

  const getInitials = (student) =>
    `${student?.f_name?.[0] || ""}${student?.l_name?.[0] || ""}`.toUpperCase();

  const toggleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const toggleStudentSelection = (regNo) => {
    setSelectedStudents((current) =>
      current.includes(regNo)
        ? current.filter((item) => item !== regNo)
        : [...current, regNo],
    );
  };

  const toggleSelectAllVisible = () => {
    const pageRegNos = paginatedStudents.map((student) => student.regNo);
    const allSelected = pageRegNos.every((regNo) => selectedStudents.includes(regNo));

    setSelectedStudents((current) =>
      allSelected
        ? current.filter((regNo) => !pageRegNos.includes(regNo))
        : [...new Set([...current, ...pageRegNos])],
    );
  };

  const exportSelectedStudents = () => {
    if (selectedStudents.length === 0) return;

    const rows = students.filter((student) => selectedStudents.includes(student.regNo));
    const csv = [
      ["RegNo", "First Name", "Last Name", "Course", "Campus", "Gender", "Status"].join(","),
      ...rows.map((student) =>
        [
          student.regNo,
          student.f_name,
          student.l_name,
          `"${student.course || ""}"`,
          `"${student.campus || ""}"`,
          student.gender || "",
          student.status || "",
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "selected-students.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBulkApprove = async () => {
    if (selectedStudents.length === 0) return;
    await bulkUpdateStatus(selectedStudents, "registered");
    setSelectedStudents([]);
  };

  const handleBulkDelete = async () => {
    if (selectedStudents.length === 0) return;
    const deleted = await bulkDeleteStudents(selectedStudents);
    if (deleted) setSelectedStudents([]);
  };

  if (loading) {
    return (
      <div className="students-container">
        <div className="students-skeleton hero"></div>
        <div className="students-skeleton toolbar"></div>
        <div className="students-skeleton table"></div>
      </div>
    );
  }

  return (
    <div className="students-container">
      {/* HEADER SECTION */}
      <div className="management-header">
        <div>
          <h2>Student Management System</h2>
          <p className="header-copy">
            Review records quickly, approve pending students, and manage details
            with a layout that works well on mobile too.
          </p>
        </div>
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

      <div className="advanced-filter-panel">
        <div className="advanced-filter-head">
          <strong>
            <FiFilter /> Advanced Filters
          </strong>
          <div className="density-switch">
            <button
              type="button"
              className={tableDensity === "compact" ? "active" : ""}
              onClick={() => setTableDensity("compact")}
            >
              Compact
            </button>
            <button
              type="button"
              className={tableDensity === "comfortable" ? "active" : ""}
              onClick={() => setTableDensity("comfortable")}
            >
              Comfortable
            </button>
          </div>
        </div>

        <div className="filter-chip-row">
          <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
            <option value="">All Courses</option>
            {advancedOptions.courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
          <select value={campusFilter} onChange={(e) => setCampusFilter(e.target.value)}>
            <option value="">All Campuses</option>
            {advancedOptions.campuses.map((campus) => (
              <option key={campus} value={campus}>
                {campus}
              </option>
            ))}
          </select>
          <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
            <option value="">All Genders</option>
            {advancedOptions.genders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="students-results-bar">
        <div>
          <strong>
            {displayData.length} student{displayData.length === 1 ? "" : "s"}
          </strong>{" "}
          found in {mainFilter === "graduates" ? "graduated" : mainFilter}
          {levelFilter ? ` / ${levelFilter}` : ""}
        </div>
        <div className="results-page-indicator">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {selectedStudents.length > 0 && (
        <div className="bulk-action-bar">
          <div>
            <strong>{selectedStudents.length}</strong> selected
          </div>
          <div className="bulk-action-buttons">
            {mainFilter === "pending" && (
              <button type="button" onClick={handleBulkApprove}>
                <FiCheckSquare /> Approve Selected
              </button>
            )}
            <button type="button" onClick={exportSelectedStudents}>
              <FiDownload /> Export Selected
            </button>
            <button type="button" className="danger" onClick={handleBulkDelete}>
              <FiTrash2 /> Delete Selected
            </button>
          </div>
        </div>
      )}

      <div className="table-wrapper desktop-students-view">
        <table className={`students-table density-${tableDensity}`}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    paginatedStudents.length > 0 &&
                    paginatedStudents.every((student) =>
                      selectedStudents.includes(student.regNo),
                    )
                  }
                  onChange={toggleSelectAllVisible}
                />
              </th>
              <th>
                <button type="button" className="sort-btn" onClick={() => toggleSort("f_name")}>
                  Student Identity <FiSliders />
                </button>
              </th>
              <th>
                <button type="button" className="sort-btn" onClick={() => toggleSort("regNo")}>
                  Reg Number <FiSliders />
                </button>
              </th>
              <th>
                <button type="button" className="sort-btn" onClick={() => toggleSort("gender")}>
                  Gender <FiSliders />
                </button>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((st) => (
                <tr key={st.regNo}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(st.regNo)}
                      onChange={() => toggleStudentSelection(st.regNo)}
                    />
                  </td>
                  <td className="name-cell">
                    {st.studentID ? (
                      <img src={st.studentID} className="table-img" alt="" />
                    ) : (
                      <div className="table-avatar-fallback">{getInitials(st)}</div>
                    )}
                    <div className="student-info-cell">
                      <span className="full-name">
                        {renderHighlightedText(
                          `${st.f_name} ${st.l_name}`,
                          searchTerm,
                        )}
                      </span>
                      <span className="sub-text">{st.course}</span>
                    </div>
                  </td>
                  <td>
                    <span className="reg-badge">
                      {renderHighlightedText(st.regNo, searchTerm)}
                    </span>
                  </td>
                  <td>
                    <span className={`gender-pill ${st.gender}`}>
                      {st.gender || "N/A"}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="action-btn action-btn-wide view"
                      onClick={() => setViewStudent(st)}
                      aria-label={`View ${st.f_name} ${st.l_name}`}
                    >
                      <FiEye /> <span>View</span>
                    </button>
                    <button
                      className="action-btn action-btn-wide edit"
                      onClick={() => setEditStudent({ ...st })}
                      aria-label={`Edit ${st.f_name} ${st.l_name}`}
                    >
                      <FiEdit2 /> <span>Edit</span>
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() =>
                        deleteStudent(st.regNo, `${st.f_name} ${st.l_name}`)
                      }
                      aria-label={`Delete ${st.f_name} ${st.l_name}`}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="students-empty-cell"
                >
                  <div className="students-empty-state">
                    <strong>No students found</strong>
                    <p>
                      Try changing the filter or search keyword to see matching
                      student records.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {displayData.length > 0 && (
        <div className="pagination-bar">
          <button
            type="button"
            className="pagination-btn"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            <FiChevronLeft /> Previous
          </button>

          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  className={`pagination-number ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <button
            type="button"
            className="pagination-btn"
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next <FiChevronRight />
          </button>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewStudent && (
        <div className="overlay" onClick={() => setViewStudent(null)}>
          <div
            className="student-modal modern-view"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-accent"></div>
            <div className="modal-body">
              <div className="modal-identity-row">
                <div className="modal-profile-block">
                  {viewStudent.studentID ? (
                    <img
                      src={viewStudent.studentID}
                      className="modal-profile-img"
                      alt="ID"
                    />
                  ) : (
                    <div className="modal-avatar-fallback">
                      {getInitials(viewStudent)}
                    </div>
                  )}
                </div>

                <div className="modal-identity-copy">
                  <div className="modal-kicker">Student Profile</div>
                  <h3>
                    {viewStudent.f_name} {viewStudent.m_name} {viewStudent.l_name}
                  </h3>
                  <p className="modal-subtitle">{viewStudent.course}</p>
                  <div className="modal-quick-meta">
                    <span className="reg-badge">{viewStudent.regNo}</span>
                    <span className={`gender-pill ${viewStudent.gender}`}>
                      {viewStudent.gender}
                    </span>
                    <span className={`status-pill ${viewStudent.status}`}>
                      {viewStudent.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="profile-tabs">
                <button
                  type="button"
                  className={activeProfileTab === "personal" ? "active" : ""}
                  onClick={() => setActiveProfileTab("personal")}
                >
                  <FiUser /> Personal
                </button>
                <button
                  type="button"
                  className={activeProfileTab === "academic" ? "active" : ""}
                  onClick={() => setActiveProfileTab("academic")}
                >
                  <FiBookOpen /> Academic
                </button>
                <button
                  type="button"
                  className={activeProfileTab === "contacts" ? "active" : ""}
                  onClick={() => setActiveProfileTab("contacts")}
                >
                  <FiInfo /> Contacts
                </button>
              </div>

              <div className="view-sections-grid">
                {activeProfileTab === "personal" && (
                  <section className="view-section-card">
                    <h4>Personal Details</h4>
                    <div className="info-grid-modern">
                      <div className="info-item">
                        <strong>First Name</strong>
                        <span>{viewStudent.f_name}</span>
                      </div>
                      <div className="info-item">
                        <strong>Middle Name</strong>
                        <span>{viewStudent.m_name || "N/A"}</span>
                      </div>
                      <div className="info-item">
                        <strong>Last Name</strong>
                        <span>{viewStudent.l_name}</span>
                      </div>
                    </div>
                  </section>
                )}
                {activeProfileTab === "academic" && (
                  <section className="view-section-card">
                  <h4>Academic Details</h4>
                  <div className="info-grid-modern">
                    <div className="info-item">
                      <strong>Campus</strong>
                      <span>{viewStudent.campus}</span>
                    </div>
                    <div className="info-item">
                      <strong>Level</strong>
                      <span>{viewStudent.level}</span>
                    </div>
                    <div className="info-item">
                      <strong>Year</strong>
                      <span>{viewStudent.year || "1"}</span>
                    </div>
                  </div>
                  </section>
                )}

                {activeProfileTab === "contacts" && (
                  <section className="view-section-card">
                  <h4>Contact Information</h4>
                  <div className="info-grid-modern compact">
                    <div className="info-item full">
                      <strong>
                        <FiMail /> Email
                      </strong>
                      <span>{viewStudent.email}</span>
                    </div>
                    <div className="info-item full">
                      <strong>
                        <FiPhone /> Phone
                      </strong>
                      <span>{viewStudent.phone}</span>
                    </div>
                  </div>
                  </section>
                )}
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
              <div>
                <h3>Update Student Profile</h3>
                <p className="edit-card-subtitle">
                  Edit the student details in a compact form.
                </p>
              </div>
              <button className="close-x" onClick={() => setEditStudent(null)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={saveEdit} className="edit-card-body">
              <div className="student-image-edit-row">
                <div className="student-image-preview-wrap">
                  <img
                    src={
                      editStudent.studentID || "https://via.placeholder.com/140"
                    }
                    className="student-image-preview"
                    alt="Student preview"
                  />
                </div>
                <div className="student-image-edit-copy">
                  <label className="image-upload-label" htmlFor="student-image">
                    Update Student Image
                  </label>
                  <p className="image-upload-help">
                    Upload a clear passport-size image or ID photo for this
                    student profile.
                  </p>
                  <input
                    id="student-image"
                    type="file"
                    accept="image/*"
                    className="student-image-input"
                    onChange={handleImageEdit}
                  />
                </div>
              </div>

              <div className="form-section-row">
                <div className="input-field">
                  <label>First Name</label>
                  <input
                    name="f_name"
                    value={editStudent.f_name}
                    onChange={handleEditChange}
                    required
                  />
                  {editErrors.f_name && <small className="field-error">{editErrors.f_name}</small>}
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
                  {editErrors.l_name && <small className="field-error">{editErrors.l_name}</small>}
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
                  {editErrors.gender && <small className="field-error">{editErrors.gender}</small>}
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
                  {editErrors.level && <small className="field-error">{editErrors.level}</small>}
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
                  {editErrors.campus && <small className="field-error">{editErrors.campus}</small>}
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
                {editErrors.course && <small className="field-error">{editErrors.course}</small>}
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
                  {editErrors.email && <small className="field-error">{editErrors.email}</small>}
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
                  {editErrors.phone && <small className="field-error">{editErrors.phone}</small>}
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
