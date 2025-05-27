// // ====================================
// Filename: Login.jsx
// Author: Aytun Yüksek / Melda Yazgın
// Description: Component responsible for login management.
// Created: 2025-03-22
// Last Modified: 2025-05-26
//====================================
import React, { useState } from 'react';
import { login } from '../auth';
import { Link, useNavigate } from 'react-router-dom'; 
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login(email, password);
      setMessage(result.message);

      if (result.success) {
        navigate('/dashboard'); 
      }
    } catch (error) {
      setMessage('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>} 

      <p className="signup-prompt">
        Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
