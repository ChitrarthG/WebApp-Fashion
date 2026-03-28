import React, { useState, useEffect, useCallback } from 'react';
import './AdminPortal.css';
import apiBaseUrl from '../config/api';

const AdminPortal = () => {
  const [tab, setTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [authenticated, setAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');

  const encodedAuth = authenticated
    ? btoa(`${credentials.username}:${credentials.password}`)
    : null;

  const adminFetch = useCallback(async (url, options = {}) => {
    return fetch(`${apiBaseUrl}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Basic ${encodedAuth}`,
        'Content-Type': 'application/json',
      },
    });
  }, [encodedAuth]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes, statsRes] = await Promise.all([
        adminFetch('/admin/products'),
        adminFetch('/admin/orders'),
        adminFetch('/admin/stats'),
      ]);
      if (prodRes.ok) setProducts(await prodRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (_) {}
    setLoading(false);
  }, [adminFetch]);

  useEffect(() => {
    if (!authenticated) return;
    loadData();
  }, [authenticated, tab, loadData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const tempAuth = btoa(`${credentials.username}:${credentials.password}`);
      const res = await fetch(`${apiBaseUrl}/admin/stats`, {
        headers: {
          'Authorization': `Basic ${tempAuth}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        setLoginError('Invalid admin credentials');
        return;
      }
      setAuthenticated(true);
    } catch (_) {
      setLoginError('Unable to login right now. Please try again.');
    }
  };

  if (!authenticated) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <h1>✦ Vayu Fashion Admin</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
                placeholder="Enter admin username"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                placeholder="Enter admin password"
              />
            </div>
            <button type="submit" className="login-btn">Login</button>
            {loginError && <p className="login-hint" style={{ color: '#c62828' }}>{loginError}</p>}
          </form>
          <p className="login-hint">Default: admin / password</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-portal">
      <div className="admin-header">
        <h1>Vayu Fashion Dashboard</h1>
        <button onClick={() => setAuthenticated(false)} className="logout-btn">Logout</button>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn${tab === 'dashboard' ? ' active' : ''}`}
          onClick={() => setTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`tab-btn${tab === 'products' ? ' active' : ''}`}
          onClick={() => setTab('products')}
        >
          Products
        </button>
        <button
          className={`tab-btn${tab === 'orders' ? ' active' : ''}`}
          onClick={() => setTab('orders')}
        >
          Orders
        </button>
      </div>

      <div className="admin-content">
        {tab === 'dashboard' && (
          <div>
            <h2>Dashboard Overview</h2>
            <div className="dashboard-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <div className="stat-number">{stats.totalProducts || 0}</div>
                  <div className="stat-label">Total Products</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🛒</div>
                <div className="stat-info">
                  <div className="stat-number">{stats.totalOrders || 0}</div>
                  <div className="stat-label">Total Orders</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <div className="stat-number">₹{(stats.totalRevenue || 0).toLocaleString('en-IN')}</div>
                  <div className="stat-label">Revenue</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📁</div>
                <div className="stat-info">
                  <div className="stat-number">{stats.totalCategories || 0}</div>
                  <div className="stat-label">Categories</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'products' && (
          <div>
            <h2>Product Inventory</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Name</th>
                      <th>Brand</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Badges</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>#{p.id}</td>
                        <td><strong>{p.name}</strong></td>
                        <td>{p.brand || 'Vayu Fashion'}</td>
                        <td>{p.category_name || 'N/A'}</td>
                        <td>₹{Number(p.price).toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`stock-badge ${p.stock > 20 ? 'high' : p.stock > 5 ? 'medium' : 'low'}`}>
                            {p.stock}
                          </span>
                        </td>
                        <td>
                          {p.is_new && <span className="badge new">NEW</span>}
                          {p.is_featured && <span className="badge featured">FEATURED</span>}
                          {p.is_on_sale && <span className="badge sale">SALE</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div>
            <h2>Recent Orders</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order Number</th>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td><strong>{o.order_number}</strong></td>
                        <td>{o.customer_name}</td>
                        <td>{o.customer_email}</td>
                        <td>₹{Number(o.total_amount).toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`status-badge ${o.status}`}>
                            {o.status.toUpperCase()}
                          </span>
                        </td>
                        <td>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
