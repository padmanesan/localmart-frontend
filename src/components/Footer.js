import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h2>
            <span style={{ color: '#2D6A4F' }}>Nesan</span>
            <span style={{ color: '#D4A574' }}>ora</span>
          </h2>
          <p>Find local shops near you — anywhere in India!</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>Home</li>
            <li>Shops</li>
            <li>Categories</li>
            <li>Register Shop</li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Categories</h4>
          <ul>
            <li>Food & Juice</li>
            <li>Electronics</li>
            <li>Medical</li>
            <li>Wood & Furniture</li>
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
        <p>© 2026 Nesanora. Built with ❤️ by Padmanesan Ravi Kannan</p>
      </div>
    </footer>
  );
};

export default Footer;