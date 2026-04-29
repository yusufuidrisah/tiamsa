import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  FiDownload,
  FiPrinter,
  FiSearch,
  FiShield,
} from "react-icons/fi";
import { CourseContext } from "../context/CourseContext";
import logoimage from "../assets/logo.png";
import "../styles/CertificatePrinting.css";

const formatDisplayDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export default function CertificatePrinting() {
  const { getGraduaters } = useContext(CourseContext);
  const graduates = useMemo(() => getGraduaters(), [getGraduaters]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegNo, setSelectedRegNo] = useState("");
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const filteredGraduates = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return graduates;

    return graduates.filter((student) => {
      const name = `${student.f_name} ${student.m_name || ""} ${student.l_name}`
        .toLowerCase()
        .trim();
      return (
        name.includes(query) ||
        student.regNo.toLowerCase().includes(query) ||
        String(student.course || "").toLowerCase().includes(query)
      );
    });
  }, [graduates, searchTerm]);

  useEffect(() => {
    if (!filteredGraduates.length) {
      setSelectedRegNo("");
      return;
    }

    const stillExists = filteredGraduates.some(
      (student) => student.regNo === selectedRegNo,
    );

    if (!stillExists) {
      setSelectedRegNo(filteredGraduates[0].regNo);
    }
  }, [filteredGraduates, selectedRegNo]);

  const selectedStudent =
    filteredGraduates.find((student) => student.regNo === selectedRegNo) ||
    graduates.find((student) => student.regNo === selectedRegNo) ||
    null;

  const certificateNumber = selectedStudent
    ? `TIAMSA-GRAD-${selectedStudent.regNo}-${new Date(issueDate).getFullYear()}`
    : "";

  const handlePrint = () => {
    if (!selectedStudent) return;
    window.print();
  };

  return (
    <div className="certificate-page">
      <section className="certificate-preview-shell single-page-layout">
        <div className="certificate-toolbar single-page-toolbar">
          <div>
            <span className="certificate-toolbar-label">Certificate Printing</span>
            <h2>Graduate Certificate</h2>
          </div>

          <button
            type="button"
            className="certificate-print-btn"
            onClick={handlePrint}
            disabled={!selectedStudent}
          >
            <FiPrinter /> Print Certificate
          </button>
        </div>

        <div className="certificate-controls-grid">
          <div className="certificate-search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search by name, RegNo or course"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <label className="certificate-date-field">
            <span>Issue Date</span>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </label>

          <label className="certificate-select-field">
            <span>Select Graduate</span>
            <select
              value={selectedRegNo}
              onChange={(e) => setSelectedRegNo(e.target.value)}
            >
              {filteredGraduates.length === 0 ? (
                <option value="">No graduates found</option>
              ) : (
                filteredGraduates.map((student) => (
                  <option key={student.regNo} value={student.regNo}>
                    {student.f_name} {student.l_name} - {student.regNo}
                  </option>
                ))
              )}
            </select>
          </label>
        </div>

        <div className="certificate-summary-row">
          <span>{graduates.length} eligible graduates</span>
          <span>{filteredGraduates.length} matching result(s)</span>
          <span>{certificateNumber || "Certificate number will appear here"}</span>
        </div>

        <div className="certificate-preview-area">
          {selectedStudent ? (
            <article className="certificate-sheet" id="certificate-sheet">
              <div className="certificate-sheet-border"></div>
              <div className="certificate-sheet-inner">
                <div className="certificate-brand-row">
                  <img src={logoimage} alt="TIAMSA logo" />
                  <div>
                    <span>Tanzania Institute of Accountancy</span>
                    <strong>Muslim Students Association</strong>
                    <small>TIAMSA</small>
                  </div>
                </div>

                <div className="certificate-title-block">
                  <span className="certificate-type">Official Document</span>
                  <h3>Certificate of Recognition</h3>
                  <p>
                    This is to certify that the student named below is a
                    recognized graduate of the Tanzania Institute of
                    Accountancy Muslim Students Association and has satisfied
                    the association record requirements for certification.
                  </p>
                </div>

                <div className="certificate-student-name">
                  {selectedStudent.f_name} {selectedStudent.m_name}{" "}
                  {selectedStudent.l_name}
                </div>

                <div className="certificate-copy">
                  <p>
                    Registration Number: <strong>{selectedStudent.regNo}</strong>
                  </p>
                  <p>
                    Course: <strong>{selectedStudent.course}</strong>
                  </p>
                  <p>
                    Campus: <strong>{selectedStudent.campus}</strong>
                  </p>
                  <p>
                    Certificate Number: <strong>{certificateNumber}</strong>
                  </p>
                </div>

                <div className="certificate-endorsement membership-note">
                  <div className="certificate-seal">
                    <FiShield />
                  </div>
                  <p>
                    Issued as an official TIAMSA graduate certificate with
                    controlled signatures and stamp fields for validation.
                  </p>
                </div>

                <div className="certificate-signatures">
                  <div className="certificate-signature-block">
                    <span className="signature-line"></span>
                    <strong>Guardian Signature</strong>
                    <small>TIAMSA Guardian</small>
                  </div>
                  <div className="certificate-signature-block">
                    <span className="signature-line"></span>
                    <strong>Guardian Stamp</strong>
                    <small>Stamp / Muhuri</small>
                  </div>
                  <div className="certificate-signature-block">
                    <span className="signature-line"></span>
                    <strong>TIA Stamp</strong>
                    <small>Official Stamp / Muhuri</small>
                  </div>
                </div>

                <div className="certificate-issued-row">
                  <div className="certificate-issued-block">
                    <strong>Date Issued</strong>
                    <small>{formatDisplayDate(issueDate)}</small>
                  </div>
                  <div className="certificate-issued-block">
                    <strong>Certificate Status</strong>
                    <small>Graduate Approved</small>
                  </div>
                </div>
              </div>
            </article>
          ) : (
            <div className="certificate-preview-empty">
              <FiDownload />
              <strong>No student selected</strong>
              <p>Select a graduate to preview and print.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
