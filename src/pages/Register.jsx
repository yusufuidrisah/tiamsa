import { useContext } from "react";
import Swal from "sweetalert2";
import { FiUser, FiBook, FiMail, FiUploadCloud } from "react-icons/fi";
import { CourseContext } from "../context/CourseContext";
import Header from "../components/Header";
import "../styles/register.css";

export default function Register() {
  const { formData, setFormData, handleRegister, courseOptions, students } =
    useContext(CourseContext);

  const filteredCourses = formData.level ? courseOptions[formData.level] : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, studentID: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleLocalSubmit = (e) => {
    e.preventDefault();

    const isRegNoTaken = students.some(
      (s) => s.regNo.toLowerCase() === formData.regNo.toLowerCase(),
    );

    if (isRegNoTaken) {
      Swal.fire({
        title: "Kosa!",
        text: `Samahani, Namba ya usajili (${formData.regNo}) imeshatumika tayari!`,
        icon: "error",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const success = handleRegister(formData, false);

    if (success) {
      Swal.fire({
        title: "Usajili Umekamilika!",
        text: "Maombi yako yametumwa kikamilifu. Subiri Admin ayathibitishe.",
        icon: "success",
        confirmButtonText: "Sawa",
        confirmButtonColor: "#198754",
      });
    }
  };

  return (
    <div className="register-page">
      <Header />
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1>Student Registration</h1>
            <p>
              Jaza fomu hii kwa usahihi ili kujiunga na TIAMSA (Pending
              Approval)
            </p>
          </div>

          <form className="register-form" onSubmit={handleLocalSubmit}>
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

            <div className="form-row">
              {/* --- GENDER SELECTION */}
              <div className="form-group">
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  required
                >
                  <option value=""></option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <label>Gender</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="campus"
                  value={formData.campus || ""}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label>Campus</label>
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

            {(formData.level === "diploma" || formData.level === "degree") && (
              <div className="form-group full-width">
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                >
                  <option value=""></option>
                  <option value="1">First Year</option>
                  <option value="2">Second Year</option>
                  {formData.level === "degree" && (
                    <option value="3">Third Year</option>
                  )}
                </select>
                <label>Study Year</label>
              </div>
            )}

            <h3 className="form-section-title">
              <FiMail /> Contact Details
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
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label>Phone Number</label>
              </div>
            </div>

            <div className="file-upload-group">
              <label className="file-label">
                <FiUploadCloud />
                <span>
                  {formData.studentID
                    ? " Photo Uploaded"
                    : "Upload Student Photo (Official Passport size)"}
                </span>
                <input
                  type="file"
                  name="studentID"
                  accept="image/*"
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
