import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGridSkeleton = () => (
  <div className="product-grid">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="product-card-skeleton">
        <div className="skeleton-img skeleton-pulse" />
        <div className="skeleton-body">
          <div className="skeleton-line skeleton-pulse" style={{ width: '60%' }} />
          <div className="skeleton-line skeleton-pulse" style={{ width: '90%' }} />
          <div className="skeleton-line skeleton-pulse" style={{ width: '45%' }} />
        </div>
      </div>
    ))}
  </div>
);

const ProductGrid = ({ sectionNumber, title, subtitle, products, loading, onAddToCart, wishlist, onToggleWishlist, badgeLabel }) => {
  return (
    <section
      className="product-grid-section"
      id={title?.toLowerCase().replace(/\s+/g, '-')}
      title={sectionNumber || undefined}
    >
      <div className="container">
        <div className="section-header">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>

        {loading ? (
          <ProductGridSkeleton />
        ) : products.length === 0 ? (
          <div className="no-products">
            <span className="no-products-icon">🛍️</span>
            <p>No products available right now. Check back soon!</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                isWishlisted={wishlist?.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                badgeLabel={badgeLabel}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
