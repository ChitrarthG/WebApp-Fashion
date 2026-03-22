import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Arav Rachakonda',
      rating: 4,
      text: 'Painless dental clinic in Kondapur. Very good reception. Doctor is good and patiently explained the issue. Do\'s and don\'ts well explained.',
      service: 'Dental Care'
    },
    {
      name: 'Chandra Shekar',
      rating: 4,
      text: 'Dr.Sai Kiran Thipparthi garu is the best physician and my go to doctor for any illness. Thank you for your selfless service.',
      service: 'General Medicine'
    },
    {
      name: 'Srikanth Raj Malekar',
      rating: 4,
      text: 'Doctors are very kind and supportive. They listen to patients carefully, give more time, and provide clear understanding of the issue.',
      service: 'Family Care'
    },
    {
      name: 'Lalith Mohan Tummalapalli',
      rating: 5,
      text: 'Excellent service and professional staff. Highly recommended for quality healthcare services.',
      service: 'General Care'
    }
  ];

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="testimonials-header">
          <h2>Happy Patients</h2>
          <h3>Testimonials</h3>
          <p>What our patients say about our services</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-rating">
                <span className="stars">{renderStars(testimonial.rating)}</span>
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <h4>{testimonial.name}</h4>
                <span className="service-tag">{testimonial.service}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="google-reviews-link">
          <a href="https://g.page/r/CSln2syp4QJXEBM/review" target="_blank" rel="noopener noreferrer" className="review-btn">
            ⭐ Review us on Google
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
