module.exports = app => {
  const book = require('../controllers/book.controller');
  app.post('/api/book', book.createBook);
  app.get('/api/book/:id', book.getBook);
  app.get('/api/books', book.books);
  app.put('/api/book', book.updateBook);
  app.delete('/api/book/:id', book.deleteBook);
};
