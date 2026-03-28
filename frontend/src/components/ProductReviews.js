import React, { useEffect, useState } from 'react';
import apiBaseUrl from '../config/api';
import './ProductReviews.css';

const reviewLabels = [
  'Studio Pick',
  'Urban Edit',
  'Style Note',
  'Trend Select',
  'Daily Muse',
  'Signature Find',
  'Fresh Wardrobe',
  'Modern Thread'
];

const getStableLabel = (review) => {
  const seed = String(review?.id || review?.name || 'review');
  const hash = [...seed].reduce((total, char) => total + char.charCodeAt(0), 0);
  return reviewLabels[hash % reviewLabels.length];
};

const sanitizeReviewCopy = (text, fallbackLabel) => {
  if (!text) return '';
  return text.replace(/pantaloons?/gi, fallbackLabel);
};

const ProductReviews = ({ sectionNumber = '09' }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/reviews/highlights`);
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (_) {
        setReviews([]);
      }
    };
    load();
  }, []);

  return (
    <section className="product-reviews" id="reviews" title={sectionNumber}>
      <div className="container">
        <div className="section-header">
          <h2>Product Reviews</h2>
          <p>Real feedback from shoppers</p>
        </div>

        <div className="review-grid">
          {reviews.map((r) => {
            const displayLabel = getStableLabel(r);

            return (
              <article className="review-card" key={r.id}>
                <div className="review-top">
                  <h4>{sanitizeReviewCopy(r.name, displayLabel)}</h4>
                  <span>{'★'.repeat(Math.round(Number(r.rating || 4)))}</span>
                </div>
                <p className="review-brand">{sanitizeReviewCopy(r.brand || displayLabel, displayLabel)}</p>
                <p className="review-text">"{sanitizeReviewCopy(r.review_text, displayLabel)}"</p>
                <p className="review-count">{r.review_count} reviews</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
