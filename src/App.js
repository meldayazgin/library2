import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './navbar/navbar'; 
import Signup from './component/Signup';
import Login from './component/Login';
import Logout from './component/Logout';
import MainPage from './MainPage';
import Dashboard from './component/Dashboard';
import Books from './component/Books';
import Borrowings from './component/Borrowings';
import ManageBooks from './librarian/ManageBooks';


const App = () => {
    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/books" element={<Books />} /> 
                    <Route path="/borrowings" element={<Borrowings />} /> 
                    <Route path="/manageBooks" element={<ManageBooks />} /> 
                </Routes>
            </div>
        </Router>
    );
};

export default App;
