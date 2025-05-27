// // ====================================
// Filename: Books.jsx
// Author: Aytun Yüksek / Melda Yazgın
// Description: Component responsible for book management.
// Created: 2025-03-22
// Last Modified: 2025-05-26
//====================================

import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import './Books.css';
import { Link } from 'react-router-dom';

const Books = () => {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filterField, setFilterField] = useState('title');
  const [filterValue, setFilterValue] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (u) {
        setUser(u);
        const userDoc = await getDoc(doc(db, 'users', u.email));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setCurrentUserName(data.name);
        }
      } else {
        setUser(null);
        setCurrentUserName('');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      const booksRef = collection(db, 'books');
      const snapshot = await getDocs(booksRef);
      const bookList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(bookList);
      setFilteredBooks(bookList);
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    const filtered = books.filter(book =>
      String(book[filterField]).toLowerCase().includes(filterValue.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [filterField, filterValue, books]);

  const handleBorrow = async () => {
    if (!user || !selectedBook || !dueDate) return;

    const selected = books.find(b => b.title === selectedBook);
    if (!selected || selected.availableCopies <= 0) {
      alert('This book is currently unavailable for borrowing.');
      return;
    }

    await addDoc(collection(db, 'borrowings'), {
      book: selected.title,
      user: user.email,
      dueDate,
      returnDate: '',
      fineAmount: 0,
      status: 'active',
      id: `${Date.now()}`
    });

    const bookRef = doc(db, 'books', selected.id);
    await updateDoc(bookRef, {
      availableCopies: selected.availableCopies - 1
    });

    const updatedBooks = books.map(b =>
      b.id === selected.id
        ? { ...b, availableCopies: b.availableCopies - 1 }
        : b
    );
    setBooks(updatedBooks);
    setFilteredBooks(updatedBooks);

    setShowModal(false);
    setSelectedBook('');
    setDueDate('');
  };

  if (!user) {
    return (
      <div className="logout-container">
        <p>You have not logged in. <Link to="/login" className="login-link">Login</Link></p>
      </div>
    );
  }

  return (
    <div className="logout-container">
      <h2>Books</h2>

      <div className="filter-controls">
        <select
          value={filterField}
          onChange={(e) => setFilterField(e.target.value)}
          className="edit-name-button"
        >
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="isbn">ISBN</option>
          <option value="category">Category</option>
          <option value="quantity">Quantity</option>
          <option value="availableCopies">Available Copies</option>
        </select>

        <input
          type="text"
          placeholder={`Filter by ${filterField}...`}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
      </div>

      <button className="edit-name-button" onClick={() => setShowModal(true)}>
        Borrow a Book
      </button>

      {filteredBooks.length > 0 ? (
        filteredBooks.map((book) => (
          <div key={book.id} className="book-row">
            <span><strong>{book.title}</strong></span>
            <span>{book.author}</span>
            <span>{book.isbn}</span>
            <span>{book.category}</span>
            <span>{book.quantity}</span>
            <span>{book.availableCopies}</span>
          </div>
        ))
      ) : (
        <p>No books found.</p>
      )}

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Borrow a Book</h3>

            <label>Book:</label>
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="edit-name-button"
              style={{ width: '100%' }}
            >
              <option value="">Select a book</option>
              {books.map(book => (
                <option
                  key={book.id}
                  value={book.title}
                  disabled={book.availableCopies <= 0}
                >
                  {book.title} {book.availableCopies <= 0 ? '(Unavailable)' : ''}
                </option>
              ))}
            </select>

            <label>Due Date:</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="modal-input"
            />

            <div className="button-group">
              <button className="edit-name-button" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="edit-name-button" onClick={handleBorrow}>Borrow</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
