import React, { useState, useEffect } from 'react';
import './Contact.css';
import apiBaseUrl from '../config/api';

const slideImages = [
  '/image1.JPG',
  '/image2.JPG',
  '/image3.JPG',
  '/vayu-popup.JPG',
];

const Contact = () => {
  const [current, setCurrent] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', datetime: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAppointmentSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBaseUrl}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: form.service,
          appointmentDatetime: form.datetime || null,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        window.alert(
          `Thank You, Your Message Successfully Received.\nYour Booking Reference: ${data.referenceId}\nWe will get back to you soon.`
        );
        setForm({ name: '', email: '', phone: '', service: '', datetime: '', message: '' });
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      } else {
        window.alert(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      window.alert('Could not submit appointment. Please check your connection or call us at +91 7754929443.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (slideImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slideImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-content">
          <div className="contact-slideshow-wrapper">
            <div className="contact-slideshow">
              <div className="slideshow-track" style={{ transform: `translateX(-${current * 100}%)` }}>
                {slideImages.map((src, i) => (
                  <img key={i} src={src} alt={`Slide ${i + 1}`} className="slide-img" />
                ))}
              </div>
            </div>
            {slideImages.length > 1 && (
              <div className="slide-dots">
                {slideImages.map((_, i) => (
                  <button
                    key={i}
                    className={`slide-dot${i === current ? ' active' : ''}`}
                    onClick={() => setCurrent(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="appointment-form" id="appointment">
            <p className="appointment-intro">
              Looking for a consultation with our specialist? Feel free to fill out this
              form and submit. To know more about the doctors, visit <strong>Team</strong> page.
            </p>
            <h3>Appointment</h3>
            <form className="form" onSubmit={handleAppointmentSubmit}>
              <div className="form-group">
                <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <input type="tel" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <select name="service" value={form.service} onChange={handleChange} required>
                  <option value="">Select Service</option>
                  <option value="Dental Care">Dental Care</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Diagnostics">Diagnostics</option>
                </select>
              </div>
              <div className="form-group">
                <input type="datetime-local" name="datetime" value={form.datetime} onChange={handleChange} />
              </div>
              <div className="form-group">
                <textarea name="message" placeholder="Message" rows="4" value={form.message} onChange={handleChange}></textarea>
              </div>
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
