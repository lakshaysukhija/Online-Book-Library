const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const connectDB = require('./config/db');
const Book = require('./models/Book');
const User = require('./models/User');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));

// Seed default data (one-time on empty DB)
async function seedDataIfEmpty() {
  try {
    const bookCount = await Book.countDocuments();
    if (bookCount === 0) {
      const sampleBooks = [
        {
          title: 'The Pragmatic Programmer',
          author: 'Andrew Hunt',
          isbn: '9780201616224',
          description: 'Journeys through pragmatic approaches to software craftsmanship.',
          genre: 'Technology',
          publishedYear: 1999
        },
        {
          title: 'Clean Code',
          author: 'Robert C. Martin',
          isbn: '9780132350884',
          description: 'A handbook of agile software craftsmanship.',
          genre: 'Technology',
          publishedYear: 2008
        },
        {
          title: 'Atomic Habits',
          author: 'James Clear',
          isbn: '9780735211292',
          description: 'An easy & proven way to build good habits & break bad ones.',
          genre: 'Self-Help',
          publishedYear: 2018
        },
        {
          title: '1984',
          author: 'George Orwell',
          isbn: '9780451524935',
          description: 'A dystopian social science fiction novel and cautionary tale.',
          genre: 'Fiction',
          publishedYear: 1949
        },
        {
          title: 'Sapiens',
          author: 'Yuval Noah Harari',
          isbn: '9780062316110',
          description: 'A brief history of humankind.',
          genre: 'History',
          publishedYear: 2011
        }
      ];
      await Book.insertMany(sampleBooks);
      console.log('Seeded sample books');
    }

    const defaultEmail = 'user@example.com';
    const existingUser = await User.findOne({ email: defaultEmail });
    if (!existingUser) {
      await User.create({
        name: 'Demo User',
        email: defaultEmail,
        password: 'password123',
        role: 'user'
      });
      console.log('Seeded default user user@example.com / password123');
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
}

seedDataIfEmpty();

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
