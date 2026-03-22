import React from 'react';
import './Services.css';

const Services = () => {
  const services = [
    {
      icon: '🦷',
      title: 'Dental Care',
      description: 'Painless dental treatments with modern equipment and experienced dentists.',
      link: '#dental'
    },
    {
      icon: '👨‍⚕️',
      title: 'General Medicine',
      description: 'Comprehensive healthcare services for all your medical needs.',
      link: '#medicine'
    },
    {
      icon: '👩‍⚕️',
      title: 'Pediatrics',
      description: 'Specialized care for children with gentle and patient doctors.',
      link: '#pediatrics'
    },
    {
      icon: '🩺',
      title: 'Diagnostics',
      description: 'Advanced diagnostic services for accurate health assessment.',
      link: '#diagnostics'
    },
    {
      icon: '💊',
      title: 'Pharmacy',
      description: 'Quality medicines and healthcare products available on-site.',
      link: '#pharmacy'
    },
    {
      icon: '🏥',
      title: 'Emergency Care',
      description: '24/7 emergency medical services when you need them most.',
      link: '#emergency'
    }
  ];

  return (
    <section className="services" id="services">
      <div className="container">
        <div className="services-header">
          <h2>What We Do</h2>
          <h3>Our Services</h3>
          <p>Multiple specialities, Single stop. Your healthcare partners providing comprehensive medical services.</p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">
                <span>{service.icon}</span>
              </div>
              <h4>{service.title}</h4>
              <p>{service.description}</p>
              <a href={service.link} className="service-link">Learn More →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
