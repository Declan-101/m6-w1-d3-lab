const mongoose = require('mongoose');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '../.env'), quiet: true });
const Book = require('../app/models/book.model');
(async () => {
  try {
    await mongoose.connect(process.env.DATABASE || 'mongodb://127.0.0.1:27017/book-list');
    if (await Book.countDocuments()) console.log('Books already exist; skipped import to preserve data.');
    else {
      const source = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/db.json'), 'utf8'));
      const books = source.posts.map(({ title, author }) => ({ title, author }));
      await Book.insertMany(books);
      console.log(`Imported ${books.length} books from the original db.json.`);
    }
  } finally { await mongoose.disconnect(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
