import { useContext } from "react";
import {
  FiUser,
  FiHash,
  FiBook,
  FiMail,
  FiPhone,
  FiMapPin,
  FiUploadCloud,
} from "react-icons/fi";
import { CourseContext } from "../context/CourseContext";
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
  } = useContext(CourseContext);

  return (
    <div className="register-page">
      <Header />

      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1>Student Registration</h1>
            <p>Jaza fomu hii kwa usahihi ili kujiunga na TIAMSA</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <h3 className="form-section-title">
              <FiUser /> Personal Information
            </h3>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="f_name"
                  value={formData.f_name}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label>First Name</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="m_name"
                  value={formData.m_name}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label>Middle Name</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="l_name"
                  value={formData.l_name}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label>Last Name</label>
              </div>
            </div>

            <h3 className="form-section-title">
              <FiBook /> Academic Details
            </h3>
            <div className="form-row">
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
              <div className="form-group">
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                >
                  <option value=""></option>
                  <option value="certificate">Certificate</option>
                  <option value="diploma">Diploma</option>
                  <option value="degree">Degree</option>
                  <option value="masters">Masters</option>
                </select>
                <label>Level</label>
              </div>
            </div>

            <div className="form-group full-width">
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
              >
                <option value=""></option>
                {filteredCourses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <label>Course</label>
            </div>

            <h3 className="form-section-title">
              <FiMail /> Contact & Others
            </h3>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label>Email Address</label>
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10)
                      setFormData({ ...formData, phone: value });
                  }}
                  required
                  placeholder=" "
                />
                <label>Phone (e.g 0712...)</label>
              </div>
            </div>

            <div className="form-row">
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
                  <option value=""></option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <label>Gender</label>
              </div>
            </div>

            <div className="file-upload-group">
              <label className="file-label">
                <FiUploadCloud />
                <span>
                  {formData.studentID
                    ? "File Selected"
                    : "Upload Student ID (Image/PDF)"}
                </span>
                <input
                  type="file"
                  name="studentID"
                  accept="image/*,application/pdf"
                  onChange={handleFile}
                  required
                />
              </label>
            </div>

            <button type="submit" className="submit-btn">
              Complete Registration
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
