const mongoose = require('mongoose');
const Book = require('../models/book.model');

const fields = ['title', 'author'];
function attributes(body) {
  return Object.fromEntries(fields.filter(field => Object.hasOwn(body, field)).map(field => [field, body[field]]));
}
function validId(id, res) {
  if (!mongoose.isObjectIdOrHexString(id)) {
    res.status(400).json({ message: 'A valid book ID is required.' });
    return false;
  }
  return true;
}
function fail(error, res) {
  const status = ['ValidationError', 'CastError'].includes(error.name) ? 400 : 500;
  return res.status(status).json({ message: status === 400 ? error.message : 'Book operation failed.' });
}

exports.createBook = async (req, res) => {
  try {
    const book = await Book.create(attributes(req.body || {}));
    res.status(200).json(book);
  } catch (error) { fail(error, res); }
};
exports.getBook = async (req, res) => {
  if (!validId(req.params.id, res)) return;
  try {
    const book = await Book.findById(req.params.id).select('-__v');
    if (!book) return res.status(404).json({ message: 'Book not found.' });
    res.status(200).json(book);
  } catch (error) { fail(error, res); }
};
exports.books = async (req, res) => {
  try { res.status(200).json(await Book.find().select('-__v')); }
  catch (error) { fail(error, res); }
};
exports.updateBook = async (req, res) => {
  if (!validId(req.body?._id, res)) return;
  const updates = attributes(req.body);
  if (!Object.keys(updates).length) return res.status(400).json({ message: 'Provide book fields to update.' });
  try {
    const book = await Book.findByIdAndUpdate(req.body._id,
      { $set: updates }, { returnDocument: 'after', runValidators: true }).select('-__v');
    if (!book) return res.status(404).json({ message: 'Book not found.' });
    res.status(200).json(book);
  } catch (error) { fail(error, res); }
};
exports.deleteBook = async (req, res) => {
  if (!validId(req.params.id, res)) return;
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found.' });
    res.status(200).json({});
  } catch (error) { fail(error, res); }
};
