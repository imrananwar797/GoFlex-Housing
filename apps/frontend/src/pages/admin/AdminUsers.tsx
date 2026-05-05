import React, { useEffect, useState } from 'react';
import { adminService, AdminUser } from '../../services/admin.service';
import '../Dashboard.css';

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>('');
  const [limit] = useState(20);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, search, role]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await adminService.getUsers({
        page,
        limit,
        search: search || undefined,
        role: role || undefined,
      });
      setUsers(result.data);
      setTotal(result.total);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<AdminUser>) => {
    try {
      setUpdating(true);
      await adminService.updateUser(userId, updates);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      setError('Failed to update user');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSuspend = (user: AdminUser) => {
    if (window.confirm(`Are you sure you want to suspend ${user.username}?`)) {
      handleUpdateUser(user.id, { isActive: false });
    }
  };

  const handleActivate = (user: AdminUser) => {
    if (window.confirm(`Are you sure you want to activate ${user.username}?`)) {
      handleUpdateUser(user.id, { isActive: true });
    }
  };

  const handleVerify = (user: AdminUser) => {
    handleUpdateUser(user.id, { isVerified: true });
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <section className="content-wrap dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">User Management</h1>
        <p className="dashboard-subtitle">Manage users, verify accounts, and handle permissions</p>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Search by username or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="search-input"
        />
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
          className="filter-select"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
          <option value="resident">Resident</option>
        </select>
      </div>

      {error && <div className="error-state">{error}</div>}

      <div className="table-section">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Verified</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="loading-cell">Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-cell">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="username-cell">
                    <strong>{user.username}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className="role-badge">{user.role}</span>
                  </td>
                  <td>
                    <span className={`status-badge status-${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td>
                    <span className={`verify-badge ${user.isVerified ? 'verified' : 'pending'}`}>
                      {user.isVerified ? '✓ Verified' : 'Pending'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button
                      className="action-btn view-btn"
                      onClick={() => setSelectedUser(user)}
                      title="View details"
                    >
                      View
                    </button>
                    {!user.isVerified && (
                      <button
                        className="action-btn verify-btn"
                        onClick={() => handleVerify(user)}
                        title="Verify user"
                      >
                        Verify
                      </button>
                    )}
                    {user.isActive && (
                      <button
                        className="action-btn suspend-btn"
                        onClick={() => handleSuspend(user)}
                        title="Suspend user"
                      >
                        Suspend
                      </button>
                    )}
                    {!user.isActive && (
                      <button
                        className="action-btn activate-btn"
                        onClick={() => handleActivate(user)}
                        title="Activate user"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-section">
        <button
          className="pagination-btn"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {page} of {totalPages} ({total} total)
        </span>
        <button
          className="pagination-btn"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details: {selectedUser.username}</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedUser(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Username:</span>
                <span className="detail-value">{selectedUser.username}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedUser.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Role:</span>
                <span className="detail-value">{selectedUser.role}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className="detail-value">
                  {selectedUser.isActive ? 'Active' : 'Suspended'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Verified:</span>
                <span className="detail-value">
                  {selectedUser.isVerified ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Joined:</span>
                <span className="detail-value">
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Updated:</span>
                <span className="detail-value">
                  {new Date(selectedUser.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn cancel-btn"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
              {!selectedUser.isVerified && (
                <button
                  className="modal-btn primary-btn"
                  onClick={() => handleVerify(selectedUser)}
                  disabled={updating}
                >
                  {updating ? 'Verifying...' : 'Verify User'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
