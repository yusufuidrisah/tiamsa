import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <h1 style={styles.logo}>TIAMSA</h1>
        <div style={styles.links}>
          <Link to="/" style={styles.link}>
            Home
          </Link>
          <Link to="/about" style={styles.link}>
            About
          </Link>
          <Link to="/register" style={styles.link}>
            Register
          </Link>
          <Link to="/announcements" style={styles.link}>
            Announcements
          </Link>
          <Link to="/admin/login" style={styles.link}>
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "#146C43",
    padding: "1rem",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  links: {
    display: "flex",
    gap: "15px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
    transition: "0.3s",
  },
};
