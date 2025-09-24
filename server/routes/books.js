const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBook,
  addBook,
  borrowBook,
  returnBook,
  addReview
} = require('../controllers/bookController');
const { auth, adminAuth } = require('../middleware/auth');

// Public routes
router.get('/', getBooks);
router.get('/:id', getBook);

// Protected routes
router.post('/', auth, adminAuth, addBook);
router.post('/:id/borrow', auth, borrowBook);
router.post('/:id/return', auth, returnBook);
router.post('/:id/review', auth, addReview);

module.exports = router;
