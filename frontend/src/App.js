import React from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import BrandsSection from './components/BrandsSection';
import VideoSection from './components/VideoSection';
import CuratedLooks from './components/CuratedLooks';
import ProductGrid from './components/ProductGrid';
import ShopExplorer from './components/ShopExplorer';
import CategoryPage from './components/CategoryPage';
import ProductDetailsPage from './components/ProductDetailsPage';
import ProductReviews from './components/ProductReviews';
import SearchResultsPage from './components/SearchResultsPage';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import AdminPortal from './components/AdminPortal';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import CheckoutModal from './components/CheckoutModal';
import LoginModal from './components/LoginModal';
import TrackOrderModal from './components/TrackOrderModal';
import ChatbotWidget from './components/ChatbotWidget';
import apiBaseUrl from './config/api';

const STORAGE_KEYS = {
  cart: 'vayuhub_cart',
  wishlist: 'vayuhub_wishlist',
  user: 'vayuhub_user',
};

const readStoredValue = (key, fallback) => {
  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch (_) {
    return fallback;
  }
};

const readRouteFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const productParam = Number.parseInt(params.get('product') || '', 10);

  return {
    pathname: window.location.pathname,
    isAdmin: params.get('admin') === '1',
    category: params.get('category') || '',
    categoryQuery: params.get('category_query') || '',
    subCategory: params.get('sub_category') || '',
    occasion: params.get('occasion') || '',
    productId: Number.isInteger(productParam) && productParam > 0 ? productParam : null,
    searchQuery: window.location.pathname === '/c/search' || params.get('search_query')
      ? params.get('search_query') || ''
      : '',
  };
};

function App() {
  const basePathRef = React.useRef(window.location.pathname === '/c/search' ? '/' : (window.location.pathname || '/'));
  const [route, setRoute] = React.useState(readRouteFromUrl);
  const [featuredProducts, setFeaturedProducts] = React.useState([]);
  const [newArrivalProducts, setNewArrivalProducts] = React.useState([]);
  const [saleProducts, setSaleProducts] = React.useState([]);
  const [homeLoading, setHomeLoading] = React.useState(true);
  const [wishlist, setWishlist] = React.useState(() => readStoredValue(STORAGE_KEYS.wishlist, []));
  const [cartItems, setCartItems] = React.useState(() => readStoredValue(STORAGE_KEYS.cart, []));
  const [user, setUser] = React.useState(() => readStoredValue(STORAGE_KEYS.user, null));
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = React.useState(false);

  React.useEffect(() => {
    const syncRouteFromUrl = () => {
      setRoute(readRouteFromUrl());
    };

    window.addEventListener('popstate', syncRouteFromUrl);
    return () => {
      window.removeEventListener('popstate', syncRouteFromUrl);
    };
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist));
  }, [wishlist]);

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cartItems));
  }, [cartItems]);

  React.useEffect(() => {
    if (user) {
      window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.user);
    }
  }, [user]);

  React.useEffect(() => {
    let cancelled = false;

    const loadHomeProducts = async () => {
      setHomeLoading(true);
      try {
        const [featuredResponse, newArrivalsResponse, saleResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/products/featured`),
          fetch(`${apiBaseUrl}/products/new-arrivals`),
          fetch(`${apiBaseUrl}/products/sale`),
        ]);

        const [featuredData, newArrivalsData, saleData] = await Promise.all([
          featuredResponse.json(),
          newArrivalsResponse.json(),
          saleResponse.json(),
        ]);

        if (!cancelled) {
          setFeaturedProducts(Array.isArray(featuredData) ? featuredData : []);
          setNewArrivalProducts(Array.isArray(newArrivalsData) ? newArrivalsData : []);
          setSaleProducts(Array.isArray(saleData) ? saleData : []);
        }
      } catch (_) {
        if (!cancelled) {
          setFeaturedProducts([]);
          setNewArrivalProducts([]);
          setSaleProducts([]);
        }
      } finally {
        if (!cancelled) {
          setHomeLoading(false);
        }
      }
    };

    loadHomeProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const cartCount = React.useMemo(
    () => cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0),
    [cartItems]
  );

  const pushRoute = React.useCallback((nextRoute) => {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const nextPathname = nextRoute.searchQuery ? '/c/search' : basePathRef.current;

    params.delete('category');
    params.delete('product');
    params.delete('search_query');
    params.delete('page');
    params.delete('sort');
    params.delete('category_query');
    params.delete('sub_category');
    params.delete('occasion');

    if (nextRoute.category) {
      params.set('category', nextRoute.category);
    }

    if (nextRoute.productId) {
      params.set('product', String(nextRoute.productId));
    }

    if (nextRoute.searchQuery) {
      params.set('search_query', nextRoute.searchQuery);
    }

    if (nextRoute.page) {
      params.set('page', String(nextRoute.page));
    }

    if (nextRoute.sort) {
      params.set('sort', nextRoute.sort);
    }

    if (nextRoute.categoryQuery) {
      params.set('category_query', nextRoute.categoryQuery);
    }

    if (nextRoute.subCategory) {
      params.set('sub_category', nextRoute.subCategory);
    }

    if (nextRoute.occasion) {
      params.set('occasion', nextRoute.occasion);
    }

    window.history.pushState({}, '', `${nextPathname}?${params.toString()}`);
    setRoute(readRouteFromUrl());
  }, []);

  const scrollToSection = React.useCallback((sectionId) => {
    window.setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }, []);

  const handleNavigateHome = React.useCallback(() => {
    window.location.assign('http://localhost:3000/');
  }, []);

  const handleNavigateToCategory = React.useCallback((categorySlug, listingPreset = {}) => {
    pushRoute({ category: categorySlug, ...listingPreset });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pushRoute]);

  const handleNavigateToSection = React.useCallback((sectionId) => {
    pushRoute({});
    scrollToSection(sectionId);
  }, [pushRoute, scrollToSection]);

  const handleViewProduct = React.useCallback((productId) => {
    pushRoute({ category: route.category, productId });
  }, [pushRoute, route.category]);

  const handleSearchSubmit = React.useCallback((searchQuery) => {
    pushRoute({ searchQuery });
  }, [pushRoute]);

  const handleAddToCart = React.useCallback(async (product, size = '', color = '', quantity = 1) => {
    const safeQuantity = Math.max(1, Number(quantity || 1));

    setCartItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (item) => item.product_id === product.id && item.size === size && item.color === color
      );

      if (existingIndex >= 0) {
        return currentItems.map((item, index) => (
          index === existingIndex
            ? { ...item, quantity: item.quantity + safeQuantity }
            : item
        ));
      }

      return [
        {
          id: `${product.id}-${size || 'default'}-${color || 'default'}`,
          product_id: product.id,
          name: product.name,
          brand: product.brand || 'Vayu Fashion',
          price: product.price,
          image_url: product.image_url || '',
          size,
          color,
          quantity: safeQuantity,
        },
        ...currentItems,
      ];
    });

    setIsCartOpen(true);
  }, []);

  const handleRemoveFromCart = React.useCallback((cartItemId) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== cartItemId));
  }, []);

  const handleUpdateCartQuantity = React.useCallback((cartItemId, nextQuantity) => {
    setCartItems((currentItems) => currentItems.map((item) => (
      item.id === cartItemId
        ? { ...item, quantity: Math.max(1, Number(nextQuantity || 1)) }
        : item
    )));
  }, []);

  const handleToggleWishlist = React.useCallback((productId) => {
    setWishlist((currentWishlist) => (
      currentWishlist.includes(productId)
        ? currentWishlist.filter((id) => id !== productId)
        : [productId, ...currentWishlist]
    ));
  }, []);

  const handleLoginSuccess = React.useCallback((userData) => {
    setUser(userData);
  }, []);

  const handleCheckout = React.useCallback(() => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, []);

  const handleOrderSuccess = React.useCallback(() => {
    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsTrackOrderOpen(true);
  }, []);

  const homeView = (
    <div className="home-sections">
      <Hero sectionNumber="01" />
      <Services sectionNumber="02" onNavigateToCategory={handleNavigateToCategory} />

      <CuratedLooks
        sectionNumber="04"
        onAddToCart={handleAddToCart}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        onViewDetails={handleViewProduct}
      />

      <div id="brands">
        <BrandsSection sectionNumber="03" />
      </div>

      <div id="videos">
        <VideoSection sectionNumber="05" />
      </div>

      <ProductGrid
        sectionNumber="06"
        title="New Arrivals"
        subtitle="Fresh drops across women, men, kids and more"
        products={newArrivalProducts}
        loading={homeLoading}
        onAddToCart={handleAddToCart}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        badgeLabel="New"
      />

      <ProductGrid
        sectionNumber="07"
        title="Trending Now"
        subtitle="Editor-curated picks getting all the attention"
        products={featuredProducts}
        loading={homeLoading}
        onAddToCart={handleAddToCart}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        badgeLabel="Hot"
      />

      <ProductGrid
        sectionNumber="08"
        title="Sale Spotlight"
        subtitle="Discounted favorites worth grabbing before they are gone"
        products={saleProducts}
        loading={homeLoading}
        onAddToCart={handleAddToCart}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        badgeLabel="Sale"
      />

      <ShopExplorer
        sectionNumber="09"
        onAddToCart={handleAddToCart}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
      />

      <ProductReviews sectionNumber="10" />
      <Testimonials sectionNumber="11" />
      <Contact sectionNumber="12" />
    </div>
  );

  return (
    <div className="App">
      {route.isAdmin ? (
        <AdminPortal />
      ) : (
        <>
          <div className="site-shell">
            <Header
              activeCategory={route.category}
              cartCount={cartCount}
              wishlistCount={wishlist.length}
              user={user}
              searchQuery={route.searchQuery}
              onCartClick={() => setIsCartOpen(true)}
              onLoginClick={() => setIsLoginOpen(true)}
              onTrackOrderClick={() => setIsTrackOrderOpen(true)}
              onNavigateHome={handleNavigateHome}
              onNavigateToCategory={handleNavigateToCategory}
              onNavigateToSection={handleNavigateToSection}
              onViewProduct={handleViewProduct}
              onSearchSubmit={handleSearchSubmit}
            />

            <main>
              {route.productId ? (
                <ProductDetailsPage
                  productId={route.productId}
                  onBack={route.category ? () => handleNavigateToCategory(route.category) : handleNavigateHome}
                  onAddToCart={handleAddToCart}
                />
              ) : route.searchQuery ? (
                <SearchResultsPage
                  searchQuery={route.searchQuery}
                  onBackHome={handleNavigateHome}
                  onAddToCart={handleAddToCart}
                  wishlist={wishlist}
                  onToggleWishlist={handleToggleWishlist}
                />
              ) : route.category ? (
                <CategoryPage
                  categorySlug={route.category}
                  categoryQuery={route.categoryQuery}
                  subCategory={route.subCategory}
                  occasion={route.occasion}
                  onBack={handleNavigateHome}
                  onAddToCart={handleAddToCart}
                  wishlist={wishlist}
                  onToggleWishlist={handleToggleWishlist}
                  onViewDetails={handleViewProduct}
                />
              ) : (
                homeView
              )}
            </main>

            <Footer />
          </div>

          <CartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cartItems}
            onRemove={handleRemoveFromCart}
            onUpdateQty={handleUpdateCartQuantity}
            onCheckout={handleCheckout}
          />

          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            items={cartItems}
            onOrderSuccess={handleOrderSuccess}
            prefillEmail={user?.email || ''}
          />

          <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />

          <TrackOrderModal
            isOpen={isTrackOrderOpen}
            onClose={() => setIsTrackOrderOpen(false)}
          />

          <ChatbotWidget />
        </>
      )}
    </div>
  );
}

export default App;
