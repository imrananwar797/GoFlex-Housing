import React, { useEffect, useState } from 'react';
import { adminService, FraudAlert } from '../../services/admin.service';
import '../Dashboard.css';

export default function AdminFraudAlerts() {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [severity, setSeverity] = useState<string>('');
  const [limit] = useState(20);
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, [page, severity]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const result = await adminService.getFraudAlerts({
        page,
        limit,
        severity: severity || undefined,
      });
      setAlerts(result.data);
      setTotal(result.total);
    } catch (err) {
      setError('Failed to load fraud alerts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (alertId: string, newStatus: string) => {
    try {
      setProcessing(true);
      await adminService.updateFraudAlert(alertId, newStatus);
      setSelectedAlert(null);
      fetchAlerts();
    } catch (err) {
      setError('Failed to update alert status');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const getSeverityColor = (sev: string) => {
    switch (sev?.toLowerCase()) {
      case 'critical':
        return 'critical';
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      case 'low':
        return 'low';
      default:
        return 'low';
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <section className="content-wrap dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Fraud Monitoring</h1>
        <p className="dashboard-subtitle">Monitor and manage fraud alerts</p>
      </div>

      <div className="filters-section">
        <select
          value={severity}
          onChange={(e) => {
            setSeverity(e.target.value);
            setPage(1);
          }}
          className="filter-select"
        >
          <option value="">All Alerts</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {error && <div className="error-state">{error}</div>}

      <div className="table-section">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Alert ID</th>
              <th>User</th>
              <th>Type</th>
              <th>Severity</th>
              <th>Description</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="loading-cell">Loading fraud alerts...</td>
              </tr>
            ) : alerts.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-cell">No fraud alerts found</td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <tr key={alert.id} className={`alert-row severity-${getSeverityColor(alert.severity)}`}>
                  <td className="alert-id-cell">
                    <code>{alert.id.substring(0, 8)}...</code>
                  </td>
                  <td>{alert.user_id.substring(0, 8)}...</td>
                  <td>
                    <span className="alert-type-badge">{alert.type}</span>
                  </td>
                  <td>
                    <span className={`severity-badge severity-${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="description-cell">
                    <span className="truncated-text">{alert.description}</span>
                  </td>
                  <td>
                    <span className={`status-badge status-${alert.status}`}>
                      {alert.status}
                    </span>
                  </td>
                  <td>{new Date(alert.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button
                      className="action-btn view-btn"
                      onClick={() => setSelectedAlert(alert)}
                      title="View details"
                    >
                      View
                    </button>
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

      {selectedAlert && (
        <div className="modal-overlay" onClick={() => setSelectedAlert(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Fraud Alert Details</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedAlert(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Alert ID:</span>
                <span className="detail-value">{selectedAlert.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">User ID:</span>
                <span className="detail-value">{selectedAlert.user_id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{selectedAlert.type}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Severity:</span>
                <span className={`detail-value severity-${getSeverityColor(selectedAlert.severity)}`}>
                  {selectedAlert.severity}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Description:</span>
                <span className="detail-value">{selectedAlert.description}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`detail-value status-${selectedAlert.status}`}>
                  {selectedAlert.status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Created:</span>
                <span className="detail-value">
                  {new Date(selectedAlert.createdAt).toLocaleString()}
                </span>
              </div>

              {selectedAlert.status !== 'resolved' && selectedAlert.status !== 'closed' && (
                <div className="status-actions">
                  <label className="form-label">
                    Update Status:
                    <select
                      className="form-select"
                      value={updatingStatus}
                      onChange={(e) => setUpdatingStatus(e.target.value)}
                    >
                      <option value="">Select status...</option>
                      <option value="investigating">Investigating</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </label>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn cancel-btn"
                onClick={() => setSelectedAlert(null)}
              >
                Close
              </button>
              {selectedAlert.status !== 'resolved' && selectedAlert.status !== 'closed' && (
                <button
                  className="modal-btn primary-btn"
                  onClick={() => handleUpdateStatus(selectedAlert.id, updatingStatus)}
                  disabled={processing || !updatingStatus}
                >
                  {processing ? 'Updating...' : 'Update Status'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
