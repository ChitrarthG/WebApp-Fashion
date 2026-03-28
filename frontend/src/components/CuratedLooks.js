import React, { useEffect, useMemo, useState } from 'react';
import { FiHeart, FiShoppingBag, FiX } from 'react-icons/fi';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import apiBaseUrl from '../config/api';
import './CuratedLooks.css';

const PRODUCT_MEDIA = {
  1: {
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=80&fit=crop',
    imagePosition: 'center top',
  },
  2: {
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=80&fit=crop',
    imagePosition: 'center top',
  },
  3: {
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=80&fit=crop',
    imagePosition: 'center top',
  },
  4: {
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=80&fit=crop',
    imagePosition: 'center top',
  },
  5: {
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=900&q=80&fit=crop',
    imagePosition: 'center top',
  },
  6: {
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80&fit=crop',
    imagePosition: 'center top',
  },
  7: {
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=900&q=80&fit=crop',
    imagePosition: 'center top',
  },
  8: {
    image: 'https://images.unsplash.com/photo-1623609163859-ca93c959b98a?w=900&q=80&fit=crop',
    imagePosition: 'center top',
  },
  9: {
    image: 'https://images.unsplash.com/photo-1506629905607-d405b7a83747?w=900&q=80&fit=crop',
    imagePosition: 'center top',
  },
  10: {
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80&fit=crop',
    imagePosition: 'center top',
  },
};

const LOOKS = [
  {
    id: 'look-01',
    title: 'Monochrome Layers',
    href: '#shop',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80&fit=crop',
    imagePosition: 'center top',
    productIds: [1, 6, 2, 10],
  },
  {
    id: 'look-02',
    title: 'Tailored Summer',
    href: '#shop',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&q=80&fit=crop',
    imagePosition: 'center top',
    productIds: [3, 7, 9, 4],
  },
  {
    id: 'look-03',
    title: 'Blue Stripe Edit',
    href: '#new-arrivals',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&q=80&fit=crop',
    imagePosition: 'center top',
    productIds: [2, 6, 1, 10],
  },
  {
    id: 'look-04',
    title: 'Festive Bloom',
    href: '#trending-now',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=80&fit=crop',
    imagePosition: 'center top',
    productIds: [10, 2, 1, 6],
  },
  {
    id: 'look-05',
    title: 'Sharp Occasion',
    href: '#shop',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1000&q=80&fit=crop',
    imagePosition: 'center top',
    productIds: [7, 3, 9, 4],
  },
];

const formatPrice = (value) => `â‚¹${Number(value || 0).toLocaleString('en-IN')}`;

const ACCESSORY_KEYWORDS = [
  'bag', 'shoe', 'sneaker', 'sandals', 'sandal', 'boot', 'heel', 'watch', 'belt', 'wallet',
  'earring', 'necklace', 'ring', 'bracelet', 'sunglass', 'cap', 'hat',
];

const ACCESSORY_CATEGORIES = new Set(['footwear', 'jewelry', 'beauty', 'home-living']);

const getPopupBrandLabel = (product) => {
  const title = String(product?.name || '').toLowerCase();
  const category = String(product?.category_slug || '').toLowerCase();
  const isAccessoryByKeyword = ACCESSORY_KEYWORDS.some((keyword) => title.includes(keyword));
  const isAccessoryByCategory = ACCESSORY_CATEGORIES.has(category);

  return isAccessoryByKeyword || isAccessoryByCategory ? 'Product' : 'People';
};

