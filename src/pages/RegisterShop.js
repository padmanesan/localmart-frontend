import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import './RegisterShop.css';

const mainCategories = [
  'Food & Drinks',
  'Shopping',
  'Home & Living',
  'Health & Wellness',
  'Education & Services',
  'Transport & Vehicles'
];

const subCategories = {
  'Food & Drinks': ['Restaurant', 'Juice Shop', 'Bakery', 'Hotel', 'Cafe'],
  'Shopping': ['Clothes', 'Electronics', 'Mobile', 'Accessories', 'Grocery'],
  'Home & Living': ['Furniture', 'Wood', 'Hardware', 'Building Materials'],
  'Health & Wellness': ['Medical', 'Pharmacy', 'Hospital', 'Gym', 'Clinic'],
  'Education & Services': ['Books', 'Stationery', 'Coaching', 'Printing'],
  'Transport & Vehicles': ['Bikes', 'Cars', 'Auto', 'Spare Parts']
};

const RegisterShop = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    ownerName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    state: 'Tamil Nadu',
    pincode: '',
    mainCategory: '',
    subCategory: '',
    description: '',
    openTime: '9:00 AM',
    closeTime: '9:00 PM',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMainCategoryChange = (e) => {
    setForm({ 
      ...form, 
      mainCategory: e.target.value, 
      subCategory: '' // Reset sub-category when main category changes
    });
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(false);
    try {
      await axios.post('https://nesanora-backend.onrender.com/api/shops/register', form);
      setSuccess(true);
      setTimeout(() => navigate('/shops'), 2500);
    } catch (error) {
      console.error('Error registering shop:', error);
      alert('Failed to register the shop. Please check your backend connection.');
    }
  };

  if (success) {
    return (
      <div className="success-screen">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="success-box"
        >
          <FiCheckCircle className="success-icon" style={{ fontSize: '60px', color: '#10B981', marginBottom: '15px' }} />
          <h2>Shop Registered Successfully!</h2>
          <p>Welcome to Nesanora! Redirecting to shops marketplace...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <motion.div
        className="register-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="register-title">Register Your Shop</h1>
        <p className="register-subtitle">Join Nesanora and reach thousands of local customers!</p>

        {/* Progress Steps Indicators */}
        <div className="steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Shop Info</div>
          <div className={`step-line ${step >= 2 ? 'active' : ''}`} />
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Location</div>
          <div className={`step-line ${step >= 3 ? 'active' : ''}`} />
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Category & About</div>
        </div>

        {/* Step 1 - Shop Info */}
        {step === 1 && (
          <motion.div className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="form-group">
              <label>Shop Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex: Sri Murugan Stores"
                required
              />
            </div>
            <div className="form-group">
              <label>Owner Name</label>
              <input
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10 digit mobile number"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Open Time</label>
                <input
                  name="openTime"
                  value={form.openTime}
                  onChange={handleChange}
                  placeholder="9:00 AM"
                />
              </div>
              <div className="form-group">
                <label>Close Time</label>
                <input
                  name="closeTime"
                  value={form.closeTime}
                  onChange={handleChange}
                  placeholder="9:00 PM"
                />
              </div>
            </div>
            <button className="next-btn" type="button" onClick={nextStep}>
              Next: Location <FiArrowRight />
            </button>
          </motion.div>
        )}

        {/* Step 2 - Location */}
        {step === 2 && (
          <motion.div className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="form-group">
              <label>Full Street Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Ex: 12, Main Bazaar Road"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Ex: Oddanchatram"
                  required
                />
              </div>
              <div className="form-group">
                <label>District</label>
                <input
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="Ex: Dindigul"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>State</label>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Tamil Nadu"
                />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Ex: 624619"
                  required
                />
              </div>
            </div>
            <div className="form-buttons">
              <button className="back-btn" type="button" onClick={prevStep}>
                <FiArrowLeft /> Back
              </button>
              <button className="next-btn" type="button" onClick={nextStep}>
                Next: Category <FiArrowRight />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3 - Category & Summary */}
        {step === 3 && (
          <motion.div className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="form-row">
              <div className="form-group">
                <label>Main Category</label>
                <select
                  name="mainCategory"
                  value={form.mainCategory}
                  onChange={handleMainCategoryChange}
                  required
                >
                  <option value="">Select Category</option>
                  {mainCategories.map((cat, i) => (
                    <option key={i} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Sub Category</label>
                <select
                  name="subCategory"
                  value={form.subCategory}
                  onChange={handleChange}
                  disabled={!form.mainCategory}
                  required
                >
                  <option value="">Select Sub-Category</option>
                  {form.mainCategory && subCategories[form.mainCategory]?.map((sub, i) => (
                    <option key={i} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Shop Description (Products & Services sold)</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your store (e.g., We sell authentic Dindigul style chicken and mutton biriyani items made fresh daily.)"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div className="form-buttons">
              <button className="back-btn" type="button" onClick={prevStep}>
                <FiArrowLeft /> Back
              </button>
              <button 
                className="submit-btn" 
                type="button" 
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  padding: '12px 30px',
                  borderRadius: '30px',
                  backgroundColor: '#10B981',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {loading ? 'Registering...' : 'Complete Registration 🎉'}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default RegisterShop;