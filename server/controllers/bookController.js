const Book = require('../models/Book');
const User = require('../models/User');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  try {
    const { search, genre, available } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (genre) {
      query.genre = { $regex: genre, $options: 'i' };
    }
    
    if (available !== undefined) {
      query.available = available === 'true';
    }
    
    const books = await Book.find(query)
      .populate('borrowedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching books',
      error: error.message
    });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('borrowedBy', 'name email')
      .populate('reviews.user', 'name');
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching book',
      error: error.message
    });
  }
};

// @desc    Add new book
// @route   POST /api/books
// @access  Private (Admin)
const addBook = async (req, res) => {
  try {
    const { title, author, isbn, description, genre, publishedYear } = req.body;
    
    // Check if book with same ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'Book with this ISBN already exists'
      });
    }
    
    const book = await Book.create({
      title,
      author,
      isbn,
      description,
      genre,
      publishedYear
    });
    
    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding book',
      error: error.message
    });
  }
};

// @desc    Borrow a book
// @route   POST /api/books/:id/borrow
// @access  Private
const borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    if (!book.available) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for borrowing'
      });
    }
    
    const userId = req.user.id;
    
    // Check if user has already borrowed this book
    const user = await User.findById(userId);
    const alreadyBorrowed = user.borrowedBooks.some(
      borrowed => borrowed.book.toString() === book._id.toString()
    );
    
    if (alreadyBorrowed) {
      return res.status(400).json({
        success: false,
        message: 'You have already borrowed this book'
      });
    }
    
    // Update book status
    book.available = false;
    book.borrowedBy = userId;
    book.borrowedDate = new Date();
    book.returnDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days from now
    
    await book.save();
    
    // Update user's borrowed books
    user.borrowedBooks.push({
      book: book._id,
      borrowedDate: book.borrowedDate,
      returnDate: book.returnDate
    });
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Book borrowed successfully',
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error borrowing book',
      error: error.message
    });
  }
};

// @desc    Return a book
// @route   POST /api/books/:id/return
// @access  Private
const returnBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    if (book.available) {
      return res.status(400).json({
        success: false,
        message: 'Book is already available'
      });
    }
    
    if (book.borrowedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only return books you borrowed'
      });
    }
    
    // Update book status
    book.available = true;
    book.borrowedBy = null;
    book.borrowedDate = null;
    book.returnDate = null;
    
    await book.save();
    
    // Update user's borrowed books
    const user = await User.findById(req.user.id);
    user.borrowedBooks = user.borrowedBooks.filter(
      borrowed => borrowed.book.toString() !== book._id.toString()
    );
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Book returned successfully',
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error returning book',
      error: error.message
    });
  }
};

// @desc    Add review to book
// @route   POST /api/books/:id/review
// @access  Private
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both rating and comment'
      });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    // Check if user has already reviewed this book
    const existingReview = book.reviews.find(
      review => review.user.toString() === req.user.id
    );
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this book'
      });
    }
    
    // Add review
    book.reviews.push({
      user: req.user.id,
      rating,
      comment
    });
    
    await book.save();
    
    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
};

module.exports = {
  getBooks,
  getBook,
  addBook,
  borrowBook,
  returnBook,
  addReview
};
