// // ====================================
// Filename: MainPage.jsx
// Author: Aytun Yüksek / Melda Yazgın
// Description: Component responsible for main page screen.
// Created: 2025-03-22
// Last Modified: 2025-05-26
//====================================
import React from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css'; 

const MainPage = () => {
    return (
        <div className="main-page">
            <h1>Welcome to Library Automation System!</h1>
            <div className="button-container">
                <Link to="/signup">
                    <button>Sign Up</button>
                </Link>
                <Link to="/login">
                    <button>Login</button>
                </Link>
            </div>
        </div>
    );
};

export default MainPage;
