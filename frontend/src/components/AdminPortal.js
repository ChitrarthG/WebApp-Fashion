import React from 'react';
import './AdminPortal.css';
import apiBaseUrl from '../config/api';

const AUTH_STORAGE_KEY = 'adminPortalAuth';

const formatDateTime = (value) => {
  if (!value) {
    return 'Not specified';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

const buildAuthHeader = (username, password) => `Basic ${window.btoa(`${username}:${password}`)}`;

const AdminPortal = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [authHeader, setAuthHeader] = React.useState(() => window.sessionStorage.getItem(AUTH_STORAGE_KEY) || '');
  const [appointments, setAppointments] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const loadAppointments = React.useCallback(async (header) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${apiBaseUrl}/appointments`, {
        headers: {
          Authorization: header,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load appointments');
      }

      setAppointments(data);
      setAuthHeader(header);
      window.sessionStorage.setItem(AUTH_STORAGE_KEY, header);
    } catch (err) {
      setAppointments([]);
      setAuthHeader('');
      window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (authHeader) {
      loadAppointments(authHeader);
    }
  }, [authHeader, loadAppointments]);

  const handleLogin = async (event) => {
    event.preventDefault();
    const header = buildAuthHeader(username.trim(), password);
    await loadAppointments(header);
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthHeader('');
    setAppointments([]);
    setUsername('');
    setPassword('');
    setError('');
  };

  return (
    <div className="admin-portal-page">
      <div className="admin-portal-shell">
        <div className="admin-portal-topbar">
          <a href="/index.html" className="admin-portal-backlink">Back To Home</a>
          {authHeader && (
            <button type="button" className="admin-portal-logout" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>

        {!authHeader && (
          <div className="admin-login-card">
            <div className="admin-login-copy">
              <h1>Admin Login</h1>
              <p>Enter admin credentials to view patient appointment details.</p>
            </div>
            <form className="admin-login-form" onSubmit={handleLogin}>
              <label>
                Username
                <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} required />
              </label>
              <label>
                Password
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              </label>
              {error && <p className="admin-login-error">{error}</p>}
              <button type="submit" disabled={loading}>
                {loading ? 'Checking...' : 'Login'}
              </button>
            </form>
          </div>
        )}

        {authHeader && (
          <section className="admin-dashboard-card">
            <div className="admin-dashboard-header">
              <div>
                <h1>Appointment Dashboard</h1>
                <p>Patient details are visible only after successful admin authentication.</p>
              </div>
              <button type="button" className="admin-refresh-btn" onClick={() => loadAppointments(authHeader)}>
                Refresh
              </button>
            </div>

            {loading && <p className="admin-state-message">Loading appointments...</p>}
            {!loading && error && <p className="admin-state-message admin-error-message">{error}</p>}
            {!loading && !error && appointments.length === 0 && (
              <p className="admin-state-message">No appointments submitted yet.</p>
            )}

            {!loading && !error && appointments.length > 0 && (
              <div className="admin-table-wrap">
                <table className="admin-appointments-table">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Patient</th>
                      <th>Phone</th>
                      <th>Service</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.reference_id}</td>
                        <td>
                          <strong>{appointment.name}</strong>
                          <span>{appointment.email || 'No email'}</span>
                        </td>
                        <td>{appointment.phone}</td>
                        <td>{appointment.service}</td>
                        <td>{formatDateTime(appointment.appointment_datetime)}</td>
                        <td>
                          <span className={`status-pill status-${appointment.status}`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td>{appointment.message || 'No message'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
