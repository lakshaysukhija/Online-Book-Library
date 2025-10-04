import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      backgroundColor: '#343a40',
      padding: '1rem 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <Link 
            to="/" 
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '24px',
              fontWeight: 'bold'
            }}
          >
            📚 Book Library
          </Link>
          
          <div className="d-flex gap-3 align-items-center">
            <Link 
              to="/" 
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Home
            </Link>
            
            {user ? (
              <>
                <div className="d-flex align-items-center gap-2">
                  <span style={{ color: 'white' }}>Welcome, {user.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="btn btn-outline-light"
                    style={{
                      padding: '6px 12px',
                      fontSize: '14px',
                      border: '1px solid white',
                      color: 'white',
                      background: 'transparent',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.color = '#343a40';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = 'white';
                    }}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light">
                
                
                
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
