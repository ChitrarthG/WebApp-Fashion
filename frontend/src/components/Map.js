import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiBaseUrl from '../config/api';
import './Map.css';

const Map = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = apiBaseUrl;
  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const MAPS_ENABLED = process.env.REACT_APP_MAPS_ENABLED === 'true';

  useEffect(() => {
    if (MAPS_ENABLED) {
      fetchLocation();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/location`);
      setLocation(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch location. Make sure the backend is running.');
      console.error('Error fetching location:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="map-container"><p>Loading map...</p></div>;
  }

  if (error) {
    return <div className="map-container"><p className="error">{error}</p></div>;
  }

  if (!location) {
    return <div className="map-container"><p>No location data available</p></div>;
  }

  if (!MAPS_ENABLED) {
    return (
      <div className="map-container">
        <div className="maps-disabled">
          <h3>🗺️ Maps Feature Disabled</h3>
          <p>The Google Maps feature is currently disabled.</p>
          <div className="enable-instructions">
            <p><strong>To enable Google Maps:</strong></p>
            <ol>
              <li>Open <code>frontend/.env</code></li>
              <li>Change <code>REACT_APP_MAPS_ENABLED=false</code> to <code>true</code></li>
              <li>Restart the frontend: <code>npm start</code></li>
            </ol>
          </div>
          <div className="location-info">
            <h4>📍 The Bike Affair Shop</h4>
            <p><strong>Address:</strong> Kondapur, Hyderabad, Telangana, India</p>
            <p><strong>Coordinates:</strong> 17.4566, 78.3669</p>
            <p><strong>Description:</strong> Premium bike and accessories shop</p>
          </div>
        </div>
      </div>
    );
  }

  // Generate embed URL for Google Maps
  const mapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(location.address)}`;

  return (
    <div className="map-container">
      <div className="map-header">
        <h2>{location.name}</h2>
        <p className="location-address">{location.address}</p>
        <p className="location-description">{location.description}</p>
      </div>
      <iframe
        className="map-iframe"
        title="Location Map"
        src={mapsEmbedUrl}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
      <div className="location-details">
        <div className="detail-item">
          <strong>Coordinates:</strong> {location.latitude}, {location.longitude}
        </div>
      </div>
    </div>
  );
};

export default Map;
