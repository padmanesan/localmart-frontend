import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiPhone, FiClock, FiStar, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import './ShopDetail.css';

const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShop();
  }, []);

  const fetchShop = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/shops/${id}`);
      setShop(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shop:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading shop details...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="not-found">
        <h2>Shop not found!</h2>
        <button onClick={() => navigate('/shops')}>Back to Shops</button>
      </div>
    );
  }

  return (
    <div className="shop-detail-page">
      <motion.div
        className="shop-detail-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Back Button */}
        <button
          className="back-button"
          onClick={() => navigate('/shops')}
        >
          <FiArrowLeft /> Back to Shops
        </button>

        {/* Shop Header */}
        <div className="shop-detail-header">
          <div className="shop-detail-avatar">
            {shop.name.charAt(0)}
          </div>
          <div className="shop-detail-info">
            <h1>{shop.name}</h1>
            <div className="shop-detail-badges">
              <span className="badge main-category">{shop.mainCategory}</span>
              <span className="badge sub-category">{shop.subCategory}</span>
            </div>
            <div className="shop-detail-rating">
              <FiStar className="star-icon" />
              <span>{shop.rating || '4.5'}</span>
              <span className="reviews">({shop.totalReviews || '0'} reviews)</span>
            </div>
          </div>
        </div>

        {/* Shop Details Grid */}
        <div className="shop-detail-grid">

          {/* Contact Info */}
          <div className="detail-card">
            <h3>Contact Information</h3>
            <div className="detail-item">
              <FiPhone className="detail-icon" />
              <div>
                <label>Phone</label>
                <p>{shop.phone}</p>
              </div>
            </div>
            <div className="detail-item">
              <FiMapPin className="detail-icon" />
              <div>
                <label>Address</label>
                <p>{shop.address}</p>
                <p>{shop.city}, {shop.district}</p>
                <p>{shop.state} - {shop.pincode}</p>
              </div>
            </div>
            <div className="detail-item">
              <FiClock className="detail-icon" />
              <div>
                <label>Working Hours</label>
                <p>{shop.openTime || '9:00 AM'} - {shop.closeTime || '9:00 PM'}</p>
              </div>
            </div>
          </div>

          {/* About Shop */}
          <div className="detail-card">
            <h3>About Shop</h3>
            <p className="shop-description-full">{shop.description}</p>
            <div className="owner-info">
              <div className="owner-avatar">
                {shop.ownerName.charAt(0)}
              </div>
              <div>
                <label>Shop Owner</label>
                <p>{shop.ownerName}</p>
              </div>
            </div>
          </div>

        </div>

       {/* Action Buttons */}
       {/* Action Buttons */}
<div className="shop-actions">
  <a href={`tel:${shop.phone}`} className="action-btn call-btn">
    <FiPhone /> Call Now
  </a>
  
    href={`https://maps.google.com/?q=${shop.address},${shop.city}`}
    target="_blank"
    rel="noreferrer"
    className="action-btn directions-btn"
  <a>
    <FiMapPin /> Get Directions
  </a>
</div>

      </motion.div>
    </div>
  );
};

export default ShopDetail;