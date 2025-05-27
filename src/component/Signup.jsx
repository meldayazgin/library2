// // ====================================
// Filename: Signup.jsx
// Author: Aytun Yüksek / Melda Yazgın
// Description: Component responsible for register management.
// Created: 2025-03-22
// Last Modified: 2025-05-26
//====================================
import React, { useState } from 'react';
import { signup } from '../auth';
import './Signup.css';
import { auth, db } from '../firebase-config';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('User');
  const [message, setMessage] = useState('');

  const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const isDomainValid = (email) => {
    const emailDomain = email.split('@')[1];
    return validDomains.includes(emailDomain);
  };

  const checkEmailExistence = async (email) => {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      return signInMethods.length > 0;
    } catch (error) {
      console.error('Error checking email existence:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    if (!isDomainValid(email)) {
      setMessage('Please use a valid email domain (e.g., gmail.com, yahoo.com, etc.).');
      return;
    }

    if (password !== confirmpassword) {
      setMessage('Passwords do not match.');
      return;
    }

    const emailExists = await checkEmailExistence(email);
    if (emailExists) {
      setMessage('Email already exists. Please login.');
      return;
    }

    try {
      const result = await signup(email, password);
      setMessage(result.message);

      await setDoc(doc(db, 'users', email), {
        name,
        email,
        role, 
      });
    } catch (error) {
      console.error('Error during signup:', error);
      setMessage('Failed to sign up. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="User">User</option>
            <option value="Librarian">Librarian</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
      <p className="signup-prompt">
        Already have an account? <Link to="/login" className="login-link">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
