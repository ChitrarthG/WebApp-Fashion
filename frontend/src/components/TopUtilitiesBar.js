import React, { useState } from 'react';
import './TopUtilitiesBar.css';

const TopUtilitiesBar = ({ onTrackOrderClick }) => {
  const [storeMode, setStoreMode] = useState(false);

  const utilityLinks = [
    { id: 'greencard', label: 'GREENCARD' },
    { id: 'gift', label: 'GIFT CARD' },
    { id: 'locator', label: 'STORE LOCATOR' },
    { id: 'track', label: 'TRACK ORDER' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleClick = (id) => {
    if (id === 'track') {
      onTrackOrderClick();
    } else if (id === 'locator') {
      window.location.href = '#store-locator';
    } else if (id === 'contact') {
      window.location.href = '#contact';
    } else if (id === 'greencard' || id === 'gift') {
      alert(`${id.charAt(0).toUpperCase() + id.slice(1)} feature coming soon!`);
    }
  };

  return (
    <div className="top-utility-wrapper">
      <div className="utilities-bar">
        <div className="utilities-container">
          <div className="utility-links-left">
            {utilityLinks.map((link, index) => (
              <React.Fragment key={link.id}>
                <button
                  className="utility-link"
                  onClick={() => handleClick(link.id)}
                >
                  {link.label}
                </button>
                {index < utilityLinks.length - 1 && <span className="pipe">|</span>}
              </React.Fragment>
            ))}
          </div>

          <div className="utility-right-controls">
            <span className="entire-collection">ENTIRE COLLECTION</span>

            <button
              type="button"
              className={`store-toggle${storeMode ? ' active' : ''}`}
              onClick={() => setStoreMode((prev) => !prev)}
              aria-label="Toggle store mode"
            >
              <span className="store-toggle-knob" />
            </button>

            <span className="store-mode">
              <span className="store-bag" aria-hidden="true">&#128717;</span>
              STORE MODE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUtilitiesBar;
