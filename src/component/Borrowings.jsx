// // ====================================
// Filename: Borrowings.jsx
// Author: Aytun Yüksek / Melda Yazgın
// Description: Component responsible for borrowings management.
// Created: 2025-03-22
// Last Modified: 2025-05-26
//====================================
import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc
} from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import './Borrowings.css';
import { Link } from 'react-router-dom';

const Borrowings = () => {
  const [user, setUser] = useState(null);
  const [borrowings, setBorrowings] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (u) {
        setUser(u);
        fetchBorrowings(u);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchBorrowings = async (user) => {
    const q = query(collection(db, 'borrowings'), where('user', '==', user.email));
    const snapshot = await getDocs(q);
    const today = new Date();
    const borrowedList = [];
    const notices = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const firestoreId = docSnap.id;
      const dueDate = new Date(data.dueDate);
      const returnDate = data.returnDate ? new Date(data.returnDate) : null;

      let isOverdue = false;
      let calculatedFine = 0;

      if (data.status === 'active' && dueDate < today && !returnDate) {
        isOverdue = true;
        const daysLate = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        calculatedFine = daysLate * 1;

        const borrowingRef = doc(db, 'borrowings', firestoreId);
        await updateDoc(borrowingRef, { fineAmount: calculatedFine });

        notices.push(`⚠️ "${data.book}" is overdue! Fine: $${calculatedFine}`);
      } else if (data.status === 'active' && dueDate > today && (dueDate - today) / (1000 * 60 * 60 * 24) <= 3) {
        notices.push(`⏳ "${data.book}" is due soon on ${data.dueDate}.`);
      }

      borrowedList.push({
        firestoreId,
        ...data,
        fine: calculatedFine || data.fineAmount || 0,
        displayStatus: data.status === 'active' ? 'borrowed' : data.status
      });
    }

    setBorrowings(borrowedList);
    setNotifications(notices);
  };

  const handleReturn = async (b) => {
    const borrowingRef = doc(db, 'borrowings', b.firestoreId);
    await updateDoc(borrowingRef, {
      status: 'returned',
      returnDate: new Date().toISOString().split('T')[0]
    });

    const booksSnapshot = await getDocs(collection(db, 'books'));
    const bookDoc = booksSnapshot.docs.find(doc => doc.data().title === b.book);

    if (bookDoc) {
      const bookRef = doc(db, 'books', bookDoc.id);
      const currentCopies = bookDoc.data().availableCopies || 0;
      await updateDoc(bookRef, {
        availableCopies: currentCopies + 1
      });
    }

    fetchBorrowings(user);
  };

  if (!user) {
    return (
      <div className="logout-container">
        <p>You have not logged in. <Link to="/login" className="login-link">Login</Link></p>
      </div>
    );
  }

  return (
    <div className="borrowings-wrapper">
      <h2>My Borrowings</h2>
      <ul className="borrowings-list">
        {borrowings.map((b) => (
          <li key={b.firestoreId}>
            <div className="left">
              <span>📘 {b.book} - Due: {b.dueDate}</span>
              <span className={`status ${b.displayStatus}`}>{b.displayStatus}</span>
              {b.fine > 0 && <span className="fine">Fine: ${b.fine}</span>}
            </div>
            {b.displayStatus === 'borrowed' && (
              <button className="return-button" onClick={() => handleReturn(b)}>
                RETURN BOOK
              </button>
            )}
          </li>
        ))}
      </ul>

      {notifications.length > 0 && (
        <div className="notifications-box">
          <h4>Notifications</h4>
          <ul>
            {notifications.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Borrowings;