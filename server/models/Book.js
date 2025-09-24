const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    trim: true,
    maxlength: [50, 'Author name cannot be more than 50 characters']
  },
  isbn: {
    type: String,
    required: [true, 'Please provide an ISBN'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  genre: {
    type: String,
    required: [true, 'Please provide a genre'],
    trim: true
  },
  publishedYear: {
    type: Number,
    required: [true, 'Please provide the published year']
  },
  available: {
    type: Boolean,
    default: true
  },
  borrowedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  borrowedDate: {
    type: Date,
    default: null
  },
  returnDate: {
    type: Date,
    default: null
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      maxlength: [300, 'Review comment cannot be more than 300 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate average rating before saving
bookSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = sum / this.reviews.length;
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema);
