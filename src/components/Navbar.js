import React, { useState } from 'react';
import { FiSun, FiMoon, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };

  const handleNavSearchSubmit = (e) => {
    e.preventDefault();
    if (!navSearch.trim()) return;
    // Reroutes user directly to shops layout with search inputs in scope
    navigate(`/shops?search=${encodeURIComponent(navSearch)}`);
  };

  return (
    <nav className={`navbar ${darkMode ? 'dark' : ''}`}>
      {/* Logo */}
      <div className="navbar-logo" onClick={() => navigate('/')}>
        <span className="logo-nesan">Nesan</span>
        <span className="logo-ora">ora</span>
      </div>

      {/* Search Bar */}
      <form className="navbar-search" onSubmit={handleNavSearchSubmit}>
        <FiSearch className="search-icon" onClick={handleNavSearchSubmit} style={{ cursor: 'pointer' }} />
        <input
          type="text"
          placeholder="Search shops, products..."
          value={navSearch}
          onChange={(e) => setNavSearch(e.target.value)}
        />
      </form>

      {/* Nav Links */}
      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li onClick={() => navigate('/')}>Home</li>
        <li onClick={() => navigate('/shops')}>Shops</li>
        <li onClick={() => navigate('/categories')}>Categories</li>
        <li onClick={() => navigate('/about')}>About</li>
      </ul>

      {/* Right Side */}
      <div className="navbar-right">
        <button className="dark-toggle" onClick={toggleDarkMode}>
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
        <button className="login-btn-nav" onClick={() => navigate('/login')}>
          Login
        </button>
        <button className="register-btn" onClick={() => navigate('/register')}>
          Register Shop
        </button>
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;