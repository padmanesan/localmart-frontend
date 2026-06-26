import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiPhone, FiStar, FiClock, FiSearch, FiNavigation } from 'react-icons/fi';
import { IoSparkles } from 'react-icons/io5';
import axios from 'axios';
import './ShopList.css';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = 'https://nesanora-backend.onrender.com';

// ── Category config — maps display name to keyword used for filtering ──────
const CATEGORIES = [
  { label: 'All',              icon: '🏪', keyword: 'all'           },
  { label: 'Restaurants',      icon: '🍽️', keyword: 'restaurant'   },
  { label: 'Hotels & Hostels', icon: '🏨', keyword: 'hotel'        },
  { label: 'Gyms',             icon: '💪', keyword: 'gym'          },
  { label: 'Supermarkets',     icon: '🛒', keyword: 'supermarket'  },
  { label: 'Pharmacies',       icon: '💊', keyword: 'pharmacy'     },
  { label: 'Electronics',      icon: '📱', keyword: 'electronics'  },
  { label: 'Clothing',         icon: '👗', keyword: 'clothing'     },
  { label: 'Bakeries',         icon: '🧁', keyword: 'bakery'       },
  { label: 'Hospitals',        icon: '🏥', keyword: 'hospital'     },
  { label: 'Furniture',        icon: '🛋️', keyword: 'furniture'   },
  { label: 'Bike Service',     icon: '🏍️', keyword: 'bike'        },
];

// ── Category emoji for shop card avatar ──────────────────────────────────
const getCategoryEmoji = (main = '', sub = '') => {
  const s = (main + sub).toLowerCase();
  if (s.includes('restaurant') || s.includes('food') || s.includes('mess')) return '🍽️';
  if (s.includes('bakery') || s.includes('sweet'))                           return '🧁';
  if (s.includes('juice'))                                                    return '🥤';
  if (s.includes('supermarket') || s.includes('grocery'))                    return '🛒';
  if (s.includes('pharmacy') || s.includes('medical'))                       return '💊';
  if (s.includes('gym') || s.includes('fitness'))                            return '💪';
  if (s.includes('hospital'))                                                 return '🏥';
  if (s.includes('hotel') || s.includes('hostel') || s.includes('lodge'))   return '🏨';
  if (s.includes('electronics'))                                              return '📱';
  if (s.includes('clothing') || s.includes('saree') || s.includes('textile')) return '👗';
  if (s.includes('furniture') || s.includes('wood'))                         return '🛋️';
  if (s.includes('book'))                                                     return '📚';
  if (s.includes('bike') || s.includes('motor'))                             return '🏍️';
  if (s.includes('car') || s.includes('vehicle'))                            return '🚗';
  if (s.includes('laundry'))                                                  return '👕';
  return '🏪';
};

