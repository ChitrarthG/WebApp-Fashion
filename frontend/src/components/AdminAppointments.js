import React from 'react';
import './AdminAppointments.css';
import apiBaseUrl from '../config/api';

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

const AdminAppointments = () => {
  const [appointments, setAppointments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const loadAppointments = React.useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${apiBaseUrl}/appointments`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load appointments');
      }

      setAppointments(data);
    } catch (err) {
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  return (
    <section id="admin" className="section admin-appointments-section">
      <div className="container">
        <div className="admin-appointments-header">
          <div>
            <h2>Appointment Dashboard</h2>
            <p>Review submitted appointments and track their current status.</p>
          </div>
          <button type="button" className="admin-refresh-btn" onClick={loadAppointments}>
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
      </div>
    </section>
  );
};

export default AdminAppointments;
