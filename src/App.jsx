import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/navbar/Navbar';
import Home from './pages/Home';
import ProductPage from './components/products/ProductPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import FarmerDashboard from './components/farmer/FarmerDashboard';
import BuyerDashboard from './components/buyer/BuyerDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/farmer" element={<FarmerDashboard />} />
            <Route path="/buyer" element={<BuyerDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;