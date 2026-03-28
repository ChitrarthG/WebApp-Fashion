import React, { useEffect, useMemo, useState } from 'react';
import apiBaseUrl from '../config/api';
import ProductCard from './ProductCard';
import './SearchResultsPage.css';

const SORT_OPTIONS = [
  { value: 'rating_desc', label: 'Popularity' },
  { value: 'newest', label: 'New Arrivals' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'discount_desc', label: 'Discount' },
];

export default function SearchResultsPage({
  searchQuery,
  onBackHome,
  onAddToCart,
  wishlist,
  onToggleWishlist,
}) {
  const normalizedQuery = String(searchQuery || '').trim();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState('rating_desc');

  useEffect(() => {
    setSort('rating_desc');
  }, [normalizedQuery]);

  const requestQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (normalizedQuery) params.set('search', normalizedQuery);
    params.set('sort', sort);
    params.set('limit', '24');
    return params.toString();
  }, [normalizedQuery, sort]);

  useEffect(() => {
    if (!normalizedQuery) {
      setProducts([]);
      return;
    }

    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/products?${requestQuery}`);
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (_) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [normalizedQuery, requestQuery]);

  return (
    <section className="search-page">
      <nav className="search-page-breadcrumb" aria-label="Breadcrumb">
        <button type="button" className="search-page-breadcrumb-home" onClick={onBackHome}>
          Home
        </button>
        <span className="search-page-breadcrumb-sep">/</span>
        <span className="search-page-breadcrumb-current">Search</span>
      </nav>

      <div className="search-page-shell">
        <div className="search-page-hero">
          <p className="search-page-eyebrow">Search</p>
          <div className="search-page-heading-row">
            <div>
              <h1>Results for "{normalizedQuery || 'your search'}"</h1>
              <p>
                {normalizedQuery
                  ? `Browse the closest matches across our fashion catalog.`
                  : 'Enter a search term from the header to explore products.'}
              </p>
            </div>
            <label className="search-page-sort">
              <span>Sort by</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {!normalizedQuery ? (
          <div className="search-page-state">Enter a product name, brand, or category to start searching.</div>
        ) : loading ? (
          <div className="search-page-state">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="search-page-state search-page-state-empty">
            No products found for "{normalizedQuery}".
          </div>
        ) : (
          <>
            <div className="search-page-count">{products.length} products found</div>
            <div className="search-page-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  isWishlisted={wishlist?.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}