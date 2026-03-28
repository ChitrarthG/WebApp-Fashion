import React, { useState } from 'react';
import './TrackOrderModal.css';
import apiBaseUrl from '../config/api';

const TrackOrderModal = ({ isOpen, onClose }) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setOrderData(null);
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`${apiBaseUrl}/orders/${orderNumber}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Order not found');
        return;
      }

      setOrderData(data);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      confirmed: '#2196f3',
      processing: '#9c27b0',
      shipped: '#00bcd4',
      delivered: '#4caf50',
      cancelled: '#f44336',
    };
    return colors[status] || '#999';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      confirmed: '✓',
      processing: '⚙️',
      shipped: '📦',
      delivered: '✅',
      cancelled: '❌',
    };
    return icons[status] || '?';
  };

  if (!isOpen) return null;

  return (
    <div className="track-order-overlay" onClick={onClose}>
      <div className="track-order-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-header">
          <h2>📦 Track Your Order</h2>
          <p>Enter your order number to check the status</p>
        </div>

        {!orderData ? (
          <form onSubmit={handleSubmit} className="track-form">
            <div className="form-group">
              <label>Order Number</label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g., ORD-AB12CD34"
                required
                maxLength="20"
              />
              <div className="form-hint">
                Format: ORD-XXXXXXXX (You received this in your confirmation email)
              </div>
            </div>

            {error && searched && (
              <div className="error-message">{error}</div>
            )}

            <button type="submit" className="submit-btn" disabled={loading || !orderNumber.trim()}>
              {loading ? 'Fetching...' : 'Track Order'}
            </button>
          </form>
        ) : (
          <div className="order-details">
            <div className="order-header">
              <div className="order-number">{orderData.order_number}</div>
              <div
                className="order-status"
                style={{ borderColor: getStatusColor(orderData.status) }}
              >
                <span style={{ color: getStatusColor(orderData.status) }}>
                  {getStatusIcon(orderData.status)} {orderData.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="order-info-grid">
              <div className="info-item">
                <label>Order Date</label>
                <p>{new Date(orderData.created_at).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="info-item">
                <label>Total Amount</label>
                <p className="amount">₹{Number(orderData.total_amount).toLocaleString('en-IN')}</p>
              </div>
              <div className="info-item">
                <label>Payment Method</label>
                <p>{orderData.payment_method === 'cod' ? 'Cash on Delivery' : orderData.payment_method}</p>
              </div>
              <div className="info-item">
                <label>Delivery Address</label>
                <p>{orderData.shipping_address}</p>
              </div>
            </div>

            {orderData.items && orderData.items.length > 0 && (
              <div className="order-items">
                <h3>Order Items</h3>
                <div className="items-list">
                  {orderData.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <div className="item-info">
                        <p className="item-name">{item.name}</p>
                        <p className="item-details">
                          {item.size && <span>{item.size}</span>}
                          {item.color && <span>{item.color}</span>}
                          <span>Qty: {item.quantity}</span>
                        </p>
                      </div>
                      <p className="item-price">₹{Number(item.unit_price).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="timeline">
              <h3>Order Status Timeline</h3>
              <div className="timeline-items">
                {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((s) => (
                  <div
                    key={s}
                    className={`timeline-item ${
                      ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(s) <=
                      ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].indexOf(
                        orderData.status
                      )
                        ? 'completed'
                        : ''
                    }`}
                  >
                    <div className="timeline-dot" style={{ backgroundColor: getStatusColor(s) }}>
                      <span>{getStatusIcon(s)}</span>
                    </div>
                    <p className="timeline-label">{s.charAt(0).toUpperCase() + s.slice(1)}</p>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => { setOrderData(null); setOrderNumber(''); setSearched(false); }} className="track-another-btn">
              Track Another Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderModal;
