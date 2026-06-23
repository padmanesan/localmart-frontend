import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiStar, FiClock } from 'react-icons/fi';
import axios from 'axios';
import './ShopList.css';

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Food', 'Wood', 'Medical', 'Electronics', 
                      'Grocery', 'Fashion', 'Bikes', 'Cars', 'Building'];

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/shops/all');
      setShops(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shops:', error);
      setLoading(false);
    }
  };

  const filteredShops = shops.filter(shop => {
    const matchSearch = shop.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'All' || 
                          shop.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchSearch && matchCategory;
  });

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Finding shops near you...</p>
      </div>
    );
  }

  return (
    <div className="shoplist">
      {/* Header */}
      <div className="shoplist-header">
        <h1>Local Shops Near You</h1>
        <p>Discover the best local shops in your area</p>

        {/* Search */}
        <input
          type="text"
          placeholder="Search shops..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="shoplist-search"
        />
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map((cat, index) => (
          <button
            key={index}
            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Shop Cards */}
      <div className="shops-grid">
        {filteredShops.length === 0 ? (
          <div className="no-shops">
            <p>No shops found! 😔</p>
          </div>
        ) : (
          filteredShops.map((shop, index) => (
            <motion.div
              key={shop.id}
              className="shop-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Shop Header */}
              <div className="shop-card-header">
                <div className="shop-avatar">
                  {shop.name.charAt(0)}
                </div>
                <div>
                  <h3>{shop.name}</h3>
                  <span className="shop-category">{shop.category}</span>
                </div>
              </div>

              {/* Shop Info */}
              <div className="shop-info">
                <p><FiMapPin /> {shop.address || 'Address not provided'}</p>
                <p><FiPhone /> {shop.phone}</p>
                <p><FiClock /> {shop.openTime || '9:00 AM'} - {shop.closeTime || '9:00 PM'}</p>
              </div>

              {/* Rating */}
              <div className="shop-rating">
                <FiStar className="star-icon" />
                <span>{shop.rating || '4.5'}</span>
                <span className="reviews">({shop.totalReviews || '0'} reviews)</span>
              </div>

              {/* Description */}
              <p className="shop-description">{shop.description}</p>

              {/* Button */}
              <button className="view-btn">View Shop →</button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShopList;