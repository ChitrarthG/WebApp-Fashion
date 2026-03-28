import React from "react";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-top">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo"><span></span> Vayu Fashion</div>
          <p>Your one-stop fashion destination. Discover the latest trends in clothing, accessories and more. Shop with confidence.</p>
          <div className="footer-social">
            <a href="/social/facebook" aria-label="Facebook" className="social-icon"></a>
            <a href="/social/instagram" aria-label="Instagram" className="social-icon"></a>
            <a href="/social/twitter" aria-label="Twitter" className="social-icon"></a>
            <a href="/social/youtube" aria-label="YouTube" className="social-icon"></a>
          </div>
        </div>

        <div className="footer-links-col">
          <h4>Shop</h4>
          <ul>
            <li><a href="#women">Women</a></li>
            <li><a href="#men">Men</a></li>
            <li><a href="#kids">Kids</a></li>
            <li><a href="#beauty">Beauty</a></li>
            <li><a href="#home-living">Home & Living</a></li>
            <li><a href="#sale">Sale</a></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Help & Support</h4>
          <ul>
            <li><a href="/track-order">Track My Order</a></li>
            <li><a href="/returns">Returns & Exchanges</a></li>
            <li><a href="/shipping-policy">Shipping Policy</a></li>
            <li><a href="/size-guide">Size Guide</a></li>
            <li><a href="/faqs">FAQs</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Company</h4>
          <ul>
            <li><a href="/about">About Vayu Fashion</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/press">Press</a></li>
            <li><a href="/affiliate">Affiliate Program</a></li>
            <li><a href="/gift-cards">Gift Cards</a></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Contact</h4>
          <div className="footer-contact-info">
            <p> <a href="tel:+917754929443">+91 775 492 9443</a></p>
            <p> <a href="mailto:chitrarthgaurav@gmail.com">chitrarthgaurav@gmail.com</a></p>
            <p> Mon–Sat, 9AM–8PM IST</p>
          </div>
          <div className="footer-payment">
            <h5>We Accept</h5>
            <div className="payment-icons">
              <span></span><span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="footer-bottom">
      <div className="container footer-bottom-inner">
        <p>© 2026 Vayu Fashion. All rights reserved.</p>
        <div className="footer-legal">
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-of-service">Terms of Service</a>
          <a href="/cookie-policy">Cookie Policy</a>
          <a href="/index.html?admin=1" className="admin-link">Admin</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
