import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleLogin = () => {
    localStorage.setItem('role', role);
    localStorage.setItem('user', JSON.stringify(form));
    if (role === 'seller') {
      navigate('/register');
    } else {
      navigate('/shops');
    }
  };

  return (
    <div className="login-page">
      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div className="login-logo">
          <span className="logo-nesan">Nesan</span>
          <span className="logo-ora">ora</span>
        </div>

        {/* Step 1 - Role Selection */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="role-selection"
          >
            <h2>Welcome to Nesanora!</h2>
            <p>Please select how you want to continue</p>

            <div className="role-cards">
              <motion.div
                className="role-card"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleRoleSelect('buyer')}
              >
                <div className="role-icon buyer-icon">B</div>
                <h3>I am a Buyer</h3>
                <p>Find and discover local shops near me</p>
              </motion.div>

              <motion.div
                className="role-card"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleRoleSelect('seller')}
              >
                <div className="role-icon seller-icon">S</div>
                <h3>I am a Seller</h3>
                <p>Register my shop and reach more customers</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Step 2 - Login Form */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="login-form"
          >
            <h2>{role === 'buyer' ? 'Buyer Login' : 'Seller Login'}</h2>
            <p>Welcome back! Please enter your details</p>

            <div className="form-group">
              <label>Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
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

            <div className="login-buttons">
              <button
                className="back-btn"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                className="login-btn"
                onClick={handleLogin}
              >
                {role === 'buyer' ? 'Find Shops' : 'Register Shop'}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;