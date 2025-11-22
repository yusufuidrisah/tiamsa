import React, { useState } from "react";
import Header from "../components/Header";
import "../styles/register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    regNo: "",
    course: "",
    email: "",
    phone: "",
    campus: "",
    gender: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Student Data:", formData);
    alert("Registration Successful!");
    setFormData({
      name: "",
      regNo: "",
      course: "",
      email: "",
      phone: "",
      campus: "",
      gender: "",
    });
  };

  return (
    <>
      <Header />
      <div className="register-hero">
        <h1>Student Registration</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="regNo"
            placeholder="Registration Number"
            value={formData.regNo}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="course"
            placeholder="Course"
            value={formData.course}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="campus"
            placeholder="Campus"
            value={formData.campus}
            onChange={handleChange}
            required
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
