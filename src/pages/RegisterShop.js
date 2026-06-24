import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
    openTime: '',
    closeTime: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('https://nesanora-backend.onrender.com/api/shops/register', form);
      setSuccess(true);
      setTimeout(() => navigate('/shops'), 2000);
    } catch (error) {
      console.error('Error registering shop:', error);
    }
  };

  if (success) {
    return (
      <div className="success-screen">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="success-box"
        >
          <h2>Shop Registered Successfully!</h2>
          <p>Redirecting to shops page...</p>
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
        <p className="register-subtitle">Join Nesanora and reach more customers!</p>

        {/* Progress Steps */}
        <div className="steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Shop Info</div>
          <div className="step-line" />
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Location</div>
          <div className="step-line" />
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Category</div>
        </div>

        {/* Step 1 - Shop Info */}
        {step === 1 && (
          <motion.div
            className="form-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="form-group">
              <label>Shop Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex: Sri Murugan Stores"
              />
            </div>
            <div className="form-group">
              <label>Owner Name</label>
              <input
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                placeholder="Your full name"
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10 digit mobile number"
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
            <button className="next-btn" onClick={() => setStep(2)}>
              Next: Location
            </button>
          </motion.div>
        )}

        {/* Step 2 - Location */}
        {step === 2 && (
          <motion.div
            className="form-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="form-group">
              <label>Full Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Street, Area"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Chennai"
                />
              </div>
              <div className="form-group">
                <label>District</label>
                <input
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="Chennai"
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
                  placeholder="600001"
                />
              </div>
            </div>
            <div className="form-buttons">
              <button className="back-btn" onClick={() => setStep(1)}>Back</button>
              <button className="next-btn" onClick={() => setStep(3)}>Next: Category</button>
            </div>
          </motion.div>
        )}

        {/* Step 3 - Category */}
        {step === 3 && (
          <motion.div
            className="form-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="form-group">
              <label>Main Category</label>
              <select
                name="mainCategory"
                value={form.mainCategory}
                onChange={handleChange}
              >
                <option value="">Select Main Category</option>
                {mainCategories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {form.mainCategory && (
              <div className="form-group">
                <label>Sub Category</label>
                <select
                  name="subCategory"
                  value={form.subCategory}
                  onChange={handleChange}
                >
                  <option value="">Select Sub Category</option>
                  {subCategories[form.mainCategory].map((sub, i) => (
                    <option key={i} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="form-group">
              <label>Shop Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Tell customers about your shop..."
                rows={4}
              />
            </div>
            <div className="form-buttons">
              <button className="back-btn" onClick={() => setStep(2)}>Back</button>
              <button className="submit-btn" onClick={handleSubmit}>
                Register Shop
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default RegisterShop;