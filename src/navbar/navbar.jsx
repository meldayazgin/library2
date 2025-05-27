// // ====================================
// Filename: Navbar.jsx
// Author: Aytun Yüksek / Melda Yazgın
// Description: Component responsible for navigation management.
// Created: 2025-03-22
// Last Modified: 2025-05-26
//====================================
import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
        <h2>Library Automation System</h2>
      <ul className="navbar-menu">
        <li className="navbar-item">
          <Link to="/ManageBooks">Librarian</Link>
        </li>
        <li className="navbar-item">
          <Link to="/Signup">Register</Link>
        </li>
        <li className="navbar-item">
          <Link to="/Login">Login</Link>
        </li>
        <li className="navbar-item">
          <Link to="/Logout">Profile</Link>
        </li>
        <li className="navbar-item">
          <Link to="/Dashboard">Dashboard</Link>
        </li>
        <li className="navbar-item">
          <Link to="/Books">Books</Link>
        </li>
        <li className="navbar-item">
          <Link to="/Borrowings">Borrowings</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
