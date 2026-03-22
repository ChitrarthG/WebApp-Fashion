import React, { useState } from 'react';
import './UserForm.css';

function UserForm({ onAddUser }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await onAddUser(formData);
      setFormData({ name: '', email: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter user name"
          disabled={submitting}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter user email"
          disabled={submitting}
        />
      </div>
      <button type="submit" disabled={submitting} className="submit-btn">
        {submitting ? 'Adding...' : 'Add User'}
      </button>
    </form>
  );
}

export default UserForm;
