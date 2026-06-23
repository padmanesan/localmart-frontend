import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ShopList from './pages/ShopList';
import RegisterShop from './pages/RegisterShop';
import Login from './pages/Login';
import ShopDetail from './pages/ShopDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shops" element={<ShopList />} />
          <Route path="/shops/:id" element={<ShopDetail />} />
          <Route path="/register" element={<RegisterShop />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;