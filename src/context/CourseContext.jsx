import { createContext, useState, useEffect } from "react";

export const CourseContext = createContext();

export function CourseProvider({ children }) {
  const [formData, setFormData] = useState({
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

  const courseOptions = {
    certificate: [
      "Basic Technician Certificate in Accountancy (BTCA)",
      "Basic Technician Certificate in Procurement and Logistics Management (BTCPLM)",
      "Basic Technician Certificate in Business Administration (BTCBA)",
      "Basic Technician Certificate in Human Resource Management (BTCHRM)",
      "Basic Technician Certificate in Marketing and Public Relations(BTCMPR)",
      "Basic Technician Certificate in Public Sector Accounting and Finance (BTCPSAF)",
    ],
    diploma: ["DIT", "DBA", "Procurement"],
    degree: [
      "Bachelor Degree in Accounting (BAC)",
      "Bachelor Degree in Procurement and Logistics Management (BPLM)",
      "Bachelor Degree in Business Administration (BBA)",
      "Bachelor Degree in Human Resource Management (BHRM)",
      "Bachelor Degree in Marketing and Public Relations (BMPR)",
      "Bachelor Degree in Public Sector Accounting and Finance (BPSAF)",
    ],
    masters: [
      "Master of Science Degree in Accounting and Finance (MSc. ACC & FIN)",
      "Master of Science in Procurement & Supply Management (MSc. PSM)",
      "Master of Business Administration in Project Management (MBA PM)",
      "Master in Human Resource Management with Information Technology [MHRM-IT]",
      "Master of Science in Marketing and Public Relations [MSC MPR]",
    ],
  };

  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    if (formData.level) {
      setFilteredCourses(courseOptions[formData.level]);
    } else {
      setFilteredCourses([]);
    }
  }, [formData.level]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, studentID: file });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save student to localStorage
    let all = JSON.parse(localStorage.getItem("students")) || [];
    all.push({ id: Date.now(), ...formData });
    localStorage.setItem("students", JSON.stringify(all));

    // Reset form
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

    // Show alert
    alert("Registration Successful!");

    // Redirect to students list
  };

  return (
    <CourseContext.Provider
      value={{
        formData,
        setFormData,
        handleChange,
        handleFile,
        handleSubmit,
        filteredCourses,
        setFilteredCourses,
        courseOptions,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}
