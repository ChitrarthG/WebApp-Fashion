import React from "react";
import "./Testimonials.css";

const reviews = [
  { id: 1, name: "Priya Sharma", location: "Mumbai", rating: 5, text: "Amazing quality and super fast delivery! The kurta set I ordered fits perfectly and the fabric is so comfortable. Will definitely shop again!", avatar: "P", product: "Embroidered Kurta Set" },
  { id: 2, name: "Rahul Mehta", location: "Delhi", rating: 5, text: "Great collection for men. Got a formal shirt and slim fit chinos — both look and feel premium. The packaging was also very neat!", avatar: "R", product: "Slim Fit Chinos" },
  { id: 3, name: "Ananya Reddy", location: "Hyderabad", rating: 4, text: "Ordered the floral wrap dress for a wedding. Got so many compliments! The return process was also very smooth when I needed a size exchange.", avatar: "A", product: "Floral Wrap Dress" },
  { id: 4, name: "Karthik Nair", location: "Bangalore", rating: 5, text: "Best fashion app experience! Easy to navigate, great discounts and the kids dungaree set is absolutely adorable. My daughter loves it!", avatar: "K", product: "Kids Dungaree Set" },
  { id: 5, name: "Sneha Patel", location: "Ahmedabad", rating: 4, text: "The anarkali suit arrived ahead of schedule and the embroidery work is stunning. Exactly as shown in the pictures. Very happy with my purchase!", avatar: "S", product: "Anarkali Suit" },
  { id: 6, name: "Vikram Gupta", location: "Pune", rating: 5, text: "Stylish collection at reasonable prices. The graphic tee is super comfy and the color hasn't faded after multiple washes. Impressed!", avatar: "V", product: "Graphic Print T-Shirt" },
];

const StarRating = ({ count }) => (
  <div className="stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < count ? "star filled" : "star"}></span>
    ))}
  </div>
);

const Testimonials = ({ sectionNumber = '10' }) => (
  <section className="testimonials-section" id="testimonials" title={sectionNumber}>
    <div className="container">
      <div className="section-header">
        <h2>What Our <span>Customers Say</span></h2>
        <p>Real reviews from real shoppers who love Vayu Fashion</p>
      </div>

      <div className="reviews-grid">
        {reviews.map(review => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="reviewer-avatar">{review.avatar}</div>
              <div className="reviewer-info">
                <div className="reviewer-name">{review.name}</div>
                <div className="reviewer-location"> {review.location}</div>
              </div>
            </div>
            <StarRating count={review.rating} />
            <p className="review-text">{review.text}</p>
            <div className="review-product">Purchased: {review.product}</div>
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <div className="trust-badges">
        <div className="trust-badge"><span></span><span>Secure Payments</span></div>
        <div className="trust-badge"><span></span><span>Fast Delivery</span></div>
        <div className="trust-badge"><span></span><span>Easy Returns</span></div>
        <div className="trust-badge"><span></span><span>100% Genuine Products</span></div>
        <div className="trust-badge"><span></span><span>24/7 Support</span></div>
      </div>
    </div>
  </section>
);

export default Testimonials;
