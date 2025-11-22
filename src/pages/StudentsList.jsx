import React, { useState } from "react";
import "../styles/Student-list.css";

export default function StudentsList() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Ali Mohamed",
      regNo: "TIA001",
      course: "Accounting",
      email: "ali@mail.com",
      phone: "0712345678",
      campus: "Dar es Salaam",
      gender: "Male",
    },
    {
      id: 2,
      name: "Aisha Said",
      regNo: "TIA002",
      course: "Business",
      email: "aisha@mail.com",
      phone: "0712345679",
      campus: "Dar es Salaam",
      gender: "Female",
    },
  ]);

  const [newStudent, setNewStudent] = useState({
    name: "",
    regNo: "",
    course: "",
    email: "",
    phone: "",
    campus: "",
    gender: "",
  });

  const handleChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (Object.values(newStudent).some((v) => v === "")) {
      return alert("Fill all fields");
    }
    setStudents([...students, { id: Date.now(), ...newStudent }]);
    setNewStudent({
      name: "",
      regNo: "",
      course: "",
      email: "",
      phone: "",
      campus: "",
      gender: "",
    });
  };

  const handleDelete = (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  return (
    <div className="students-container">
      <h2>Students List</h2>

      <form className="students-form" onSubmit={handleAdd}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={newStudent.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="regNo"
          placeholder="Reg No"
          value={newStudent.regNo}
          onChange={handleChange}
        />
        <input
          type="text"
          name="course"
          placeholder="Course"
          value={newStudent.course}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newStudent.email}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={newStudent.phone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="campus"
          placeholder="Campus"
          value={newStudent.campus}
          onChange={handleChange}
        />
        <select name="gender" value={newStudent.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <button type="submit">Add Student</button>
      </form>
      <div className="table-responsive-wrapper">
        <table className="students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Reg No</th>
              <th>Course</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Campus</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td data-label="Name">{s.name}</td>
                <td data-label="Reg No">{s.regNo}</td>
                <td data-label="Course">{s.course}</td>
                <td data-label="Email">{s.email}</td>
                <td data-label="Phone">{s.phone}</td>
                <td data-label="Campus">{s.campus}</td>
                <td data-label="Gender">{s.gender}</td>
                <td data-label="Actions">
                  <button onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
