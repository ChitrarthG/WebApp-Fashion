import React from 'react';
import './UserList.css';

function UserList({ users, onDeleteUser }) {
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onDeleteUser(id);
    }
  };

  return (
    <div className="user-list">
      {users.length === 0 ? (
        <p className="empty-message">No users available</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserList;
