// // ====================================
// Filename: Managebooks.jsx
// Author: Aytun Yüksek / Melda Yazgın
// Description: Component responsible for librarian actions management.
// Created: 2025-03-22
// Last Modified: 2025-05-26
//====================================
import React, { useEffect, useState } from 'react';
import {
  collection, getDocs, doc, updateDoc, deleteDoc, addDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import './ManageBooks.css'; 
import { Link } from 'react-router-dom';

const ManageBooks = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
  const [books, setBooks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '', author: '', isbn: '', category: '', quantity: '', description: ''
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (u) {
        setUser(u);
        const docSnap = await getDocs(collection(db, 'users'));
        const userDoc = docSnap.docs.find(doc => doc.data().email === u.email);
        const data = userDoc?.data();
        setRole(data?.role || 'User');
      }
    });
    fetchBooks();
    return () => unsubscribe();
  }, []);

  const fetchBooks = async () => {
    const snapshot = await getDocs(collection(db, 'books'));
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBooks(list);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setFormData({ ...book });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    const bookRef = doc(db, 'books', selectedBook.id);
    await updateDoc(bookRef, {
      ...formData,
      quantity: parseInt(formData.quantity),
      availableCopies: parseInt(formData.quantity) 
    });
    setShowEditModal(false);
    fetchBooks();
  };

  const handleAdd = async () => {
    await addDoc(collection(db, 'books'), {
      ...formData,
      quantity: parseInt(formData.quantity),
      availableCopies: parseInt(formData.quantity)
    });
    setShowAddModal(false);
    setFormData({ title: '', author: '', isbn: '', category: '', quantity: '', description: '' });
    fetchBooks();
  };

  const handleRemove = async () => {
    const bookToDelete = books.find(book => book.title === formData.title);
    if (bookToDelete) {
      await deleteDoc(doc(db, 'books', bookToDelete.id));
      setShowRemoveModal(false);
      fetchBooks();
    }
  };

  if (role !== 'Librarian') {
    return (
      <div className="logout-container">
        <p>You do not have access to this page. <Link to="/">Go Home</Link></p>
      </div>
    );
  }

  return (
    <div className="logout-container">
      <h2>Library</h2>

      <div className="button-group">
        <button className="edit-name-button" onClick={() => setShowAddModal(true)}>ADD BOOK</button>
        <button className="return-button" onClick={() => setShowRemoveModal(true)}>REMOVE BOOK</button>
      </div>

      {books.map(book => (
        <div key={book.id} className="book-row">
          <span><strong>{book.title}</strong></span>
          <span>{book.author}</span>
          <span>{book.isbn}</span>
          <span>{book.category}</span>
          <span>{book.quantity}</span>
          <button className="return-button" onClick={() => handleEdit(book)}>Update Info</button>
        </div>
      ))}

      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Add Book</h3>
            {['title', 'author', 'isbn', 'category', 'quantity', 'description'].map(field => (
              <input key={field} type="text" name={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]} onChange={handleChange} />
            ))}
            <div className="button-group">
              <button className="edit-name-button" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="edit-name-button" onClick={handleAdd}>Add</button>
            </div>
          </div>
        </div>
      )}

      {showRemoveModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Remove Book</h3>
            <select name="title" value={formData.title} onChange={handleChange}>
              <option value="">Select Book</option>
              {books.map(book => (
                <option key={book.id} value={book.title}>{book.title}</option>
              ))}
            </select>
            <div className="button-group">
              <button className="edit-name-button" onClick={() => setShowRemoveModal(false)}>Cancel</button>
              <button className="return-button" onClick={handleRemove}>Remove</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Update Book</h3>
            {['title', 'author', 'isbn', 'category', 'quantity', 'description'].map(field => (
              <input key={field} type="text" name={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]} onChange={handleChange} />
            ))}
            <div className="button-group">
              <button className="edit-name-button" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="edit-name-button" onClick={handleUpdate}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;
