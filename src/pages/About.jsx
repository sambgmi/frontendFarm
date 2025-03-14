import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>About Agro India</h1>
        <p>Welcome to Agro India, your trusted platform connecting farmers directly with buyers.</p>
        
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>To empower farmers and provide fresh, quality agricultural products to consumers while promoting sustainable farming practices.</p>
        </section>

        <section className="about-section">
          <h2>What We Do</h2>
          <p>We bridge the gap between farmers and consumers, ensuring fair prices and quality products for everyone.</p>
        </section>

        <section className="about-section">
          <h2>Our Values</h2>
          <ul>
            <li>Quality Assurance</li>
            <li>Farmer Empowerment</li>
            <li>Sustainable Agriculture</li>
            <li>Fair Trade Practices</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;