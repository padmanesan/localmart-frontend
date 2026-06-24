import React, { useState } from 'react';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const categories = [
  {
    name: 'Food & Drinks',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200',
    sub: ['Restaurants', 'Juice', 'Bakery', 'Hotels']
  },
  {
    name: 'Shopping',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200',
    sub: ['Clothes', 'Electronics', 'Mobile', 'Accessories']
  },
  {
    name: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200',
    sub: ['Furniture', 'Wood', 'Hardware', 'Building']
  },
  {
    name: 'Health & Wellness',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200',
    sub: ['Medical', 'Pharmacy', 'Hospital', 'Gym']
  },
  {
    name: 'Education & Services',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=200',
    sub: ['Books', 'Stationery', 'Coaching', 'Printing']
  },
  {
    name: 'Transport & Vehicles',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=200',
    sub: ['Bikes', 'Cars', 'Auto', 'Spare Parts']
  },
];

const Home = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/shops?city=${encodeURIComponent(location)}&query=${encodeURIComponent(search)}`);
  };

  return (
    <div className="home">

      {/* Hero Section */}
      <motion.div
        className="hero"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="hero-title">
          Discover Local Shops
          <span className="hero-highlight"> Near You</span>
        </h1>
        <p className="hero-subtitle">
          Find the best local shops in your city — food, wood, medical, electronics and more!
        </p>

        {/* Search Form Wrapper */}
        <form className="hero-search" onSubmit={handleSearchSubmit}>
          <div className="search-input-group">
            <FiMapPin className="input-icon" />
            <input
              type="text"
              placeholder="Your city... (Chennai, Trichy...)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="search-divider" />
          <div className="search-input-group">
            <FiSearch className="input-icon" />
            <input
              type="text"
              placeholder="Search shops or products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
      </motion.div>

      {/* Categories Section */}
      <motion.div
        className="categories-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <h2 className="section-title">Browse Categories</h2>
        <div className="categories-grid">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              className="category-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/shops?category=${encodeURIComponent(cat.name)}`)}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="category-img"
              />
              <span className="category-name">{cat.name}</span>
              <div className="category-subs">
                {cat.sub.map((s, i) => (
                  <span key={i} className="sub-tag">{s}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        className="stats-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <div className="stat-card">
          <h3>500+</h3>
          <p>Local Shops</p>
        </div>
        <div className="stat-card">
          <h3>50+</h3>
          <p>Cities</p>
        </div>
        <div className="stat-card">
          <h3>6</h3>
          <p>Main Categories</p>
        </div>
        <div className="stat-card">
          <h3>10K+</h3>
          <p>Happy Users</p>
        </div>
      </motion.div>

    </div>
  );
};

export default Home;