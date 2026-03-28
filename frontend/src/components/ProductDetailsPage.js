import React, { useEffect, useMemo, useState } from 'react';
import apiBaseUrl from '../config/api';
import './ProductDetailsPage.css';

const GALLERY_BY_PRODUCT = {
  1: [
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&q=80&fit=crop',
  ],
  2: [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=80&fit=crop',
  ],
  3: [
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=80&fit=crop',
  ],
  4: [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&q=80&fit=crop',
  ],
  5: [
    'https://images.unsplash.com/photo-1623609163859-ca93c959b98a?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1000&q=80&fit=crop',
  ],
  6: [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000&q=80&fit=crop',
  ],
  7: [
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&q=80&fit=crop',
  ],
  8: [
    'https://images.unsplash.com/photo-1623609163859-ca93c959b98a?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1000&q=80&fit=crop',
  ],
  9: [
    'https://images.unsplash.com/photo-1506629905607-d405b7a83747?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1583496661160-fb5886a13d44?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=1000&q=80&fit=crop',
  ],
  10: [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1000&q=80&fit=crop',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000&q=80&fit=crop',
  ],
};

const ACCESSORY_KEYWORDS = [
  'bag', 'shoe', 'sneaker', 'sandals', 'sandal', 'boot', 'heel', 'watch', 'belt', 'wallet',
  'earring', 'necklace', 'ring', 'bracelet', 'sunglass', 'cap', 'hat',
];

const ACCESSORY_CATEGORIES = new Set(['footwear', 'jewelry', 'beauty', 'home-living']);

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

const getBrandLabel = (product) => {
  const name = String(product?.name || '').toLowerCase();
  const category = String(product?.category_slug || '').toLowerCase();
  const byKeyword = ACCESSORY_KEYWORDS.some((keyword) => name.includes(keyword));
  const byCategory = ACCESSORY_CATEGORIES.has(category);
  return byKeyword || byCategory ? 'PRODUCT' : 'PEOPLE';
};

