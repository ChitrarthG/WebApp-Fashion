import React, { useState } from 'react';
import './ProductCard.css';

const PLACEHOLDER_COLORS = [
  'linear-gradient(135deg, #f7f9fc 0%, #edf2f8 100%)',
  'linear-gradient(135deg, #f8fafc 0%, #eef3f9 100%)',
  'linear-gradient(135deg, #f6f8fb 0%, #edf1f7 100%)',
  'linear-gradient(135deg, #f9fbfd 0%, #eef4fa 100%)',
  'linear-gradient(135deg, #f7f9fc 0%, #eaf0f7 100%)',
  'linear-gradient(135deg, #f8fafc 0%, #edf2f8 100%)',
];

const ProductCard = ({ product, onAddToCart, isWishlisted, onToggleWishlist, badgeLabel }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [adding, setAdding] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const sizes = product.sizes || [];
  const hasImage = product.image_url;
  const placeholderBg = PLACEHOLDER_COLORS[product.id % PLACEHOLDER_COLORS.length];

  const discountPct = product.discount_pct || (product.mrp && product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0);

  const handleAddToCart = async () => {
    if (sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    setAdding(true);
    await onAddToCart(product, selectedSize, '');
    setAdding(false);
    setSelectedSize('');
  };

  return (
    <div className="product-card">
      {/* Badge */}
      {badgeLabel && <span className={`product-badge badge-${badgeLabel.toLowerCase()}`}>{badgeLabel}</span>}
      {discountPct > 0 && <span className="discount-badge">{discountPct}% OFF</span>}

      {/* Image */}
      <div className="product-image-wrap">
        {hasImage ? (
          <img src={product.image_url} alt={product.name} className="product-img" loading="lazy" />
        ) : (
          <div className="product-placeholder" style={{ background: placeholderBg }}>
            <span className="placeholder-icon">
              {product.category_name === 'Women' ? 'ðŸ‘—' :
               product.category_name === 'Men' ? 'ðŸ‘”' :
               product.category_name === 'Kids' ? 'ðŸ§’' : 'ðŸ›ï¸'}
            </span>
          </div>
        )}
        {/* Wishlist heart */}
        <button
          className={`wishlist-btn${isWishlisted ? ' wishlisted' : ''}`}
          onClick={() => onToggleWishlist(product.id)}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isWishlisted ? 'â™¥' : 'â™¡'}
        </button>
      </div>

      {/* Info */}
      <div className="product-info">
        <div className="product-brand">{product.brand || 'Vayu Fashion'}</div>
        <h3 className="product-name">{product.name}</h3>

        {/* Rating */}
        <div className="product-rating">
          <span className="rating-stars">{'â˜…'.repeat(Math.round(product.rating || 4))}</span>
          <span className="rating-count">({product.review_count || 0})</span>
        </div>

        {/* Price */}
        <div className="product-price-row">
          <span className="product-price">â‚¹{Number(product.price).toLocaleString('en-IN')}</span>
          {product.mrp && product.mrp > product.price && (
            <span className="product-mrp">â‚¹{Number(product.mrp).toLocaleString('en-IN')}</span>
          )}
          {discountPct > 0 && <span className="product-discount">({discountPct}% off)</span>}
        </div>

        {/* Sizes */}
        {sizes.length > 0 && (
          <div className={`size-selector${sizeError ? ' error' : ''}`}>
            <span className="size-label">{sizeError ? 'Select a size!' : 'Size:'}</span>
            <div className="size-options">
              {sizes.map(size => (
                <button
                  key={size}
                  className={`size-chip${selectedSize === size ? ' selected' : ''}`}
                  onClick={() => { setSelectedSize(size); setSizeError(false); }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add to cart */}
        <button
          className={`add-to-cart-btn${adding ? ' adding' : ''}`}
          onClick={handleAddToCart}
          disabled={adding}
        >
          {adding ? 'Adding...' : 'ðŸ›’ Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
