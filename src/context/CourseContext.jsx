import { createContext, useState, useEffect } from "react";

export const CourseContext = createContext();

export function CourseProvider({ children }) {
  const courseOptions = {
    certificate: [
      "Basic Technician Certificate in Accountancy (BTCA)",
      "Basic Technician Certificate in Procurement and Logistics Management (BTCPLM)",
      "Basic Technician Certificate in Business Administration (BTCBA)",
      "Basic Technician Certificate in Human Resource Management (BTCHRM)",
      "Basic Technician Certificate in Marketing and Public Relations (BTCMPR)",
      "Basic Technician Certificate in Public Sector Accounting and Finance (BTCPSAF)",
    ],
    diploma: [
      "Ordinary Diploma in Accountancy (DA)",
      "Ordinary Diploma in Procurement and Logistics Management (DPLM)",
      "Ordinary Diploma in Business Administration (DBA)",
      "Ordinary Diploma in Human Resource Management (DHRM)",
      "Ordinary Diploma in Marketing and Public Relations (DMPR)",
      "Ordinary Diploma in Public Sector Accounting and Finance (DPSAF)",
    ],
    degree: [
      "Bachelor Degree in Accounting (BAC)",
      "Bachelor Degree in Procurement and Logistics Management (BPLM)",
      "Bachelor Degree in Business Administration (BBA)",
      "Bachelor Degree in Human Resource Management (BHRM)",
      "Bachelor Degree in Marketing and Public Relations (BMPR)",
      "Bachelor Degree in Public Sector Accounting and Finance (BPSAF)",
    ],
  };

  const [formData, setFormData] = useState({
    f_name: "",
    m_name: "",
    l_name: "",
    regNo: "",
    level: "",
    course: "",
    year: "",
    email: "",
    phone: "",
    campus: "Dar es Salaam",
    gender: "",
    studentID: null,
  });

  const [students, setStudents] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("tiamsa_students")) || [];
    setStudents(data);
  }, []);

  const saveToLS = (updatedList) => {
    setStudents(updatedList);
    localStorage.setItem("tiamsa_students", JSON.stringify(updatedList));
  };

  const resetForm = () => {
    setFormData({
      f_name: "",
      m_name: "",
      l_name: "",
      regNo: "",
      level: "",
      course: "",
      year: "",
      email: "",
      phone: "",
      campus: "Dar es Salaam",
      gender: "",
      studentID: null,
    });
  };

  const handleRegister = (data, isStaff = false) => {
    const exists = students.find((s) => s.regNo === data.regNo);

    if (exists) {
      // Logic ya UPDATE (Edit)
      const updatedList = students.map((s) =>
        s.regNo === data.regNo ? { ...data, status: s.status } : s,
      );
      saveToLS(updatedList);
      //alert("Taarifa zimebadilishwa kikamilifu!");
    } else {
      // Logic ya NEW registration
      const newStudent = {
        ...data,
        id: Date.now(),
        status: isStaff ? "registered" : "pending",
      };
      saveToLS([...students, newStudent]);
      //alert("Usajili umekamilika!");
    }
    resetForm();
    return true;
  };

  const updateStatus = (regNo, newStatus) => {
    const updated = students.map((s) =>
      s.regNo === regNo ? { ...s, status: newStatus } : s,
    );
    saveToLS(updated);
  };

  const deleteStudent = (regNo) => {
    if (window.confirm("Futa mwanafunzi huyu?")) {
      saveToLS(students.filter((s) => s.regNo !== regNo));
    }
  };

  const getGraduaters = (levelFilter) => {
    return students
      .filter((s) => {
        // Logic: Mwanafunzi ni graduater kama yuko mwaka wa mwisho wa level yake
        const isYear1 = s.year === "1";
        const isYear2 = s.year === "2";
        const isYear3 = s.year === "3";

        const isGrad =
          (s.level === "certificate" && isYear1) ||
          (s.level === "diploma" && isYear2) ||
          (s.level === "degree" && isYear3);

        return levelFilter ? isGrad && s.level === levelFilter : isGrad;
      })
      .filter((s) => s.status === "registered"); // Lazima awe ameshakuwa approved
  };

  return (
    <CourseContext.Provider
      value={{
        students,
        formData,
        setFormData,
        handleRegister,
        updateStatus,
        deleteStudent,
        getGraduaters,
        courseOptions,
        resetForm,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}