const ProductDetailsPage = ({ productId, onBack, onAddToCart }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [galleryPage, setGalleryPage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [pinCode, setPinCode] = useState('500001');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!productId) return;
    let ignore = false;

    const loadProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${apiBaseUrl}/products/${productId}`);
        const data = await response.json();
        if (!response.ok) {
          if (!ignore) setError(data.error || 'Unable to load product.');
          return;
        }
        if (!ignore) {
          setProduct(data);
          setSelectedSize(data.sizes?.[0] || '');
          setSelectedColor(data.colors?.[0] || '');
          setGalleryPage(0);
          setQuantity(1);
          setDeliveryNote('');
        }
      } catch (_) {
        if (!ignore) setError('Unable to load product.');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadProduct();
    return () => {
      ignore = true;
    };
  }, [productId]);

  const gallery = useMemo(() => {
    if (!product) return [];
    const mapped = GALLERY_BY_PRODUCT[product.id] || [];
    const combined = product.image_url ? [product.image_url, ...mapped] : mapped;
    return Array.from(new Set(combined.filter(Boolean)));
  }, [product]);

  const galleryPages = useMemo(() => {
    const pageSize = 4;
    const pages = [];
    for (let i = 0; i < gallery.length; i += pageSize) {
      pages.push(gallery.slice(i, i + pageSize));
    }
    return pages.length > 0 ? pages : [[]];
  }, [gallery]);

  const currentGalleryPage = galleryPages[galleryPage] || [];

  useEffect(() => {
    setGalleryPage((current) => Math.min(current, Math.max(0, galleryPages.length - 1)));
  }, [galleryPages.length]);

  const canAdd = !!product && (!product.sizes?.length || !!selectedSize);

  const checkDelivery = () => {
    if (!/^\d{6}$/.test(pinCode.trim())) {
      setDeliveryNote('Enter a valid 6-digit pincode');
      return;
    }
    setDeliveryNote(`Delivery by tomorrow to ${pinCode.trim()}`);
  };

  const handleAdd = async () => {
    if (!product || !canAdd) return;
    if (!onAddToCart) return;
    setAdding(true);
    try {
      await onAddToCart(product, selectedSize, selectedColor, quantity);
    } finally {
      setAdding(false);
    }
  };

  return (
    <section className="product-details-page" aria-label="Product details">
      <div className="container">
        <button type="button" className="product-details-back" onClick={onBack}>
          Back to shopping
        </button>

        {loading && <div className="product-details-state">Loading product details...</div>}
        {!loading && error && <div className="product-details-state product-details-state--error">{error}</div>}

        {!loading && !error && product && (
          <>
            <nav className="product-details-breadcrumbs" aria-label="Breadcrumb">
              <a href="#shop">Home</a>
              <span>/</span>
              <a href={`#${product.category_slug || 'shop'}`}>{product.category_name || 'Catalog'}</a>
              <span>/</span>
              <strong>{product.name}</strong>
            </nav>

            <div className="product-details-layout">
              <div className="product-details-gallery">
                <div className="product-details-gallery-grid">
                  {currentGalleryPage.length > 0 ? (
                    currentGalleryPage.map((image, index) => (
                      <figure key={`${product.id}-${galleryPage}-${index}`} className="product-details-gallery-tile">
                        <img src={image} alt={`${product.name} view ${index + 1}`} loading="lazy" />
                      </figure>
                    ))
                  ) : (
                    <div className="product-details-image-fallback">Vayu Fashion</div>
                  )}
                </div>

                <div className="product-details-gallery-dots" aria-label="Gallery pages">
                  {galleryPages.map((_, index) => (
                    <button
                      key={`${product.id}-dot-${index}`}
                      type="button"
                      className={`product-details-gallery-dot${galleryPage === index ? ' is-active' : ''}`}
                      onClick={() => setGalleryPage(index)}
                      aria-label={`Show image set ${index + 1}`}
                    >
                      <span />
                    </button>
                  ))}
                </div>
              </div>

              <aside className="product-details-info">
                <p className="product-details-brand">{getBrandLabel(product)}</p>
                <h1>{product.name}</h1>

                <div className="product-details-rating-strip">
                  <span>â­</span>
                  <p>Be the first one to rate!</p>
                </div>

                <div className="product-details-price-row">
                  <strong>{formatPrice(product.price)}</strong>
                  {Number(product.mrp || 0) > Number(product.price || 0) && (
                    <span>{formatPrice(product.mrp)}</span>
                  )}
                </div>

                <p className="product-details-description">{product.description}</p>

                {!!product.sizes?.length && (
                  <div className="product-details-group">
                    <h2>Select Size</h2>
                    <div className="product-details-options">
                      {product.sizes.map((size) => (
                        <button
                          type="button"
                          key={size}
                          className={`product-details-chip${selectedSize === size ? ' is-active' : ''}`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <div className="product-details-size-hint">
                      <p>Your perfect size XXXXL.</p>
                      <button type="button">See alternative in your size</button>
                    </div>
                    <button type="button" className="product-details-size-chart">Size Chart</button>
                  </div>
                )}

                {!!product.colors?.length && (
                  <div className="product-details-group">
                    <h2>Select Color</h2>
                    <div className="product-details-options">
                      {product.colors.map((color) => (
                        <button
                          type="button"
                          key={color}
                          className={`product-details-chip${selectedColor === color ? ' is-active' : ''}`}
                          onClick={() => setSelectedColor(color)}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="product-details-offer-box">
                  <p className="offer-kicker">Offers</p>
                  <p><strong>EXTRAPT12</strong> - Extra 12% Off On Min. Purchase of Rs. 2699</p>
                </div>

                <div className="product-details-qty-box">
                  <span>Quantity</span>
                  <div className="product-details-stepper" role="group" aria-label="Select quantity">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    >
                      -
                    </button>
                    <strong>{quantity}</strong>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity((current) => Math.min(10, current + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="product-details-delivery-box">
                  <h2>Delivery Details</h2>
                  <div className="product-details-delivery-row">
                    <input
                      value={pinCode}
                      onChange={(event) => setPinCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter pincode"
                      inputMode="numeric"
                    />
                    <button type="button" onClick={checkDelivery}>Check</button>
                  </div>
                  {deliveryNote && <p className="product-details-delivery-note">{deliveryNote}</p>}
                </div>

                <div className="product-details-meta">
                  <span>Rating: {Number(product.rating || 0).toFixed(1)}</span>
                  <span>{product.review_count || 0} reviews</span>
                </div>

                <button
                  type="button"
                  className="product-details-add-btn"
                  onClick={handleAdd}
                  disabled={!canAdd || adding}
                >
                  {adding ? 'Adding...' : 'Add To Bag'}
                </button>
              </aside>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ProductDetailsPage;