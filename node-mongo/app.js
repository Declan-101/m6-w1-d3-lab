const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }));
app.use(bodyParser.json({ limit: '100kb' }));
require('./app/routes/book.router')(app);
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((error, req, res, next) => {
  const status = error.status === 400 ? 400 : error.status === 413 ? 413 : 500;
  res.status(status).json({ message: status === 400 ? 'Invalid JSON request body.' : status === 413 ? 'Request body too large.' : 'Server error.' });
});
module.exports = app;
