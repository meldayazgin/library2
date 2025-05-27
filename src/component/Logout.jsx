// // ====================================
// Filename: Logout.jsx
// Author: Aytun Yüksek / Melda Yazgın
// Description: Component responsible for profile management.
// Created: 2025-03-22
// Last Modified: 2025-05-26
//====================================
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase-config'; 
import { signOut, deleteUser } from 'firebase/auth'; 
import { db } from '../firebase-config'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore'; 
import './Logout.css'; 
import { Link } from 'react-router-dom'; 

const Logout = () => {
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState(''); 
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user); 
                const userDocRef = doc(db, 'users', user.email); 
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserName(data.name || user.email);
                    setRole(data.role || 'User');
                }
            } else {
                setUser(null); 
                setUserName(''); 
                setRole('');
            }
        });

        return () => unsubscribe(); 
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth); 
            setMessage('User signed out successfully.');
            console.log('User signed out successfully');
        } catch (error) {
            console.error('Error signing out: ', error);
            setMessage('Sign out failed. Please try again.');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            if (user) {
                const confirmation = window.confirm(
                    'Are you sure you want to delete your account? This action cannot be undone.'
                );
                if (confirmation) {
                    await deleteUser(user);
                    setMessage('Your account has been deleted successfully.');
                    console.log('Account deleted successfully.');
                }
            }  
        } catch (error) {
            console.error('Error deleting account: ', error);
            setMessage('Failed to delete account. Please try again.');
        }
    };

    const updateUserInfo = async () => {
        if (newName.trim()) {
            try {
                const userDocRef = doc(db, 'users', user.email);
                await updateDoc(userDocRef, { name: newName });
                setUserName(newName);
                setMessage('Name updated successfully.');
                setNewName(''); 
                setIsEditing(false); 
            } catch (error) {
                console.error('Error updating name: ', error);
                setMessage('Failed to update name. Please try again.');
            }
        }
    };

    return (
        <div className="logout-container">
            {user ? (
                <>
                    <h2>Hello, {userName}!</h2> 
                    <h3>Email: {user.email}</h3>
                    <p className="email-note">Note: Email address cannot be changed.</p>
                    <h4>Role: {role}</h4>

                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                    <button className="logout-button" onClick={handleDeleteAccount}>
                        Delete Account
                    </button>
                    <button className="logout-button" onClick={() => setIsEditing(true)}>
                        Update Name
                    </button>

                    {isEditing && (
                        <div className="enter-new-name">
                            <input 
                                type="text" 
                                placeholder="Enter new name" 
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)} 
                                className="new-name-input" 
                            />
                            <div className="button-group">
                                <button className="edit-name-button" onClick={updateUserInfo}>
                                    Save New Name
                                </button>
                                <button className="edit-name-button" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                    {message && <p className="message">{message}</p>}
                </>
            ) : (
                <>
                    <p>You have not logged in. <Link to="/login" className="login-link">Login</Link></p>
                    {message && <p className="message">{message}</p>}
                </>
            )}
        </div>
    );
};

export default Logout;
