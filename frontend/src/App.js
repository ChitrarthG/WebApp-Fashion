import React from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import AdminPortal from './components/AdminPortal';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  const [showPromoPopup, setShowPromoPopup] = React.useState(false);
  const disableContextMenu = process.env.REACT_APP_DISABLE_CONTEXT_MENU === 'true';
  const isAdminPage = React.useMemo(() => new URLSearchParams(window.location.search).get('admin') === '1', []);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('showPromo') === '1') {
      setShowPromoPopup(true);
    }

  }, []);

  React.useEffect(() => {
    if (!disableContextMenu) {
      return;
    }

    const preventContextMenu = (event) => {
      event.preventDefault();
    };

    document.addEventListener('contextmenu', preventContextMenu);
    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, [disableContextMenu]);

  const handleClosePromo = () => {
    setShowPromoPopup(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('showPromo');
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className="App">
      <div className="page-blob-mid" aria-hidden="true" />
      {isAdminPage ? (
        <AdminPortal />
      ) : (
        <>
      {showPromoPopup && (
        <div className="promo-overlay" role="dialog" aria-modal="true" aria-label="Clinic promotion">
          <div className="promo-modal">
            <button type="button" className="promo-close" onClick={handleClosePromo} aria-label="Close popup">
              x
            </button>

            <div className="promo-header">
              <div>
                <h3>Neo Asian Clinics</h3>
                <p>Care beyond Cure</p>
              </div>
              <span className="promo-doctor">Vayu Clinic</span>
            </div>

            <div className="promo-strip">Needle Free Injection System</div>

            <div className="promo-body">
              <div className="promo-copy">
                <h4>Now your kids can experience vaccination with a smile.</h4>
                <ul>
                  <li>Virtually painless</li>
                  <li>Convenient and easy to use</li>
                  <li>Trusted by doctors globally</li>
                </ul>
              </div>
              <div className="promo-visual">
                <img
                  src="/vayu-popup.JPG"
                  alt="Child in clinic"
                  className="promo-visual-image"
                />
              </div>
            </div>

            <div className="promo-footer">
              <span>Call us now</span>
              <strong>+91 7754929443</strong>
            </div>
          </div>
        </div>
      )}

      <Header />
      <Hero />

      <section id="about" className="section about-section">
        <div className="container">
          <h2>About us</h2>
          <p>
            Vayu Clinic is a trusted multi-specialty clinic in Kondapur offering
            personalized patient-centered healthcare with advanced diagnostics and
            excellent doctors.
          </p>
        </div>
      </section>

      <Services />

      <section id="media" className="section media-section">
        <div className="container">
          <h2>Media</h2>
          <p>Explore clinic news, updates and health awareness content in our media section.</p>
        </div>
      </section>

      <section id="blog" className="section blog-section">
        <div className="container">
          <h2>Blog</h2>
          <p>Read latest articles on health tips, preventive care and medical insights from our experts.</p>
        </div>
      </section>

      <Testimonials />
      <Contact />
      <ChatbotWidget />
      <Footer />
        </>
      )}
    </div>
  );
}

export default App;
