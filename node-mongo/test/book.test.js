const { test } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const app = require('../app');
const Book = require('../app/models/book.model');

test('book API supports CRUD and rejects invalid requests', async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/book-list-lab-test');
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  let id;
  async function request(path, method = 'GET', data) {
    return fetch(base + path, { method, headers: { 'Content-Type': 'application/json' }, body: data === undefined ? undefined : JSON.stringify(data) });
  }
  try {
    let response = await request('/api/book', 'POST', { title: 'API test item', author: 'Test Author' });
    assert.equal(response.status, 200);
    id = (await response.json())._id;
    response = await request(`/api/book/${id}`);
    assert.equal((await response.json()).title, 'API test item');
    response = await request('/api/books');
    assert.ok((await response.json()).some(item => item._id === id));
    response = await request('/api/book', 'PUT', { _id: id, author: 'Updated Author' });
    assert.equal((await response.json()).author, 'Updated Author');
    response = await request('/api/book', 'PUT', { _id: id, title: ' ' });
    assert.equal(response.status, 400);
    response = await request('/api/book', 'POST', {});
    assert.equal(response.status, 400);
    response = await request('/api/book/not-an-id');
    assert.equal(response.status, 400);
    response = await request(`/api/book/${id}`, 'DELETE');
    assert.equal(response.status, 200);
    response = await request(`/api/book/${id}`);
    assert.equal(response.status, 404);
  } finally {
    if (id) await Book.deleteOne({ _id: id });
    await new Promise(resolve => server.close(resolve));
    await mongoose.disconnect();
  }
});
