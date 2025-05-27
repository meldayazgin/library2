// // ====================================
// Filename: Dashboard.jsx
// Author: Aytun Yüksek / Melda Yazgın
// Description: Component responsible for dashboard management.
// Created: 2025-03-22
// Last Modified: 2025-05-26
//====================================
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase-config';
import { db } from '../firebase-config';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import './Dashboard.css';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('User');
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({
    activeBorrowings: 0,
    dueSoon: 0,
    totalRead: 0,
  });
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const userDocRef = doc(db, 'users', user.email);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const { name } = userDoc.data();
          const username = name || 'User';
          setUserName(username);

          const borrowingsRef = collection(db, 'borrowings');
          const q = query(borrowingsRef, where('user', '==', user.email));
          const querySnapshot = await getDocs(q);

          const today = new Date();
          let active = 0;
          let dueSoon = 0;
          let totalRead = 0;
          const activities = [];

          querySnapshot.forEach((doc) => {
            const b = doc.data();

            if (b.status === 'active') {
              active++;
              const due = parseDate(b.dueDate);
              const timeDiff = due - today;
              const daysLeft = timeDiff / (1000 * 3600 * 24);
              if (daysLeft >= 0 && daysLeft <= 3) {
                dueSoon++;
              }
              activities.push(`Borrowed: "${b.book}" on ${b.dueDate}`);
            }

            if ((b.status === 'returned' || b.status === 'overdue') && b.returnDate) {
              totalRead++;
              activities.push(`Returned: "${b.book}" on ${b.returnDate}`);
            }
          });

          setStats({
            activeBorrowings: active,
            dueSoon: dueSoon,
            totalRead: totalRead,
          });

          setActivityLog(activities.reverse());
        }
      } else {
        setUser(null);
        setUserName('User');
      }
    });

    return () => unsubscribe();
  }, []);

  const parseDate = (str) => {
    if (str.includes('.')) {
      const [day, month, year] = str.split('.');
      return new Date(`${year}-${month}-${day}`);
    } else {
      return new Date(str);
    }
  };

  return (
    <div className="logout-container">
      {user ? (
        <>
          <h2>Welcome, {userName}!</h2>
          <p>This is your library dashboard. Here you can manage books, borrowings, and more.</p>

          <div className="dashboard-stats">
            <div className="dashboard-card">
              <h4>My Active Borrowings</h4>
              <p>{stats.activeBorrowings}</p>
            </div>
            <div className="dashboard-card">
              <h4>Books Due Soon</h4>
              <p>{stats.dueSoon}</p>
            </div>
            <div className="dashboard-card">
              <h4>Total Books Read</h4>
              <p>{stats.totalRead}</p>
            </div>
          </div>

          <div className="dashboard-activity">
            <h4>Recent Activity</h4>
            {activityLog.length > 0 ? (
              <ul>
                {activityLog.map((entry, index) => (
                  <li key={index}>{entry}</li>
                ))}
              </ul>
            ) : (
              <p>No recent activity to display.</p>
            )}
          </div>
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

export default Dashboard;
