import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const BookCard = ({ book, onAction }) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star">☆</span>);
      } else {
        stars.push(<span key={i} className="star empty">★</span>);
      }
    }
    
    return stars;
  };

  return (
    <div className="card" style={{ height: '100%' }}>
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          marginBottom: '8px',
          lineHeight: '1.3'
        }}>
          {book.title}
        </h3>
        <p style={{ 
          color: '#6c757d', 
          fontSize: '14px',
          marginBottom: '5px'
        }}>
          by {book.author}
        </p>
        <p style={{ 
          color: '#6c757d', 
          fontSize: '12px',
          marginBottom: '10px'
        }}>
          {book.genre} • {book.publishedYear}
        </p>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <p style={{ 
          fontSize: '14px', 
          lineHeight: '1.4',
          color: '#555',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {book.description}
        </p>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <div className="d-flex align-items-center gap-2">
          <div className="rating">
            {renderStars(book.averageRating)}
          </div>
          <span style={{ fontSize: '14px', color: '#6c757d' }}>
            ({book.reviews.length} reviews)
          </span>
        </div>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <span 
          className={`btn ${book.available ? 'btn-success' : 'btn-secondary'}`}
          style={{ 
            padding: '4px 8px', 
            fontSize: '12px',
            pointerEvents: 'none'
          }}
        >
          {book.available ? 'Available' : 'Borrowed'}
        </span>
        
        {!book.available && book.borrowedBy && (
          <span style={{ 
            fontSize: '12px', 
            color: '#6c757d',
            marginLeft: '10px'
          }}>
            Borrowed by {book.borrowedBy.name}
          </span>
        )}
      </div>
      
      {user ? (
        <div className="d-flex flex-column gap-2">
          <button
            className="btn btn-primary"
            disabled={submitting || !book.available}
            onClick={async () => {
              try {
                setSubmitting(true);
                await axios.post(`/api/books/${book._id}/borrow`);
                toast.success('Borrowed successfully');
                onAction && onAction();
              } catch (e) {
                toast.error(e.response?.data?.message || 'Borrow failed');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {book.available ? (submitting ? 'Borrowing...' : 'Borrow') : 'Not Available'}
          </button>

          <div className="card" style={{ padding: '10px' }}>
            <div className="form-group">
              <label className="form-label">Your Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="form-control"
              >
                {[1,2,3,4,5].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Comment</label>
              <input
                type="text"
                className="form-control"
                value={comment}
                maxLength={300}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a short review"
              />
            </div>
            <button
              className="btn btn-secondary"
              disabled={submitting || comment.trim().length === 0}
              onClick={async () => {
                try {
                  setSubmitting(true);
                  await axios.post(`/api/books/${book._id}/review`, { rating, comment: comment.trim() });
                  toast.success('Review added');
                  setComment('');
                  onAction && onAction();
                } catch (e) {
                  toast.error(e.response?.data?.message || 'Review failed');
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning">Login to borrow or review</div>
      )}
    </div>
  );
};

export default BookCard;
