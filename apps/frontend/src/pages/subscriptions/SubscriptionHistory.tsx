import React, { useEffect, useState } from 'react';
import { subscriptionService, SubscriptionHistory as SubscriptionHistoryType } from '../../services/subscription.service';
import '../Dashboard.css';

export default function SubscriptionHistory() {
  const [history, setHistory] = useState<SubscriptionHistoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const result = await subscriptionService.getSubscriptionHistory();
      setHistory(result.data);
    } catch (err) {
      setError('Failed to load subscription history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="content-wrap dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Subscription History</h1>
        <p className="dashboard-subtitle">View your past subscriptions and billing records</p>
      </div>

      {error && <div className="error-state">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading subscription history...</div>
      ) : history.length === 0 ? (
        <div className="empty-state">
          <p>No subscription history yet.</p>
        </div>
      ) : (
        <div className="history-section">
          <div className="table-section">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Plan Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{record.planName}</strong>
                    </td>
                    <td>{new Date(record.startDate).toLocaleDateString()}</td>
                    <td>
                      {record.endDate
                        ? new Date(record.endDate).toLocaleDateString()
                        : 'Ongoing'}
                    </td>
                    <td>₹{record.totalAmount.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge status-${record.status}`}>
                        {record.status === 'completed' && '✓ Completed'}
                        {record.status === 'active' && '✓ Active'}
                        {record.status === 'cancelled' && '✗ Cancelled'}
                        {record.status === 'paused' && '⏸ Paused'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="history-summary">
            <h3>Summary</h3>
            <div className="summary-grid">
              <div className="summary-card">
                <span className="summary-label">Total Subscriptions</span>
                <span className="summary-value">{history.length}</span>
              </div>
              <div className="summary-card">
                <span className="summary-label">Total Spent</span>
                <span className="summary-value">
                  ₹{history.reduce((sum, h) => sum + (h.totalAmount ?? 0), 0).toLocaleString()}
                </span>
              </div>
              <div className="summary-card">
                <span className="summary-label">Active/Current</span>
                <span className="summary-value">
                  {history.filter(h => h.status === 'active').length}
                </span>
              </div>
              <div className="summary-card">
                <span className="summary-label">Completed</span>
                <span className="summary-value">
                  {history.filter(h => h.status === 'completed').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="history-info">
        <h3>About Your Subscription History</h3>
        <p>
          This page shows all of your past and current subscriptions. You can see when each
          subscription started and ended, as well as the total amount paid for each subscription.
        </p>
        <p>
          For detailed invoices and receipts, please visit your <strong>Billing & Invoices</strong> page.
        </p>
      </div>
    </section>
  );
}
