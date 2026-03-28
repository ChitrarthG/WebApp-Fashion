import React, { useEffect, useMemo, useState } from 'react';
import apiBaseUrl from '../config/api';
import ProductCard from './ProductCard';
import './ShopExplorer.css';

const defaultFilters = {
  category: '',
  minPrice: '',
  maxPrice: '',
  size: '',
  color: '',
  minRating: '',
  sort: 'newest',
};

const ShopExplorer = ({ sectionNumber = '08', onAddToCart, wishlist, onToggleWishlist, initialCategory = '' }) => {
  const [filters, setFilters] = useState({ ...defaultFilters, category: initialCategory });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync when parent navigates to a different category
  useEffect(() => {
    setFilters({ ...defaultFilters, category: initialCategory });
  }, [initialCategory]);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (String(value).trim()) params.set(key, value);
    });
    params.set('limit', '16');
    return params.toString();
  }, [filters]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiBaseUrl}/products?${query}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (_) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [query]);

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <section id="shop" className="shop-explorer" title={sectionNumber}>
      <div className="container">
        <div className="section-header">
          <h2>Explore Products</h2>
          <p>Use filters to quickly find your style</p>
        </div>

        <div className="shop-layout">
          <aside className="filters-panel">
            <div className="filters-head">
              <h3>Filters</h3>
              <button className="clear-btn" onClick={() => setFilters(defaultFilters)}>Clear</button>
            </div>

            <label>
              Category
              <select value={filters.category} onChange={(e) => updateFilter('category', e.target.value)}>
                <option value="">All</option>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="kids">Kids</option>
                <option value="beauty">Beauty</option>
                <option value="home-living">Home & Living</option>
                <option value="footwear">Footwear</option>
                <option value="jewelry">Jewelry</option>
                <option value="innerwear">Innerwear</option>
                <option value="character-shop">Character Shop</option>
                <option value="sale">Sale</option>
              </select>
            </label>

            <div className="range-row">
              <label>
                Min Price
                <input type="number" value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} placeholder="0" />
              </label>
              <label>
                Max Price
                <input type="number" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} placeholder="5000" />
              </label>
            </div>

            <div className="range-row">
              <label>
                Size
                <select value={filters.size} onChange={(e) => updateFilter('size', e.target.value)}>
                  <option value="">Any</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </label>
              <label>
                Color
                <input value={filters.color} onChange={(e) => updateFilter('color', e.target.value)} placeholder="Blue" />
              </label>
            </div>

            <div className="range-row">
              <label>
                Min Rating
                <select value={filters.minRating} onChange={(e) => updateFilter('minRating', e.target.value)}>
                  <option value="">Any</option>
                  <option value="4">4★ & above</option>
                  <option value="4.3">4.3★ & above</option>
                  <option value="4.5">4.5★ & above</option>
                </select>
              </label>
              <label>
                Sort By
                <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating_desc">Top Rated</option>
                  <option value="discount_desc">Best Discount</option>
                </select>
              </label>
            </div>
          </aside>

          <div className="shop-results">
            {loading ? (
              <div className="shop-loading">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="shop-empty">No products found for selected filters.</div>
            ) : (
              <div className="shop-grid">
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopExplorer;