const CuratedLooks = ({ sectionNumber = '03', onAddToCart, wishlist = [], onToggleWishlist, onViewDetails }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [catalog, setCatalog] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [selectedLook, setSelectedLook] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [addingProductId, setAddingProductId] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  const cardPositions = ['edge-left', 'mid-left', 'center', 'mid-right', 'edge-right'];

  const catalogById = useMemo(
    () => new Map(catalog.map((product) => [product.id, product])),
    [catalog]
  );

  const visibleLooks = LOOKS.map((_, index) => LOOKS[(activeIndex + index) % LOOKS.length]);

  const selectedLookProducts = useMemo(() => {
    if (!selectedLook) return [];

    return selectedLook.productIds
      .map((productId) => catalogById.get(productId))
      .filter(Boolean)
      .map((product) => ({
        ...product,
        image_url: product.image_url || PRODUCT_MEDIA[product.id]?.image || '',
        imagePosition: PRODUCT_MEDIA[product.id]?.imagePosition || 'center top',
      }));
  }, [catalogById, selectedLook]);

  const rotateLooks = (direction) => {
    setActiveIndex((current) => (current + direction + LOOKS.length) % LOOKS.length);
  };

  const primeSelections = (product) => {
    setSelectedSizes((current) => {
      if (current[product.id]) return current;
      return { ...current, [product.id]: product.sizes?.[0] || '' };
    });
  };

  const openLook = (look) => {
    setSelectedLook(look);
    setDetailProduct(null);
    setDetailError('');
    setDetailLoading(false);
  };

  const closeLook = () => {
    setSelectedLook(null);
    setDetailProduct(null);
    setDetailError('');
    setDetailLoading(false);
  };

  const openProductDetails = async (productId) => {
    setDetailLoading(true);
    setDetailError('');

    try {
      const response = await fetch(`${apiBaseUrl}/products/${productId}`);
      const data = await response.json();

      if (!response.ok) {
        setDetailError(data.error || 'Could not load product details.');
        setDetailProduct(null);
        return;
      }

      const product = {
        ...data,
        image_url: data.image_url || PRODUCT_MEDIA[data.id]?.image || '',
        imagePosition: PRODUCT_MEDIA[data.id]?.imagePosition || 'center top',
      };
      primeSelections(product);
      setDetailProduct(product);
    } catch (_) {
      setDetailError('Could not load product details.');
      setDetailProduct(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAdd = async (product) => {
    if (!onAddToCart) return;

    setAddingProductId(product.id);
    try {
      const size = selectedSizes[product.id] || product.sizes?.[0] || '';
      const color = product.colors?.[0] || '';
      await onAddToCart(product, size, color);
    } finally {
      setAddingProductId(null);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadCatalog = async () => {
      setCatalogLoading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/products?limit=100&sort=rating_desc`);
        const data = await response.json();
        if (!ignore) {
          setCatalog(Array.isArray(data) ? data : []);
        }
      } catch (_) {
        if (!ignore) {
          setCatalog([]);
        }
      } finally {
        if (!ignore) {
          setCatalogLoading(false);
        }
      }
    };

    loadCatalog();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedLook) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeLook();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [selectedLook]);

  useEffect(() => {
    selectedLookProducts.forEach(primeSelections);
  }, [selectedLookProducts]);

  return (
    <section className="curated-looks-section" id="curated-looks" title={sectionNumber}>
      <div className="curated-looks-shell">
        <div className="curated-looks-header">
          <h2>Curated Looks For You</h2>
        </div>

        <div className="curated-looks-stage">
          <button
            type="button"
            className="curated-looks-arrow curated-looks-arrow--prev"
            onClick={() => rotateLooks(-1)}
            aria-label="Show previous curated looks"
          >
            <FaAngleLeft />
          </button>

          <div className="curated-looks-grid" aria-label="Curated looks carousel">
            {visibleLooks.map((look, index) => (
              <article
                key={`${look.id}-${cardPositions[index]}`}
                className={`curated-look-card curated-look-card--${cardPositions[index]}`}
              >
                <div className="curated-look-frame">
                  <div className="curated-look-media">
                    <img
                      src={look.image}
                      alt={look.title}
                      loading="lazy"
                      style={{ objectPosition: look.imagePosition }}
                    />
                  </div>

                  <button
                    type="button"
                    className="curated-look-cta"
                    onClick={() => openLook(look)}
                    aria-label={`Open ${look.title} products`}
                  >
                    <FiShoppingBag />
                    <span>Shop All</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="curated-looks-arrow curated-looks-arrow--next"
            onClick={() => rotateLooks(1)}
            aria-label="Show next curated looks"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>

      {selectedLook && (
        <div
          className="curated-looks-modal-overlay"
          onClick={closeLook}
          role="presentation"
        >
          <div
            className={`curated-looks-modal${detailProduct ? ' curated-looks-modal--expanded' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="curated-looks-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="curated-looks-modal-list">
              <div className="curated-looks-modal-header">
                <div>
                  <h3 id="curated-looks-modal-title">Products in the look</h3>
                  <p>{selectedLook.title}</p>
                </div>
                <button
                  type="button"
                  className="curated-looks-modal-close"
                  onClick={closeLook}
                  aria-label="Close products in the look"
                >
                  <FiX aria-hidden="true" />
                </button>
              </div>

              <div className="curated-looks-modal-scroller">
                <div className="curated-looks-modal-grid">
                  {catalogLoading ? (
                    <div className="curated-looks-modal-state">Loading products...</div>
                  ) : selectedLookProducts.length === 0 ? (
                    <div className="curated-looks-modal-state">No products available for this look.</div>
                  ) : (
                    selectedLookProducts.map((product) => (
                      <article key={product.id} className="curated-look-product-card">
                        <div className="curated-look-product-image-wrap">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              loading="lazy"
                              style={{ objectPosition: product.imagePosition }}
                            />
                          ) : (
                            <div className="curated-look-product-image-fallback">Vayu Fashion</div>
                          )}
                          <button
                            type="button"
                            className={`curated-look-product-heart${wishlist.includes(product.id) ? ' is-active' : ''}`}
                            aria-label={`Save ${product.name}`}
                            onClick={() => onToggleWishlist?.(product.id)}
                          >
                            <FiHeart />
                          </button>
                        </div>

                        <div className="curated-look-product-info">
                          <span className="curated-look-product-brand">{getPopupBrandLabel(product)}</span>
                          <h4>{product.name}</h4>
                          <strong>{formatPrice(product.price)}</strong>
                          <button
                            type="button"
                            className="curated-look-product-link"
                            onClick={() => {
                              if (onViewDetails) {
                                closeLook();
                                onViewDetails(product.id);
                              } else {
                                openProductDetails(product.id);
                              }
                            }}
                          >
                            View details
                          </button>
                          <button
                            type="button"
                            className="curated-look-product-add"
                            onClick={() => handleAdd(product)}
                            disabled={addingProductId === product.id}
                          >
                            {addingProductId === product.id ? 'Adding...' : 'Add To Bag'}
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </div>

            {(detailLoading || detailProduct || detailError) && (
              <aside className="curated-look-detail-panel" aria-label="Product details panel">
                {detailLoading && <div className="curated-look-detail-state">Loading details...</div>}

                {!detailLoading && detailError && (
                  <div className="curated-look-detail-state curated-look-detail-state--error">{detailError}</div>
                )}

                {!detailLoading && detailProduct && (
                  <>
                    <div className="curated-look-detail-media">
                      {detailProduct.image_url ? (
                        <img
                          src={detailProduct.image_url}
                          alt={detailProduct.name}
                          loading="lazy"
                          style={{ objectPosition: detailProduct.imagePosition }}
                        />
                      ) : (
                        <div className="curated-look-product-image-fallback curated-look-product-image-fallback--large">Vayu Fashion</div>
                      )}
                    </div>

                    <div className="curated-look-detail-body">
                      <span className="curated-look-detail-brand">{getPopupBrandLabel(detailProduct)}</span>
                      <h4>{detailProduct.name}</h4>
                      <div className="curated-look-detail-meta">
                        <strong>{formatPrice(detailProduct.price)}</strong>
                        {detailProduct.mrp > detailProduct.price && (
                          <span>{formatPrice(detailProduct.mrp)}</span>
                        )}
                        <em>{Number(detailProduct.rating || 0).toFixed(1)} rating</em>
                      </div>
                      <p>{detailProduct.description}</p>

                      {!!detailProduct.sizes?.length && (
                        <div className="curated-look-detail-group">
                          <span>Size</span>
                          <div className="curated-look-detail-chips">
                            {detailProduct.sizes.map((size) => (
                              <button
                                key={size}
                                type="button"
                                className={`curated-look-detail-chip${selectedSizes[detailProduct.id] === size ? ' is-active' : ''}`}
                                onClick={() => setSelectedSizes((current) => ({ ...current, [detailProduct.id]: size }))}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {!!detailProduct.colors?.length && (
                        <div className="curated-look-detail-group">
                          <span>Colors</span>
                          <div className="curated-look-detail-swatches">
                            {detailProduct.colors.map((color) => (
                              <span key={color} className="curated-look-detail-swatch">{color}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="curated-look-detail-footer">
                        <span>{detailProduct.review_count || 0} reviews</span>
                        <button
                          type="button"
                          className="curated-look-detail-add"
                          onClick={() => handleAdd(detailProduct)}
                          disabled={addingProductId === detailProduct.id}
                        >
                          {addingProductId === detailProduct.id ? 'Adding...' : 'Add To Bag'}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </aside>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default CuratedLooks;