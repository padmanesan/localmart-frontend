import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <h2>
            <span style={{ color: '#2D6A4F' }}>Nesan</span>
            <span style={{ color: '#D4A574' }}>ora</span>
          </h2>
          <p>Find local shops near you — anywhere in India!</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li onClick={() => navigate('/')}>Home</li>
            <li onClick={() => navigate('/shops')}>Shops</li>
            <li onClick={() => navigate('/categories')}>Categories</li>
            <li onClick={() => navigate('/register')}>Register Shop</li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Categories</h4>
          <ul>
            <li onClick={() => navigate('/shops')}>Food & Juice</li>
            <li onClick={() => navigate('/shops')}>Electronics</li>
            <li onClick={() => navigate('/shops')}>Medical</li>
            <li onClick={() => navigate('/shops')}>Wood & Furniture</li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Contact</h4>
          <ul>
            <li>Chennai, Tamil Nadu</li>
            <li>padmanesanpathu@gmail.com</li>
            <li>+91 9578838305</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Nesanora. Built with by Padmanesan Ravi Kannan</p>
      </div>
    </footer>
  );
};

export default Footer;