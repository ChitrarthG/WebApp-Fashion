import React, { useEffect, useState, useCallback } from 'react';
import apiBaseUrl from '../config/api';
import ProductCard from './ProductCard';
import './CategoryPage.css';

const PRODUCTS_PER_PAGE = 20;

const CATEGORY_CONFIG = {
  ss26: {
    label: 'SS26 Collection',
    subtitle: 'Spring Summer 2026 — New Arrivals',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Blue', 'Pink', 'Yellow', 'Green', 'Floral'],
    occasions: [],
    bannerGradient: 'linear-gradient(135deg, #ddeeff 0%, #b8d4f8 100%)',
    breadcrumbPath: ['New Arrivals'],
    isNewOnly: true,
  },
  women: {
    label: 'Women',
    subtitle: "Ethnic Wear, Westernwear, Fusion & More",
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Blue', 'Red', 'Pink', 'Green', 'Yellow', 'Maroon', 'Teal'],
    occasions: ['Casual', 'Formal', 'Party', 'Festive', 'Western', 'Ethnic', 'Lounge'],
    bannerGradient: 'linear-gradient(135deg, #fce8f5 0%, #f0bfdc 100%)',
    breadcrumbPath: ['Women'],
  },
  men: {
    label: 'Men',
    subtitle: "Casual, Formal, Sportswear & Innerwear",
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'],
    colors: ['White', 'Black', 'Navy', 'Grey', 'Blue', 'Khaki', 'Olive', 'Pink'],
    occasions: ['Casual', 'Formal', 'Party', 'Workwear', 'Sportswear', 'Weekend'],
    bannerGradient: 'linear-gradient(135deg, #e8eeff 0%, #bfcff5 100%)',
    breadcrumbPath: ['Men'],
  },
  kids: {
    label: 'Kids',
    subtitle: 'Boys & Girls Clothing, School & Party Wear',
    sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y', '9Y', '10Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y'],
    colors: ['Blue', 'Red', 'Pink', 'Yellow', 'Green', 'White', 'Purple'],
    occasions: ['School', 'Party', 'Casual', 'Festival', 'Sports'],
    bannerGradient: 'linear-gradient(135deg, #fff8cc 0%, #fde080 100%)',
    breadcrumbPath: ['Kids'],
  },
  'home-living': {
    label: 'Home & Living',
    subtitle: 'Décor, Bedding, Kitchen & Bath Essentials',
    sizes: [],
    colors: ['White', 'Beige', 'Blue', 'Brown', 'Grey', 'Multicolor'],
    occasions: [],
    bannerGradient: 'linear-gradient(135deg, #e8f5e8 0%, #bfe0bf 100%)',
    breadcrumbPath: ['Home & Living'],
  },
  footwear: {
    label: 'Footwear',
    subtitle: 'Casuals, Formals, Sports & Sandals',
    sizes: ['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: ['Black', 'Brown', 'White', 'Tan', 'Navy'],
    occasions: ['Casual', 'Formal', 'Sports', 'Festive', 'Party'],
    bannerGradient: 'linear-gradient(135deg, #f5e8e0 0%, #e0c0a8 100%)',
    breadcrumbPath: ['Footwear'],
  },
  beauty: {
    label: 'Beauty',
    subtitle: 'Skincare, Makeup & Personal Care',
    sizes: [],
    colors: ['Natural', 'Pink', 'Red', 'Nude', 'Coral', 'Berry'],
    occasions: [],
    bannerGradient: 'linear-gradient(135deg, #ffe8f0 0%, #f5b8d0 100%)',
    breadcrumbPath: ['Beauty'],
  },
};

const SORT_OPTIONS = [
  { value: 'rating_desc',   label: 'Popularity' },
  { value: 'newest',        label: 'New Arrivals' },
  { value: 'price_asc',     label: 'Price: Low to High' },
  { value: 'price_desc',    label: 'Price: High to Low' },
  { value: 'discount_desc', label: 'Discount' },
];

const PRICE_RANGES = [
  { label: 'Under ₹500',      min: '', max: '500' },
  { label: '₹500 – ₹1,000',  min: '500', max: '1000' },
  { label: '₹1,000 – ₹2,000',min: '1000', max: '2000' },
  { label: 'Above ₹2,000',    min: '2000', max: '' },
];

const RATING_OPTIONS = [
  { value: '4.5', label: '4.5★ & above' },
  { value: '4',   label: '4★ & above' },
  { value: '3.5', label: '3.5★ & above' },
];

const DISCOUNT_OPTIONS = [
  { value: 10, label: '10% and above' },
  { value: 20, label: '20% and above' },
  { value: 30, label: '30% and above' },
  { value: 50, label: '50% and above' },
];

export default function CategoryPage({
  categorySlug,
  categoryQuery: presetCategoryQuery = '',
  subCategory: presetSubCategory = '',
  occasion: presetOccasion = '',
  onBack,
  onAddToCart,
  wishlist,
  onToggleWishlist,
  onViewDetails,
}) {
  const config = CATEGORY_CONFIG[categorySlug] || {
    label: categorySlug ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1) : 'Products',
    subtitle: '',
    sizes: [],
    colors: [],
  };

  const initParams = new URLSearchParams(window.location.search);
  const [sort, setSort] = useState(initParams.get('sort') || 'rating_desc');
  const [page, setPage] = useState(Math.max(1, Number(initParams.get('page') || 1)));
  const [categoryQuery, setCategoryQuery] = useState(initParams.get('category_query') || presetCategoryQuery);
  const [selectedSubCategory, setSelectedSubCategory] = useState(initParams.get('sub_category') || presetSubCategory);
  const [selectedOccasion, setSelectedOccasion] = useState(initParams.get('occasion') || presetOccasion);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [minRating, setMinRating] = useState('');
  const [minDiscount, setMinDiscount] = useState('');
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState(
    new Set(['price', 'size', 'occasion', 'color', 'discount'])
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSort(params.get('sort') || 'rating_desc');
    setPage(Math.max(1, Number(params.get('page') || 1)));
    setCategoryQuery(params.get('category_query') || presetCategoryQuery);
    setSelectedSubCategory(params.get('sub_category') || presetSubCategory);
    setSelectedOccasion(params.get('occasion') || presetOccasion);
    setMinDiscount('');
    setTotalCount(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [categorySlug, presetCategoryQuery, presetSubCategory, presetOccasion]);

  // Fetch products whenever filters/page/sort changes
  useEffect(() => {
    const params = new URLSearchParams();

    if (config.isNewOnly) {
      params.set('newArrivals', 'true');
    } else if (categorySlug) {
      params.set('category', categorySlug);
    }

    params.set('sort', sort);
    params.set('limit', String(PRODUCTS_PER_PAGE));
    params.set('offset', String((page - 1) * PRODUCTS_PER_PAGE));
    params.set('count', 'true');

    if (categoryQuery) params.set('search', categoryQuery);
    if (selectedSize) params.set('size', selectedSize);
    if (selectedColor) params.set('color', selectedColor);
    if (priceRange.min) params.set('minPrice', priceRange.min);
    if (priceRange.max) params.set('maxPrice', priceRange.max);
    if (minRating) params.set('minRating', minRating);
    if (minDiscount) params.set('minDiscount', String(minDiscount));

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiBaseUrl}/products?${params.toString()}`);
        const data = await res.json();
        const rows = Array.isArray(data) ? data : (data.rows || []);
        const total = data.total != null ? data.total : null;
        setProducts(rows);
        setTotalCount(total);
        setHasMore(rows.length === PRODUCTS_PER_PAGE);
      } catch (_) {
        setProducts([]);
        setTotalCount(null);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [categorySlug, sort, page, selectedSize, selectedColor, priceRange, minRating, minDiscount, categoryQuery, config.isNewOnly]);

  // Keep URL in sync with page + sort for shareable links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (categorySlug) params.set('category', categorySlug);
    params.set('page', String(page));
    params.set('sort', sort);

    if (categoryQuery) params.set('category_query', categoryQuery);
    else params.delete('category_query');

    if (selectedSubCategory) params.set('sub_category', selectedSubCategory);
    else params.delete('sub_category');

    if (selectedOccasion) params.set('occasion', selectedOccasion);
    else params.delete('occasion');

    if (minDiscount) params.set('min_discount', String(minDiscount));
    else params.delete('min_discount');

    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [categorySlug, page, sort, categoryQuery, selectedSubCategory, selectedOccasion, minDiscount]);

  const applyPresetQuery = useCallback((nextSubCategory, nextOccasion) => {
    const nextQuery = [nextSubCategory, nextOccasion].filter(Boolean).join(' ').trim();
    setSelectedSubCategory(nextSubCategory);
    setSelectedOccasion(nextOccasion);
    setCategoryQuery(nextQuery);
    setPage(1);
  }, []);

  const toggleSize = useCallback((size) => {
    setPage(1);
    setSelectedSize(prev => (prev === size ? '' : size));
  }, []);

  const toggleColor = useCallback((color) => {
    setPage(1);
    setSelectedColor(prev => (prev === color ? '' : color));
  }, []);

  const handlePriceRange = useCallback((min, max) => {
    setPage(1);
    setPriceRange(prev =>
      prev.min === min && prev.max === max ? { min: '', max: '' } : { min, max }
    );
  }, []);

  const clearAll = useCallback(() => {
    setCategoryQuery('');
    setSelectedSubCategory('');
    setSelectedOccasion('');
    setSelectedSize('');
    setSelectedColor('');
    setPriceRange({ min: '', max: '' });
    setMinRating('');
    setMinDiscount('');
    setPage(1);
  }, []);

  const toggleFilterGroup = useCallback((name) => {
    setExpandedFilters(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const handleDiscount = useCallback((value) => {
    setMinDiscount(prev => (prev === value ? '' : value));
    setPage(1);
  }, []);

  const toggleOccasion = useCallback((occ) => {
    setSelectedOccasion(prev => {
      const next = prev === occ ? '' : occ;
      const query = [selectedSubCategory, next].filter(Boolean).join(' ').trim();
      setCategoryQuery(query);
      return next;
    });
    setPage(1);
  }, [selectedSubCategory]);

  const activeFilterCount =
    (selectedSubCategory ? 1 : 0) +
    (selectedOccasion ? 1 : 0) +
    (selectedSize ? 1 : 0) +
    (selectedColor ? 1 : 0) +
    (priceRange.min || priceRange.max ? 1 : 0) +
    (minRating ? 1 : 0) +
    (minDiscount ? 1 : 0);

  // Dynamic page heading: "Shirts For Men", "Dresses For Women", "Kids", etc.
  const pageTitle = (() => {
    if (selectedSubCategory) {
      const baseLabel = config.label === 'Home & Living' ? 'Home' : config.label;
      return `${selectedSubCategory} For ${baseLabel}`;
    }
    if (selectedOccasion) {
      return `${selectedOccasion} ${config.label}`;
    }
    return config.label;
  })();

  // Build breadcrumb segments
  const breadcrumbSegments = [
    ...(config.breadcrumbPath || []),
    ...(selectedSubCategory ? [selectedSubCategory] : []),
  ];

  return (
    <div className="cat-page">
      {/* ── Breadcrumb ── */}
      <nav className="cat-breadcrumb">
        <button className="cat-breadcrumb__home" onClick={onBack}>Home</button>
        {breadcrumbSegments.map(seg => (
          <React.Fragment key={seg}>
            <span className="cat-breadcrumb__sep">›</span>
            <span className="cat-breadcrumb__current">{seg}</span>
          </React.Fragment>
        ))}
        {breadcrumbSegments.length === 0 && (
          <>
            <span className="cat-breadcrumb__sep">›</span>
            <span className="cat-breadcrumb__current">{config.label}</span>
          </>
        )}
      </nav>

      {/* ── Category Banner ── */}
      {config.bannerGradient && (
        <div
          className="cat-banner"
          style={{ background: config.bannerGradient }}
        >
          <div className="cat-banner__promo">
            <div className="cat-banner__promo-text">
              <span className="cat-banner__promo-title">{config.label}</span>
              {config.subtitle && (
                <span className="cat-banner__promo-sub">{config.subtitle}</span>
              )}
            </div>
            <div className="cat-banner__promo-badge">New Season</div>
          </div>
        </div>
      )}

      {/* ── Standalone page title ── */}
      <div className="cat-category-title">
        <h1 className="cat-category-title__text">{pageTitle}</h1>
      </div>

      <div className="cat-body">
        {/* ── Filter Sidebar ── */}
        <aside className="cat-sidebar">
          <div className="cat-sidebar__head">
            <span className="cat-filter-by-label">
              FILTER BY
              {activeFilterCount > 0 && (
                <em className="cat-filter-badge">{activeFilterCount}</em>
              )}
            </span>
            {activeFilterCount > 0 && (
              <button className="cat-clear-btn" onClick={clearAll}>CLEAR ALL</button>
            )}
          </div>

          {/* Price */}
          <div className="cat-filter-group">
            <button
              className="cat-filter-title cat-filter-accordion"
              onClick={() => toggleFilterGroup('price')}
            >
              PRICE
              <span className={`cat-chevron${expandedFilters.has('price') ? ' open' : ''}`}>&#8964;</span>
            </button>
            {expandedFilters.has('price') && (
              <div className="cat-filter-body">
                {PRICE_RANGES.map(r => (
                  <label key={r.label} className="cat-check-row">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange.min === r.min && priceRange.max === r.max}
                      onChange={() => handlePriceRange(r.min, r.max)}
                    />
                    {r.label}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Size */}
          {config.sizes?.length > 0 && (
            <div className="cat-filter-group">
              <button
                className="cat-filter-title cat-filter-accordion"
                onClick={() => toggleFilterGroup('size')}
              >
                SIZES
                <span className={`cat-chevron${expandedFilters.has('size') ? ' open' : ''}`}>&#8964;</span>
              </button>
              {expandedFilters.has('size') && (
                <div className="cat-filter-body">
                  <div className="cat-size-grid">
                    {config.sizes.map(s => (
                      <button
                        key={s}
                        className={`cat-size-btn${selectedSize === s ? ' active' : ''}`}
                        onClick={() => toggleSize(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Discount */}
          <div className="cat-filter-group">
            <button
              className="cat-filter-title cat-filter-accordion"
              onClick={() => toggleFilterGroup('discount')}
            >
              DISCOUNT
              <span className={`cat-chevron${expandedFilters.has('discount') ? ' open' : ''}`}>&#8964;</span>
            </button>
            {expandedFilters.has('discount') && (
              <div className="cat-filter-body">
                {DISCOUNT_OPTIONS.map(d => (
                  <label key={d.value} className="cat-check-row">
                    <input
                      type="radio"
                      name="discount"
                      checked={minDiscount === d.value}
                      onChange={() => handleDiscount(d.value)}
                    />
                    {d.label}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Occasion */}
          {config.occasions?.length > 0 && (
            <div className="cat-filter-group">
              <button
                className="cat-filter-title cat-filter-accordion"
                onClick={() => toggleFilterGroup('occasion')}
              >
                OCCASION
                <span className={`cat-chevron${expandedFilters.has('occasion') ? ' open' : ''}`}>&#8964;</span>
              </button>
              {expandedFilters.has('occasion') && (
                <div className="cat-filter-body">
                  {config.occasions.map(occ => (
                    <label key={occ} className="cat-check-row">
                      <input
                        type="checkbox"
                        checked={selectedOccasion === occ}
                        onChange={() => toggleOccasion(occ)}
                      />
                      {occ}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Colour */}
          {config.colors?.length > 0 && (
            <div className="cat-filter-group">
              <button
                className="cat-filter-title cat-filter-accordion"
                onClick={() => toggleFilterGroup('color')}
              >
                COLOR
                <span className={`cat-chevron${expandedFilters.has('color') ? ' open' : ''}`}>&#8964;</span>
              </button>
              {expandedFilters.has('color') && (
                <div className="cat-filter-body">
                  {config.colors.map(c => (
                    <label key={c} className="cat-check-row">
                      <input
                        type="radio"
                        name="color"
                        checked={selectedColor === c}
                        onChange={() => toggleColor(c)}
                      />
                      {c}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Rating */}
          <div className="cat-filter-group">
            <button
              className="cat-filter-title cat-filter-accordion"
              onClick={() => toggleFilterGroup('rating')}
            >
              CUSTOMER RATING
              <span className={`cat-chevron${expandedFilters.has('rating') ? ' open' : ''}`}>&#8964;</span>
            </button>
            {expandedFilters.has('rating') && (
              <div className="cat-filter-body">
                {RATING_OPTIONS.map(r => (
                  <label key={r.value} className="cat-check-row">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === r.value}
                      onChange={() => { setMinRating(r.value); setPage(1); }}
                    />
                    {r.label}
                  </label>
                ))}
                {minRating && (
                  <button className="cat-deselect" onClick={() => { setMinRating(''); setPage(1); }}>
                    ✕ Clear
                  </button>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* ── Main Content ── */}
        <div className="cat-main">
          {/* Top bar: count + sort only — heading is now above cat-body */}
          <div className="cat-topbar">
            <div className="cat-topbar__left">
              {totalCount != null ? (
                <span className="cat-result-count">{totalCount.toLocaleString()} Products</span>
              ) : (
                <span className="cat-result-count">&nbsp;</span>
              )}
            </div>
            <div className="cat-topbar__sort">
              <span className="cat-sort-label">SORT BY</span>
              <select
                value={sort}
                onChange={e => { setSort(e.target.value); setPage(1); }}
                className="cat-sort-select"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Shop by Size quick row */}
          {config.sizes?.length > 0 && (
            <div className="cat-shopby-size">
              <span className="cat-shopby-size__label">SHOP BY SIZE</span>
              <div className="cat-shopby-size__chips">
                {config.sizes.slice(0, 10).map(s => (
                  <button
                    key={s}
                    className={`cat-shopby-btn${selectedSize === s ? ' active' : ''}`}
                    onClick={() => toggleSize(s)}
                  >
                    {s}
                  </button>
                ))}
                {config.sizes.length > 10 && (
                  <span className="cat-shopby-more">+ {config.sizes.length - 10} MORE</span>
                )}
              </div>
            </div>
          )}

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="cat-chips">
              {selectedSubCategory && (
                <span className="cat-chip">
                  Category - {selectedSubCategory}
                  <button onClick={() => applyPresetQuery('', selectedOccasion)}>✕</button>
                </span>
              )}
              {selectedOccasion && (
                <span className="cat-chip">
                  Occasion - {selectedOccasion}
                  <button onClick={() => toggleOccasion(selectedOccasion)}>✕</button>
                </span>
              )}
              {selectedSize && (
                <span className="cat-chip">
                  Size: {selectedSize}
                  <button onClick={() => setSelectedSize('')}>✕</button>
                </span>
              )}
              {selectedColor && (
                <span className="cat-chip">
                  Colour: {selectedColor}
                  <button onClick={() => setSelectedColor('')}>✕</button>
                </span>
              )}
              {(priceRange.min || priceRange.max) && (
                <span className="cat-chip">
                  Price: {priceRange.min ? `₹${priceRange.min}` : '0'} –{' '}
                  {priceRange.max ? `₹${priceRange.max}` : '∞'}
                  <button onClick={() => setPriceRange({ min: '', max: '' })}>✕</button>
                </span>
              )}
              {minRating && (
                <span className="cat-chip">
                  {minRating}★ & above
                  <button onClick={() => setMinRating('')}>✕</button>
                </span>
              )}
              {minDiscount && (
                <span className="cat-chip">
                  {minDiscount}% & above off
                  <button onClick={() => setMinDiscount('')}>✕</button>
                </span>
              )}
              <button className="cat-chip cat-chip--clear" onClick={clearAll}>
                Clear All
              </button>
            </div>
          )}

          {/* Product grid */}
          {loading ? (
            <div className="cat-loading">
              <div className="cat-loading__spinner" />
              <span>Loading products…</span>
            </div>
          ) : products.length === 0 ? (
            <div className="cat-empty">
              <p>No products found for the selected filters.</p>
              {activeFilterCount > 0 && (
                <button onClick={clearAll}>Clear Filters</button>
              )}
            </div>
          ) : (
            <div className="cat-grid">
              {products.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={onAddToCart}
                  isWishlisted={wishlist?.includes(p.id)}
                  onToggleWishlist={onToggleWishlist}
                  onViewDetails={onViewDetails}
                  badgeLabel={p.is_new ? 'Just In' : null}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && products.length > 0 && (
            <div className="cat-pagination">
              <button
                className="cat-page-btn"
                disabled={page <= 1}
                onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                ‹ Prev
              </button>
              <span className="cat-page-info">Page {page}</span>
              <button
                className="cat-page-btn"
                disabled={!hasMore}
                onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                Next ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
