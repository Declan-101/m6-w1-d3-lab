import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import BookList from './BookList';
import BookEdit from './BookEdit';
import './App.css';
export default function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<BookList />} />
    <Route path="/books/:id" element={<BookEdit />} />
    <Route path="*" element={<main className="container py-5"><h1>Page not found</h1><Link to="/">Book List</Link></main>} />
  </Routes></BrowserRouter>;
}
