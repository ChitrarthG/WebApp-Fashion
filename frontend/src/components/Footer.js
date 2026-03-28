import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Vayu Clinic</h3>
            <p>Your trusted healthcare partner in Kondapur, Hyderabad. Providing comprehensive medical services with experienced doctors and modern facilities.</p>
            <div className="footer-contact">
              <p>📍 Kondapur, Hyderabad, Telangana</p>
              <p>📞 <a href="tel:+917754929443">+91 7754929443</a></p>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#services">Our Services</a></li>
              <li><a href="#testimonials">Patient Reviews</a></li>
              <li><a href="#appointment">Book Appointment</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Services</h3>
            <ul>
              <li>Dental Care</li>
              <li>General Medicine</li>
              <li>Pediatrics</li>
              <li>Diagnostics</li>
              <li>Pharmacy</li>
              <li>Emergency Care</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Connect With Us</h3>
            <div className="social-links">
              <a href="https://www.facebook.com/people/Neo-Asian-Clinics/61564427723632/" target="_blank" rel="noopener noreferrer" className="social-link">📘 Facebook</a>
              <a href="https://www.youtube.com/@NeoAsianClinics" target="_blank" rel="noopener noreferrer" className="social-link">📺 YouTube</a>
              <a href="https://www.instagram.com/neo_asian_clinics/" target="_blank" rel="noopener noreferrer" className="social-link">📷 Instagram</a>
              <a href="https://g.page/r/CSln2syp4QJXEBM/review" target="_blank" rel="noopener noreferrer" className="social-link">⭐ Google Reviews</a>
            </div>
            <div className="whatsapp-link">
              <a href="https://api.whatsapp.com/send?phone=917754929443&text=hello&lang=en" target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2026 Vayu Clinic. All Rights Reserved.</p>
            <p>Designed with ❤️ for better healthcare</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
