import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('');
  const [available, setAvailable] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm, genre, available);
  };

  const handleClear = () => {
    setSearchTerm('');
    setGenre('');
    setAvailable('');
    onSearch('', '', '');
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '20px' }}>
      <div className="card-header">
        <h3>Search Books</h3>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        <div className="form-group">
          <label className="form-label">Search by title or author</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter book title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Genre</label>
          <select
            className="form-control"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="">All Genres</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Mystery">Mystery</option>
            <option value="Romance">Romance</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Biography">Biography</option>
            <option value="History">History</option>
            <option value="Self-Help">Self-Help</option>
            <option value="Business">Business</option>
            <option value="Technology">Technology</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Availability</label>
          <select
            className="form-control"
            value={available}
            onChange={(e) => setAvailable(e.target.value)}
          >
            <option value="">All Books</option>
            <option value="true">Available</option>
            <option value="false">Borrowed</option>
          </select>
        </div>
      </div>
      
      <div className="d-flex gap-2" style={{ marginTop: '15px' }}>
        <button type="submit" className="btn btn-primary">
          Search
        </button>
        <button type="button" onClick={handleClear} className="btn btn-secondary">
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
