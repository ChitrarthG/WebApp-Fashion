import React, { useState } from "react";
import "./Contact.css";
import apiBaseUrl from "../config/api";

const Contact = ({ sectionNumber = '11' }) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${apiBaseUrl}/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setEmail("");
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Could not subscribe. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="newsletter-section" id="newsletter" title={sectionNumber}>
      <div className="container">
        {/* Newsletter signup */}
        <div className="newsletter-box">
          <div className="newsletter-left">
            <span className="newsletter-icon"></span>
            <div>
              <h2>Get Style Inspiration</h2>
              <p>Subscribe for the latest trends, exclusive offers and style tips delivered to your inbox.</p>
            </div>
          </div>
          <div className="newsletter-right">
            {success ? (
              <div className="newsletter-success">
                <span></span>
                <span>Thank you for subscribing! Welcome to Vayu Fashion.</span>
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  aria-label="Email address for newsletter"
                />
                <button type="submit" disabled={submitting} className="subscribe-btn">
                  {submitting ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}
            {error && <p className="newsletter-error">{error}</p>}
            <p className="newsletter-privacy">No spam, unsubscribe anytime.</p>
          </div>
        </div>

        {/* App download prompt */}
        <div className="app-promo">
          <div className="app-promo-text">
            <h3> Shop Smarter with Our App</h3>
            <p>Get exclusive app-only deals, track orders and more. Download now!</p>
          </div>
          <div className="app-store-buttons">
            <div className="app-store-btn"><span></span><div><span>Download on</span><strong>App Store</strong></div></div>
            <div className="app-store-btn"><span></span><div><span>Get it on</span><strong>Google Play</strong></div></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
