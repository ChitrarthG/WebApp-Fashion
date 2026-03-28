import React from 'react';
import './Hero.css';

const services = [
  { icon: '🩺', label: 'OP\nConsultation' },
  { icon: '🌿', label: 'Wellness\nClinic' },
  { icon: '💉', label: 'Vaccination\nCenter' },
  { icon: '🏥', label: 'Day Care\nCenter' },
  { icon: '🦷', label: 'Dental\nServices' },
];

const mvv = [
  {
    icon: '🎯',
    title: 'MISSION',
    text: 'Providing comprehensive, patient-centered care through innovative and compassionate services',
  },
  {
    icon: '✨',
    title: 'VISION',
    text: 'Empowering patients with comprehensive, personalized care for a lifetime from birth till old age',
  },
  {
    icon: '💎',
    title: 'VALUES',
    text: 'Compassion, Excellence, Patient-Centered, Teamwork, Innovation, Integrity, Empathy, and Kindness.',
  },
];

const Hero = () => {
  return (
    <section className="hero" id="home">

      {/* Services strip */}
      <div className="hero-services-strip">
        <div className="hero-services-track">
          {services.map((s, i) => (
            <React.Fragment key={i}>
              <div className="hero-service-item">
                <div className="hero-service-circle">
                  <span className="hero-service-icon">{s.icon}</span>
                </div>
                <p className="hero-service-label">{s.label}</p>
              </div>
              {i < services.length - 1 && (
                <div className="hero-service-connector">
                  <span className="connector-dot" />
                  <span className="connector-line" />
                  <span className="connector-dot" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main heading block */}
      <div className="hero-main">
        <span className="hero-welcome-badge">Welcome To</span>
        <h1 className="hero-title">Vayu Clinic</h1>
        <p className="hero-tagline">Your Healthcare Partner in Kondapur</p>
        <p className="hero-description">
          Vayu Clinic is a trusted multi-specialty clinic with pharmacy, labs and experienced doctors.
          Our board-certified specialists in <a href="#services" className="hero-desc-link">pediatrics</a>,{' '}
          <a href="#services" className="hero-desc-link">general medicine</a>,{' '}
          <a href="#services" className="hero-desc-link">dental</a> and{' '}
          <a href="#services" className="hero-desc-link">diagnostics</a> work together to provide comprehensive
          and coordinated care to patients of all ages — right here in Kondapur.
        </p>
        <div className="hero-buttons">
          <a href="#appointment" className="btn-primary">Book Appointment</a>
          <a href="tel:+917754929443" className="btn-secondary">Call Now</a>
        </div>
      </div>

      {/* Mission / Vision / Values */}
      <div className="hero-mvv">
        {mvv.map((item, i) => (
          <div className="hero-mvv-item" key={i}>
            <div className="hero-mvv-circle">
              <span className="hero-mvv-icon">{item.icon}</span>
            </div>
            <h3 className="hero-mvv-title">{item.title}</h3>
            <p className="hero-mvv-text">{item.text}</p>
          </div>
        ))}
      </div>

    </section>
  );
};

export default Hero;
