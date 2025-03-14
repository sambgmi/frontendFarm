import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Empowering Farmers, Connecting Buyers!</h1>
        <p>
          Connect directly with farmers and access fresh, high-quality produce 
          while supporting local agriculture. Join our growing community today!
        </p>
        <button className="cta-button" onClick={handleExplore}>
          Explore Products
        </button>
      </div>
    </div>
  );
};

export default Hero;