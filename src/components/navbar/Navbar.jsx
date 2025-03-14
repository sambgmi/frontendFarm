import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { GiShoppingCart } from "react-icons/gi";
const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [authState, setAuthState] = useState(!!user);

  useEffect(() => {
    setAuthState(!!user);
  }, [user]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setAuthState(false);
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLogin = () => {
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <img src="/logo.png" alt="Agro India" />
          <span></span>
        </div>
        
        <div className="mobile-menu-btn" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <div className={`nav-content ${isMenuOpen ? 'active' : ''}`}>
          <div className="search-bar">
            <input type="text" placeholder="Search products..." />
            <button type="button"><FaSearch /></button>
          </div>
    
          <div className="nav-links">
            <Link to="/" className="active">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact Us</Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="dashboard-btn">
                Dashboard
              </Link>
            )}{user?.role === 'FARMER' && (
              <Link to="/farmer" className="dashboard-btn">
                Dashboard
              </Link>
            )}
            {user?.role === 'BUYER' && (
              <Link to="/buyer" className="cartIcon">
                <GiShoppingCart size={24} style={{ verticalAlign: 'middle' }} />
              </Link>
            )}

            {authState ? (
              <button 
                className="login-btn logout"
                onClick={handleLogout}
                style={{ 
                  marginLeft: 'auto', 
                  backgroundColor: '#dc3545',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                {user?.email ? `Logout (${user.email})` : 'Logout'}
              </button>
            ) : (
              <button 
                className="login-btn"
                onClick={handleLogin}
                style={{ 
                  marginLeft: 'auto',
                  backgroundColor: '#007bff',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;