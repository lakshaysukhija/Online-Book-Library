import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';

// ✅ Detect backend URL: Render in production, localhost in dev
const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://online-book-library-1mbm.onrender.com'
    : 'http://localhost:5000';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (searchTerm = '', genre = '', available = '') => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (genre) params.append('genre', genre);
      if (available) params.append('available', available);

      // ✅ Always hit the backend API
      const res = await axios.get(`${API_BASE_URL}/api/books?${params.toString()}`);

      // ✅ Ensure data is an array
      setBooks(Array.isArray(res.data?.data) ? res.data.data : []);
      setError('');
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to fetch books');
      setBooks([]); // fallback empty
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm, genre, available) => {
    fetchBooks(searchTerm, genre, available);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">
          <div className="alert alert-info">Loading books...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">📚 Welcome to Book Library</h1>
          <p className="text-muted">
            Discover, borrow, and review your favorite books
          </p>
        </div>

        <SearchBar onSearch={handleSearch} />

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <div style={{ marginTop: '2rem' }}>
          <h2>Available Books ({books?.length || 0})</h2>

          {(!books || books.length === 0) ? (
            <div className="text-center">
              <div className="alert alert-info">
                No books found. Try adjusting your search criteria.
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
                marginTop: '20px',
              }}
            >
              {books.map((book) => (
                <BookCard key={book._id} book={book} onAction={() => fetchBooks()} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
