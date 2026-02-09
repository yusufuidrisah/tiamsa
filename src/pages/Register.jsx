import { useContext } from "react";
import { FiUser, FiBook, FiMail, FiUploadCloud } from "react-icons/fi";
import { CourseContext } from "../context/CourseContext";
import Header from "../components/Header";
import "../styles/register.css";

export default function Register() {
  const { formData, setFormData, handleChange, handleFile, filteredCourses } =
    useContext(CourseContext);

  // SAVE TO LOCAL STORAGE
  const handleLocalSubmit = (e) => {
    e.preventDefault();

    try {
      // 1. Pata data zilizopo tayari kwenye Local Storage (kama zipo)
      const existingStudents =
        JSON.parse(localStorage.getItem("tiamsa_students")) || [];

      // 2. Angalia kama RegNo tayari imeshasajiliwa
      const isRegistered = existingStudents.find(
        (student) => student.regNo === formData.regNo,
      );

      if (isRegistered) {
        alert("Hitilafu: Namba hii ya usajili (RegNo) tayari imeshatumika!");
        return;
      }

      // 3. Ongeza mwanafunzi mpya kwenye list
      const updatedStudents = [
        ...existingStudents,
        { ...formData, id: Date.now() },
      ];

      // 4. Hifadhi list mpya kwenye Local Storage
      localStorage.setItem("tiamsa_students", JSON.stringify(updatedStudents));

      alert(
        "Hongera! Usajili wako umekamilika na umehifadhiwa (Local Storage).",
      );

      // 5. Safisha fomu
      setFormData({
        f_name: "",
        m_name: "",
        l_name: "",
        regNo: "",
        level: "",
        course: "",
        email: "",
        phone: "",
        campus: "",
        gender: "",
        studentID: null,
      });
    } catch (error) {
      alert("Kuna tatizo lilitokea wakati wa kuhifadhi data.");
      console.error(error);
    }
  };

  return (
    <div className="register-page">
      <Header />

      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1>Student Registration</h1>
            <p>Jaza fomu hii kwa usahihi ili kujiunga na TIAMSA</p>
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
