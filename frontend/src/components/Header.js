import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiHeart, FiMenu, FiSearch, FiShoppingBag, FiUser, FiX } from 'react-icons/fi';
import apiBaseUrl from '../config/api';
import TopUtilitiesBar from './TopUtilitiesBar';
import wordmark from '../assets/vayu-fashion-wordmark.svg';
import './Header.css';

const navItems = [
  { label: 'Women', type: 'category', value: 'women' },
  { label: 'Men', type: 'category', value: 'men' },
  { label: 'Kids', type: 'category', value: 'kids' },
  { label: 'Home & Living', type: 'category', value: 'home-living' },
  { label: 'Brands', type: 'section', value: 'brands' },
  { label: 'Sale', type: 'section', value: 'sale-spotlight' },
];

const emptySuggestions = { products: [], brands: [], categories: [] };

const Header = ({
  activeCategory = '',
  cartCount = 0,
  wishlistCount = 0,
  user = null,
  searchQuery = '',
  onCartClick,
  onLoginClick,
  onTrackOrderClick,
  onNavigateHome,
  onNavigateToCategory,
  onNavigateToSection,
  onViewProduct,
  onSearchSubmit,
}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState(emptySuggestions);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const rootRef = useRef(null);

  const totalSuggestionCount = useMemo(
    () => suggestions.products.length + suggestions.brands.length + suggestions.categories.length,
    [suggestions]
  );

  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const trimmedQuery = searchValue.trim();

    if (trimmedQuery.length < 2) {
      setSuggestions(emptySuggestions);
      setIsSearching(false);
      return undefined;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`${apiBaseUrl}/search/suggestions?q=${encodeURIComponent(trimmedQuery)}`);
        const data = await response.json();
        if (!cancelled) {
          setSuggestions({
            products: Array.isArray(data.products) ? data.products : [],
            brands: Array.isArray(data.brands) ? data.brands : [],
            categories: Array.isArray(data.categories) ? data.categories : [],
          });
          setIsSuggestionsOpen(true);
        }
      } catch (_) {
        if (!cancelled) {
          setSuggestions(emptySuggestions);
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    }, 220);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [searchValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setIsSuggestionsOpen(false);
        setIsMobileNavOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const resetSearch = () => {
    setSearchValue('');
    setSuggestions(emptySuggestions);
    setIsSuggestionsOpen(false);
  };

  const handleNavClick = (item) => {
    setIsMobileNavOpen(false);
    if (item.type === 'category') {
      onNavigateToCategory?.(item.value);
      return;
    }
    onNavigateToSection?.(item.value);
  };

  const handleSuggestionSelect = (type, value) => {
    setIsSuggestionsOpen(false);

    if (type === 'product') {
      onViewProduct?.(value.id);
      resetSearch();
      return;
    }

    if (type === 'category') {
      onNavigateToCategory?.(value.slug);
      resetSearch();
      return;
    }

    setSearchValue(value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmedQuery = searchValue.trim();
    if (!trimmedQuery) {
      return;
    }
    onSearchSubmit?.(trimmedQuery);
    setIsSuggestionsOpen(false);
  };

  return (
    <header className="fashion-header" ref={rootRef}>
      <TopUtilitiesBar onTrackOrderClick={onTrackOrderClick} />

      <div className="fashion-header-shell">
        <div className="container fashion-header-main">
          <button
            type="button"
            className="fashion-mobile-toggle"
            onClick={() => setIsMobileNavOpen((open) => !open)}
            aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileNavOpen}
          >
            {isMobileNavOpen ? <FiX /> : <FiMenu />}
          </button>

          <button type="button" className="fashion-brand" onClick={onNavigateHome} aria-label="Go to Vayu Fashion home page">
            <img src={wordmark} alt="Vayu Fashion" className="fashion-brand-wordmark-image" />
          </button>

          <nav className="fashion-nav fashion-nav--desktop" aria-label="Primary navigation">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`fashion-nav-link${item.type === 'category' && activeCategory === item.value ? ' is-active' : ''}`}
                onClick={() => handleNavClick(item)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="fashion-header-tools">
          <form className="fashion-search" onSubmit={handleSearchSubmit} role="search">
            <div className="fashion-search-box">
              <FiSearch className="fashion-search-icon" aria-hidden="true" />
              <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                onFocus={() => {
                  if (totalSuggestionCount > 0 || isSearching) {
                    setIsSuggestionsOpen(true);
                  }
                }}
                placeholder="Search"
                aria-label="Search products"
              />
              {searchValue && (
                <button
                  type="button"
                  className="fashion-search-clear"
                  onClick={resetSearch}
                  aria-label="Clear search"
                >
                  <FiX />
                </button>
              )}
            </div>

            {isSuggestionsOpen && (isSearching || totalSuggestionCount > 0) && (
              <div className="fashion-search-dropdown">
                {isSearching && <div className="fashion-search-state">Searching...</div>}

                {!isSearching && suggestions.products.length > 0 && (
                  <div className="fashion-search-group">
                    <p>Products</p>
                    {suggestions.products.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        className="fashion-search-item"
                        onClick={() => handleSuggestionSelect('product', product)}
                      >
                        <span>{product.name}</span>
                        <small>{product.brand || 'Vayu Fashion'}</small>
                      </button>
                    ))}
                  </div>
                )}

                {!isSearching && suggestions.categories.length > 0 && (
                  <div className="fashion-search-group">
                    <p>Categories</p>
                    {suggestions.categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        className="fashion-search-item fashion-search-item--compact"
                        onClick={() => handleSuggestionSelect('category', category)}
                      >
                        <span>{category.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {!isSearching && suggestions.brands.length > 0 && (
                  <div className="fashion-search-group">
                    <p>Brands</p>
                    <div className="fashion-search-chip-row">
                      {suggestions.brands.map((brand) => (
                        <button
                          key={brand}
                          type="button"
                          className="fashion-search-chip"
                          onClick={() => handleSuggestionSelect('brand', brand)}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>

          <div className="fashion-actions">
            <button type="button" className="fashion-icon-btn fashion-icon-btn--plain" aria-label="Wishlist">
              <FiHeart />
              {wishlistCount > 0 && <span className="fashion-count-badge">{wishlistCount}</span>}
            </button>

            <button
              type="button"
              className="fashion-icon-btn fashion-icon-btn--plain"
              onClick={onLoginClick}
              aria-label={user ? `Signed in as ${user.name || user.email}` : 'Open login'}
            >
              <FiUser />
            </button>

            <button
              type="button"
              className="fashion-icon-btn fashion-icon-btn--plain"
              onClick={onCartClick}
              aria-label="Open cart"
            >
              <FiShoppingBag />
              {cartCount > 0 && <span className="fashion-count-badge">{cartCount}</span>}
            </button>
          </div>
          </div>
        </div>

        <div className={`fashion-nav-bar${isMobileNavOpen ? ' is-open' : ''}`}>
          <div className="container fashion-nav-inner">
            <nav className="fashion-nav" aria-label="Primary navigation">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`fashion-nav-link${item.type === 'category' && activeCategory === item.value ? ' is-active' : ''}`}
                  onClick={() => handleNavClick(item)}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
