import React, { useState, useRef } from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const dropdownTimeoutRef = useRef(null);

  const services = [
    { name: 'Dental Care', link: '/dental-care-kondapur-hyderabad.html' },
    { name: 'General Medicine', link: '/general-medicine-kondapur-hyderabad.html' },
    { name: 'Pediatrics', link: '/pediatrician-kondapur-hyderabad.html' },
    { name: 'Diagnostics', link: '/diagnostics-kondapur-hyderabad.html' },
    { name: 'Pharmacy', link: '/pharmacy-kondapur-hyderabad.html' },
    { name: 'Emergency Care', link: '/emergency-care-kondapur-hyderabad.html' }
  ];

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setShowServiceDropdown(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowServiceDropdown(false);
    }, 150);
  };

  return (
    <>
      <div className="top-contact-bar">
        <div className="container top-bar-content">
          <div className="contact-info">
            <div className="contact-item">
              <span className="icon">📞</span>
              <a href="tel:0407754929443" className="contact-link">040-7754929443</a>
            </div>
            <div className="contact-item">
              <span className="icon">📱</span>
              <a href="tel:+917754929443" className="contact-link">+91 7754929443</a>
            </div>
            <div className="contact-item">
              <span className="icon">✉️</span>
              <a href="mailto:chitrarthgaurav@gmail.com" className="contact-link">chitrarthgaurav@gmail.com</a>
            </div>
          </div>

          <div className="top-social">
            <a href="https://www.facebook.com/people/Neo-Asian-Clinics/61564427723632/" target="_blank" rel="noopener noreferrer" className="social-link facebook-icon" title="Facebook" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://www.instagram.com/neo_asian_clinics/" target="_blank" rel="noopener noreferrer" className="social-link instagram-icon" title="Instagram" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://api.whatsapp.com/send?phone=917754929443&text=hello&lang=en" target="_blank" rel="noopener noreferrer" className="social-link whatsapp-icon" title="WhatsApp" aria-label="WhatsApp"><FaWhatsapp /></a>
            <a href="https://www.youtube.com/@NeoAsianClinics" target="_blank" rel="noopener noreferrer" className="social-link youtube-icon" title="YouTube" aria-label="YouTube"><FaYoutube /></a>
          </div>

          <div className="top-actions">
            <a href="#appointment" className="appointment-btn">Book An Appointment</a>
            <a href="/index.html?admin=1" className="admin-btn">Admin</a>
          </div>
        </div>
      </div>

      <div className="main-nav-bar">
        <div className="container nav-content">
          <a href="/index.html" className="logo-area" aria-label="Go to home page">
            <span className="logo-icon" aria-hidden="true">🏥</span>
            <div className="logo-copy">
              <h1>Vayu Clinic</h1>
              <p>Care beyond Cure</p>
            </div>
          </a>

          <nav className="main-nav-links">
            <a href="/index.html?showPromo=1">Home</a>
            <a href="#about">About us</a>
            <div 
              className="service-dropdown"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button className="dropdown-toggle">Services</button>
              {showServiceDropdown && (
                <div className="dropdown-menu">
                  {services.map((service, index) => (
                    <a key={index} href={service.link} className="dropdown-item">
                      {service.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <a href="#media">Media</a>
            <a href="#blog">Blog</a>
            <a href="/testimonials.html">Testimonials</a>
            <a href="#contact">Contact us</a>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
