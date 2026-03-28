import React from 'react';
import './CartSidebar.css';

const CartSidebar = ({ isOpen, onClose, items, onRemove, onUpdateQty, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + (parseFloat(item.price || 0) * (item.quantity || 1)), 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="cart-overlay" onClick={onClose} aria-hidden="true" />}

      {/* Sidebar */}
      <div className={`cart-sidebar${isOpen ? ' open' : ''}`} aria-label="Shopping cart" role="dialog">
        <div className="cart-header">
          <h2 className="cart-title">🛒 My Cart ({items.length})</h2>
          <button className="cart-close" onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon">🛍️</span>
            <p>Your cart is empty</p>
            <button className="btn-primary" onClick={onClose}>Start Shopping</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} />
                    ) : (
                      <div className="cart-item-placeholder">🛍️</div>
                    )}
                  </div>
                  <div className="cart-item-details">
                    <div className="cart-item-brand">{item.brand}</div>
                    <div className="cart-item-name">{item.name}</div>
                    {item.size && <div className="cart-item-meta">Size: {item.size}</div>}
                    <div className="cart-item-price">₹{(parseFloat(item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</div>
                    <div className="cart-item-controls">
                      <div className="qty-control">
                        <button
                          className="qty-btn"
                          onClick={() => item.quantity > 1 ? onUpdateQty(item.id, item.quantity - 1) : onRemove(item.id)}
                          aria-label="Decrease quantity"
                        >−</button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >+</button>
                      </div>
                      <button className="remove-btn" onClick={() => onRemove(item.id)} aria-label="Remove item">🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total-row">
                <span>Subtotal</span>
                <span className="cart-total-amount">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="cart-shipping-note">FREE shipping on orders above ₹999</div>
              <button className="checkout-btn" onClick={onCheckout}>Proceed to Checkout →</button>
              <button className="continue-btn" onClick={onClose}>Continue Shopping</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