const ShopList = () => {
  const [allShops, setAllShops] = useState([]);       // full pool from backend
  const [shops, setShops]       = useState([]);       // what's displayed
  const [loading, setLoading]   = useState(true);
  const [locationMsg, setLocationMsg] = useState('');
  const [detectedCity, setDetectedCity] = useState('');
  const [locationAllowed, setLocationAllowed] = useState(null); // null | true | false

  const [search, setSearch]                   = useState('');
  const [aiQuery, setAiQuery]                 = useState('');
  const [aiLoading, setAiLoading]             = useState(false);
  const [isAiResult, setIsAiResult]           = useState(false); // true when showing AI results
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [userCoords, setUserCoords] = useState(null);

  const navigate = useNavigate();

  // ── Fetch nearby shops using GPS coords ────────────────────────────────
  const fetchNearbyShops = useCallback(async (lat, lng) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/shops/nearby`, {
        params: { lat, lng }
      });
      const data = res.data;
      // Backend returns { shops: [...], locationBased: bool, city: "...", message: "..." }
      const shopList = data.shops || (Array.isArray(data) ? data : []);
      setAllShops(shopList);
      setShops(shopList);
      setLocationMsg(data.message || '');
      setDetectedCity(data.city || '');
      setLocationAllowed(true);
      setIsAiResult(false);
      setSelectedCategory('all');
    } catch (err) {
      console.error('Nearby fetch error:', err);
      fetchAllShops();
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fallback: fetch all shops (when GPS denied) ─────────────────────────
  const fetchAllShops = useCallback(async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/shops/all`);
      const shopList = Array.isArray(res.data) ? res.data : [];
      setAllShops(shopList);
      setShops(shopList);
      setLocationMsg('Location access denied — showing all shops');
      setDetectedCity('');
      setLocationAllowed(false);
      setIsAiResult(false);
      setSelectedCategory('all');
    } catch (err) {
      console.error('Fetch all error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── On mount: ask for GPS ───────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      fetchAllShops();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserCoords({ lat, lng });
        fetchNearbyShops(lat, lng);
      },
      () => {
        fetchAllShops();
      },
      { timeout: 8000 }
    );
  }, [fetchNearbyShops, fetchAllShops]);

  // ── Category tab click ──────────────────────────────────────────────────
  const handleCategoryClick = useCallback(async (keyword) => {
    setSelectedCategory(keyword);
    setSearch('');

    // If user is in AI result mode — just client-side filter the AI results
    if (isAiResult) {
      if (keyword === 'all') {
        setShops(allShops);
      } else {
        setShops(allShops.filter(s => {
          const t = ((s.mainCategory || '') + (s.subCategory || '')).toLowerCase();
          return t.includes(keyword);
        }));
      }
      return;
    }

    // If GPS available — hit the backend category+nearby endpoint
    if (keyword === 'all') {
      setShops(allShops);
      return;
    }

    if (userCoords) {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/shops/nearby/category`, {
          params: { lat: userCoords.lat, lng: userCoords.lng, category: keyword }
        });
        const data = res.data;
        setShops(data.shops || []);
      } catch {
        // Fallback: client-side filter from the already-loaded nearby pool
        setShops(allShops.filter(s => {
          const t = ((s.mainCategory || '') + (s.subCategory || '')).toLowerCase();
          return t.includes(keyword);
        }));
      }
    } else {
      // No GPS — client-side filter
      setShops(allShops.filter(s => {
        const t = ((s.mainCategory || '') + (s.subCategory || '')).toLowerCase();
        return t.includes(keyword);
      }));
    }
  }, [isAiResult, allShops, userCoords]);

  // ── AI Search — overrides location, searches all shops globally ─────────
  const handleAISearch = async (e) => {
    if (e) e.preventDefault();
    if (!aiQuery.trim()) return;

    setAiLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/ai-search`, { query: aiQuery });
      const result = Array.isArray(res.data) ? res.data
                   : (res.data?.results || []);
      setAllShops(result);
      setShops(result);
      setIsAiResult(true);
      setSelectedCategory('all');
      setLocationMsg(`AI search: "${aiQuery}" — showing results from all cities`);
    } catch (err) {
      console.error('AI Search error:', err);
      alert('AI search failed. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  // ── Reset back to location-based view ──────────────────────────────────
  const resetToNearby = () => {
    setAiQuery('');
    setSearch('');
    setIsAiResult(false);
    setSelectedCategory('all');
    setLoading(true);
    if (userCoords) {
      fetchNearbyShops(userCoords.lat, userCoords.lng);
    } else {
      fetchAllShops();
    }
  };

  // ── Client-side name search within current shop list ────────────────────
  const displayedShops = shops.filter(shop => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (shop.name        || '').toLowerCase().includes(q)
        || (shop.description || '').toLowerCase().includes(q)
        || (shop.address     || '').toLowerCase().includes(q);
  });

  // ── Loading screen ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>📍 Detecting your location...</p>
        <p style={{ fontSize: '13px', color: '#888', marginTop: '-10px' }}>
          Finding local shops near you
        </p>
      </div>
    );
  }

  return (
    <div className="shoplist">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="shoplist-header">
        <h1>
          {detectedCity
            ? `Local Shops in ${detectedCity}`
            : 'Local Shops Near You'}
        </h1>

        {/* Location status badge */}
        <div style={{ marginBottom: '16px' }}>
          {locationAllowed === true && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.2)', padding: '5px 14px',
              borderRadius: '20px', fontSize: '13px', color: '#fff'
            }}>
              <FiNavigation size={13} /> {locationMsg}
            </span>
          )}
          {locationAllowed === false && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,100,100,0.25)', padding: '5px 14px',
              borderRadius: '20px', fontSize: '13px', color: '#fff'
            }}>
              📍 Location denied — showing all shops · use AI search to find by city
            </span>
          )}
          {isAiResult && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,200,50,0.3)', padding: '5px 14px',
              borderRadius: '20px', fontSize: '13px', color: '#fff'
            }}>
              ✨ AI result — searching across all cities
            </span>
          )}
        </div>

        {/* AI Search bar */}
        <div style={{ maxWidth: '600px', margin: '0 auto 10px', padding: '0 10px' }}>
          <form onSubmit={handleAISearch} style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <IoSparkles style={{
                position: 'absolute', left: '16px', top: '50%',
                transform: 'translateY(-50%)', color: '#1A73E8', fontSize: '18px', zIndex: 1
              }} />
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder='Ask AI... e.g. "biriyani in Chennai" or "gyms near me"'
                style={{
                  width: '100%', padding: '14px 20px 14px 46px',
                  borderRadius: '30px', border: '2px solid #1E3A8A',
                  fontSize: '15px', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              type="submit" disabled={aiLoading}
              style={{
                padding: '0 22px', borderRadius: '30px',
                backgroundColor: '#1E3A8A', color: '#fff',
                border: 'none', cursor: 'pointer',
                fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap'
              }}
            >
              {aiLoading ? '...' : ' AI Search'}
            </motion.button>
          </form>

          {/* Reset link when in AI mode */}
          {isAiResult && (
            <button onClick={resetToNearby} style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)',
              fontSize: '12px', marginTop: '6px', cursor: 'pointer',
              textDecoration: 'underline'
            }}>
              ← Back to shops near me
            </button>
          )}
        </div>

        {/* Name filter */}
        <div style={{ position: 'relative', maxWidth: '380px', margin: '8px auto 0' }}>
          <FiSearch style={{
            position: 'absolute', left: '15px', top: '50%',
            transform: 'translateY(-50%)', color: '#999'
          }} />
          <input
            type="text"
            placeholder="Filter by name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="shoplist-search"
            style={{ width: '100%', paddingLeft: '42px', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* ── Category tabs ────────────────────────────────────────────────── */}
      <div className="category-filter">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.keyword}
            className={`filter-btn ${selectedCategory === cat.keyword ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat.keyword)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* ── Results count ─────────────────────────────────────────────────── */}
      <div style={{
        padding: '12px 40px 0',
        fontSize: '13px',
        color: '#666',
        background: '#F8F4EF'
      }}>
        {displayedShops.length} shop{displayedShops.length !== 1 ? 's' : ''} found
        {detectedCity && !isAiResult ? ` in ${detectedCity}` : ''}
        {selectedCategory !== 'all'
          ? ` · ${CATEGORIES.find(c => c.keyword === selectedCategory)?.label}`
          : ''}
      </div>

      {/* ── Shop grid ─────────────────────────────────────────────────────── */}
      <div className="shops-grid">
        <AnimatePresence>
          {displayedShops.length === 0 ? (
            <motion.div
              className="no-shops"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              <p style={{ fontSize: '40px', marginBottom: '10px' }}>🔍</p>
              <p>No shops found{detectedCity ? ` in ${detectedCity}` : ''} for this filter.</p>
              {!isAiResult && (
                <p style={{ fontSize: '14px', color: '#aaa', marginTop: '8px' }}>
                  Try the AI search bar to find shops in other cities.
                </p>
              )}
            </motion.div>
          ) : (
            displayedShops.map((shop, index) => (
              <motion.div
                key={shop.id || index}
                className="shop-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -5 }}
              >
                {/* Card header */}
                <div className="shop-card-header">
                  <div className="shop-avatar" style={{ fontSize: '26px' }}>
                    {getCategoryEmoji(shop.mainCategory, shop.subCategory)}
                  </div>
                  <div>
                    <h3>{shop.name}</h3>
                    <span className="shop-category">
                      {shop.subCategory || shop.mainCategory}
                    </span>
                  </div>
                </div>

                {/* City badge — useful when viewing AI results from multiple cities */}
                {(isAiResult || !detectedCity) && shop.city && (
                  <div style={{
                    display: 'inline-block', marginBottom: '10px',
                    background: '#e8f4f0', color: '#2D6A4F',
                    padding: '2px 10px', borderRadius: '12px', fontSize: '12px'
                  }}>
                    📍 {shop.city}
                  </div>
                )}

                {/* Info rows */}
                <div className="shop-info">
                  <p><FiMapPin /> {shop.address || 'Address not provided'}</p>
                  <p><FiPhone /> {shop.phone    || 'Phone not listed'}</p>
                  <p>
                    <FiClock />
                    {shop.openTime || '9:00 AM'} – {shop.closeTime || '9:00 PM'}
                    {shop.isOpen === true  && (
                      <span style={{ color: '#2D6A4F', fontWeight: 600, marginLeft: '8px' }}>
                        · Open now
                      </span>
                    )}
                    {shop.isOpen === false && (
                      <span style={{ color: '#e55', fontWeight: 600, marginLeft: '8px' }}>
                        · Closed
                      </span>
                    )}
                  </p>
                </div>

                {/* Rating */}
                <div className="shop-rating">
                  <FiStar className="star-icon" />
                  <span>{shop.rating || '4.5'}</span>
                  <span className="reviews">
                    ({shop.totalReviews || 0} reviews)
                  </span>
                </div>

                {/* Description */}
                <p className="shop-description">
                  {shop.description || 'No description provided.'}
                </p>

                {/* CTA */}
                <button
                  className="view-btn"
                  onClick={() => navigate(`/shops/${shop.id}`)}
                >
                  View Shop →
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ShopList;