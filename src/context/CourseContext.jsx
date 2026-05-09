import { createContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { studentsApi } from "../services/api";

export const CourseContext = createContext();

export function CourseProvider({ children }) {
  const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
  });

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
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await studentsApi.list();
      setStudents(data);
    } catch (error) {
      console.error("Failed to load students:", error);
    }
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

  const handleRegister = async (data, isStaff = false) => {
    try {
      const exists = students.find((s) => s.regNo === data.regNo);

      if (exists) {
        await studentsApi.update(data.regNo, { ...data, status: exists.status });
        resetForm();
        await loadStudents();
        return true;
      }

      await studentsApi.create({
        ...data,
        status: isStaff ? "registered" : "pending",
      });
      resetForm();
      await loadStudents();
      return true;
    } catch (error) {
      await Swal.fire({
        title: "Server connection problem",
        text: error.message || "Could not save student data.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      return false;
    }
  };

  const updateStatus = async (
    regNo,
    newStatus,
    studentName = "Student",
  ) => {
    try {
      await studentsApi.updateStatus(regNo, newStatus);
      await loadStudents();

      if (newStatus === "registered") {
        await toast.fire({
          title: "Approved",
          text: `${studentName} has been approved successfully.`,
          icon: "success",
        });
      }
    } catch (error) {
      await Swal.fire({
        title: "Server connection problem",
        text: error.message || "Could not update student status.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const deleteStudent = async (regNo, studentName = regNo) => {
    const result = await Swal.fire({
      title: "Delete student record?",
      text: `${studentName} will be removed from the system. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete student",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#94a3b8",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await studentsApi.remove(regNo);
        await loadStudents();
        await toast.fire({
          title: "Deleted",
          text: `${studentName} has been removed successfully.`,
          icon: "success",
        });
      } catch (error) {
        await Swal.fire({
          title: "Server connection problem",
          text: error.message || "Could not delete student data.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  const bulkUpdateStatus = async (regNos, newStatus) => {
    try {
      await studentsApi.bulkUpdateStatus(regNos, newStatus);
      await loadStudents();
      await toast.fire({
        title: "Updated",
        text: `${regNos.length} student records were updated.`,
        icon: "success",
      });
    } catch (error) {
      await Swal.fire({
        title: "Server connection problem",
        text: error.message || "Could not update student records.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const bulkDeleteStudents = async (regNos) => {
    const result = await Swal.fire({
      title: "Delete selected students?",
      text: `${regNos.length} student records will be removed from the system.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete selected",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#94a3b8",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await studentsApi.bulkDelete(regNos);
        await loadStudents();
        await toast.fire({
          title: "Deleted",
          text: `${regNos.length} student records were removed.`,
          icon: "success",
        });
        return true;
      } catch (error) {
        await Swal.fire({
          title: "Server connection problem",
          text: error.message || "Could not delete student records.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    }

    return false;
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
        bulkUpdateStatus,
        bulkDeleteStudents,
        getGraduaters,
        courseOptions,
        resetForm,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}
