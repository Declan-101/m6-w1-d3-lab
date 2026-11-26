import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Container, Table } from 'reactstrap';
import { request } from './api';
export default class BookList extends Component {
  state = { books: [], loading: true, error: '', deleting: null };
  controller = new AbortController();
  async componentDidMount() {
    try { this.setState({ books: await request('/api/books', { signal: this.controller.signal }), loading: false }); }
    catch (error) { if (error.name !== 'AbortError') this.setState({ error: error.message, loading: false }); }
  }
  componentWillUnmount() { this.controller.abort(); }
  remove = async id => {
    this.setState({ deleting: id, error: '' });
    try {
      await request(`/api/book/${id}`, { method: 'DELETE', signal: this.controller.signal });
      this.setState(state => ({ books: state.books.filter(book => book._id !== id), deleting: null }));
    } catch (error) { if (error.name !== 'AbortError') this.setState({ error: error.message, deleting: null }); }
  };
  render() {
    const { books, loading, error, deleting } = this.state;
    return <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4"><h1 className="h2 mb-0">Book List</h1><Button color="success" tag={Link} to="/books/new">Add Book</Button></div>
      {error && <Alert color="danger" role="alert">{error}</Alert>}
      {loading ? <p role="status">Loading books…</p> : <Table responsive striped className="align-middle">
        <thead><tr><th scope="col">Title</th><th scope="col">Author</th><th scope="col">Actions</th></tr></thead>
        <tbody>{books.map(book => <tr key={book._id}><td>{book.title}</td><td>{book.author}</td>
          <td><div className="d-flex gap-2"><Button size="sm" color="primary" tag={Link} to={`/books/${book._id}`} aria-label={`Edit ${book.title}`}>Edit</Button><Button size="sm" color="danger" disabled={deleting !== null} onClick={() => this.remove(book._id)} aria-label={`Delete ${book.title}`}>{deleting === book._id ? 'Deleting…' : 'Delete'}</Button></div></td></tr>)}
          {books.length === 0 && <tr><td colSpan="3">No books yet. Add your first book.</td></tr>}
        </tbody></Table>}
    </Container>;
  }
}
