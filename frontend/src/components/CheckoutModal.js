import React, { useMemo, useState } from 'react';
import './CheckoutModal.css';
import apiBaseUrl from '../config/api';

const PAYMENT_OPTIONS = [
  { value: 'cod', label: 'Cash on Delivery' },
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Credit / Debit Card' },
  { value: 'netbanking', label: 'Net Banking' },
];

const initialForm = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  shippingAddress: '',
  paymentMethod: 'cod',
};

const CheckoutModal = ({ isOpen, onClose, items, onOrderSuccess, prefillEmail = '' }) => {
  const [form, setForm] = useState({ ...initialForm, customerEmail: prefillEmail });
  const [step, setStep] = useState(1);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
  }, [items]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateStepOne = () => {
    if (!form.customerName.trim()) return 'Name is required';
    if (!form.customerEmail.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) return 'Enter a valid email';
    if (!form.shippingAddress.trim()) return 'Shipping address is required';
    return '';
  };

  const placeOrder = async () => {
    const itemsPayload = items.map((i) => ({
      productId: i.product_id,
      quantity: i.quantity,
      size: i.size,
      color: i.color,
    }));

    setPlacingOrder(true);
    setError('');
    try {
      const res = await fetch(`${apiBaseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: itemsPayload,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not place order');
        return;
      }

      onOrderSuccess?.(data.orderNumber);
      setStep(3);
    } catch (_) {
      setError('Network error while placing order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const resetAndClose = () => {
    setForm({ ...initialForm, customerEmail: prefillEmail });
    setStep(1);
    setError('');
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="checkout-overlay" onClick={resetAndClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="checkout-close" onClick={resetAndClose} aria-label="Close checkout">✕</button>

        <div className="checkout-header">
          <h2>Checkout</h2>
          <div className="checkout-steps">
            <span className={step >= 1 ? 'active' : ''}>Shipping</span>
            <span className={step >= 2 ? 'active' : ''}>Payment</span>
            <span className={step >= 3 ? 'active' : ''}>Done</span>
          </div>
        </div>

        {step === 1 && (
          <div className="checkout-body">
            <div className="checkout-grid">
              <label>
                Full Name
                <input value={form.customerName} onChange={(e) => handleChange('customerName', e.target.value)} placeholder="Enter full name" />
              </label>
              <label>
                Email
                <input type="email" value={form.customerEmail} onChange={(e) => handleChange('customerEmail', e.target.value)} placeholder="Enter email" />
              </label>
              <label>
                Phone
                <input value={form.customerPhone} onChange={(e) => handleChange('customerPhone', e.target.value)} placeholder="Enter phone number" />
              </label>
              <label className="full-row">
                Shipping Address
                <textarea value={form.shippingAddress} onChange={(e) => handleChange('shippingAddress', e.target.value)} rows={3} placeholder="House no, street, area, city, pincode" />
              </label>
            </div>
            <div className="checkout-actions">
              <button
                className="primary"
                onClick={() => {
                  const msg = validateStepOne();
                  if (msg) {
                    setError(msg);
                    return;
                  }
                  setError('');
                  setStep(2);
                }}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="checkout-body">
            <div className="payment-options">
              {PAYMENT_OPTIONS.map((opt) => (
                <label key={opt.value} className={`payment-option ${form.paymentMethod === opt.value ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    checked={form.paymentMethod === opt.value}
                    onChange={() => handleChange('paymentMethod', opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            <div className="order-summary">
              <h4>Order Summary</h4>
              {items.map((item) => (
                <div className="summary-row" key={item.id}>
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{(Number(item.price) * Number(item.quantity || 1)).toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="summary-total">
                <span>Total</span>
                <strong>₹{total.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="checkout-actions split">
              <button className="secondary" onClick={() => setStep(1)}>Back</button>
              <button className="primary" onClick={placeOrder} disabled={placingOrder}>
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="checkout-success">
            <div className="success-icon">✓</div>
            <h3>Order Placed Successfully</h3>
            <p>You can track your order from the Track Order option in the top bar.</p>
            <button className="primary" onClick={resetAndClose}>Continue Shopping</button>
          </div>
        )}

        {error && <p className="checkout-error">{error}</p>}
      </div>
    </div>
  );
};

export default CheckoutModal;
