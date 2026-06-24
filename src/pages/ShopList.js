import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiStar, FiClock, FiSearch } from 'react-icons/fi';
import { IoSparkles } from 'react-icons/io5';
import axios from 'axios';
import './ShopList.css';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = 'https://nesanora-backend.onrender.com';

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', 'Food', 'Wood', 'Medical', 'Electronics', 
                      'Grocery', 'Fashion', 'Bikes', 'Cars', 'Building'];

  const fetchShops = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/shops/all`);
      setShops(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shops:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  const handleAISearch = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setAiLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/ai-search`, { query: aiQuery });
      if (response.data && response.data.results) {
        setShops(response.data.results);
        setSelectedCategory('All'); 
      }
    } catch (error) {
      console.error("AI Search Error:", error);
      alert("Could not connect to Gemini AI backend. Making regular lookup instead.");
    } finally {
      setAiLoading(false);
    }
  };

  const filteredShops = shops.filter(shop => {
    const matchSearch = (shop.name && shop.name.toLowerCase().includes(search.toLowerCase())) || 
                        (shop.description && shop.description.toLowerCase().includes(search.toLowerCase()));
    
    // Check both potential properties for matching category logic safely
    const shopCat = shop.category || shop.mainCategory || '';
    const matchCategory = selectedCategory === 'All' || 
                          shopCat.toLowerCase().includes(selectedCategory.toLowerCase());
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
      <div className="shoplist-header">
        <h1>Local Shops Near You</h1>
        <p>Discover the best local shops in your area</p>

        <div style={{ maxWidth: '600px', margin: '20px auto', padding: '0 10px' }}>
          <form onSubmit={handleAISearch} style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="✨ Ask Gemini AI... (e.g., 'places that sell wooden tables')"
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  paddingLeft: '45px',
                  borderRadius: '30px',
                  border: '2px solid #1E3A8A', 
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <IoSparkles style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#1A73E8', fontSize: '18px' }} />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={aiLoading}
              style={{
                padding: '0 25px',
                borderRadius: '30px',
                backgroundColor: '#1E3A8A',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              {aiLoading ? 'Thinking...' : 'AI Search'}
            </motion.button>
          </form>
          {aiQuery && (
            <button 
              onClick={() => { setAiQuery(''); fetchShops(); }} 
              style={{ background: 'none', border: 'none', color: '#666', fontSize: '12px', marginTop: '5px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Reset to all shops
            </button>
          )}
        </div>

        <div style={{ margin: '15px 0', opacity: 0.5 }}>— OR —</div>

        <div style={{ position: 'relative', maxWidth: '400px', margin: '0 auto' }}>
          <input
            type="text"
            placeholder="Filter current results by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="shoplist-search"
            style={{ width: '100%', paddingLeft: '40px' }}
          />
          <FiSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
        </div>
      </div>

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

      <div className="shops-grid">
        {filteredShops.length === 0 ? (
          <div className="no-shops">
            <p>No shops found matching filters! </p>
          </div>
        ) : (
          filteredShops.map((shop, index) => (
            <motion.div
              key={shop.id || index}
              className="shop-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <div className="shop-card-header">
                <div className="shop-avatar">
                  {shop.name ? shop.name.charAt(0) : 'S'}
                </div>
                <div>
                  <h3>{shop.name}</h3>
                  <span className="shop-category">{shop.category || shop.mainCategory}</span>
                </div>
              </div>

              <div className="shop-info">
                <p><FiMapPin /> {shop.address || 'Address not provided'}</p>
                <p><FiPhone /> {shop.phone || 'No phone verified'}</p>
                <p><FiClock /> {shop.openTime || '9:00 AM'} - {shop.closeTime || '9:00 PM'}</p>
              </div>

              <div className="shop-rating">
                <FiStar className="star-icon" />
                <span>{shop.rating || '4.5'}</span>
                <span className="reviews">({shop.totalReviews || '12'} reviews)</span>
              </div>

              <p className="shop-description">{shop.description || 'No description provided for this storefront.'}</p>

              <button 
                className="view-btn"
                onClick={() => navigate(`/shops/${shop.id}`)}
              >
                View Shop →
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShopList;