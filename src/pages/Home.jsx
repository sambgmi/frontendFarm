import React from 'react';
import Hero from '../components/hero/Hero';
import ProductPage from '../components/products/ProductPage';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Hero />
      <div id="products-section">
        <ProductPage />
      </div>
    </div>
  );
};

export default Home;