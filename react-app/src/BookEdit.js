import React, { Component } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Alert, Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import { request } from './api';
export class BookEdit extends Component {
  state = { item: { title: '', author: '' }, loading: this.props.id !== 'new', saving: false, error: '' };
  controller = new AbortController();
  async componentDidMount() {
    if (this.props.id === 'new') return;
    try { this.setState({ item: await request(`/api/book/${this.props.id}`, { signal: this.controller.signal }), loading: false }); }
    catch (error) { if (error.name !== 'AbortError') this.setState({ error: error.message, loading: false }); }
  }
  componentWillUnmount() { this.controller.abort(); }
  handleChange = event => { const { name, value } = event.target; this.setState(state => ({ item: { ...state.item, [name]: value } })); };
  handleSubmit = async event => {
    event.preventDefault();
    if (this.state.saving) return;
    const { item } = this.state;
    const data = { title: item.title.trim(), author: item.author.trim() };
    if (!data.title || !data.author) { this.setState({ error: 'Enter both a title and an author.' }); return; }
    if (item._id) data._id = item._id;
    this.setState({ saving: true, error: '' });
    try {
      await request('/api/book', { method: item._id ? 'PUT' : 'POST', body: JSON.stringify(data), signal: this.controller.signal });
      this.props.navigate('/');
    } catch (error) { if (error.name !== 'AbortError') this.setState({ error: error.message, saving: false }); }
  };
  render() {
    const { item, loading, saving, error } = this.state;
    const isNew = this.props.id === 'new';
    return <Container className="py-5 inventory-form"><h1 className="h2 mb-4">{isNew ? 'Add Book' : 'Edit Book'}</h1>
      {error && <Alert color="danger" role="alert">{error}</Alert>}
      {loading ? <p role="status">Loading book…</p> : (isNew || item._id) && <Form onSubmit={this.handleSubmit}><fieldset disabled={saving}>
        <FormGroup><Label for="title">Title</Label><Input id="title" name="title" value={item.title} onChange={this.handleChange} required autoFocus /></FormGroup>
        <FormGroup><Label for="author">Author</Label><Input id="author" name="author" value={item.author} onChange={this.handleChange} required /></FormGroup>
        <Button color="primary" type="submit">{saving ? 'Saving…' : 'Save'}</Button>{' '}<Button color="secondary" tag={Link} to="/">Cancel</Button>
      </fieldset></Form>}
      {!loading && !isNew && !item._id && <Link to="/">Back to Book List</Link>}
    </Container>;
  }
}
export default function BookEditRoute() { const { id } = useParams(); const navigate = useNavigate(); return <BookEdit key={id} id={id} navigate={navigate} />; }
