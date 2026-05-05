import React, { useEffect, useState } from 'react';
import { adminService, AdminBooking } from '../../services/admin.service';
import '../Dashboard.css';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<string>('');
  const [limit] = useState(20);
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [page, status]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const result = await adminService.getBookings({
        page,
        limit,
        status: status || undefined,
      });
      setBookings(result.data);
      setTotal(result.total);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!selectedBooking || !refundReason.trim()) {
      setError('Please provide a refund reason');
      return;
    }

    try {
      setProcessing(true);
      await adminService.refundBooking(selectedBooking.id, refundReason);
      setRefundReason('');
      setSelectedBooking(null);
      fetchBookings();
    } catch (err) {
      setError('Failed to process refund');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <section className="content-wrap dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Booking Management</h1>
        <p className="dashboard-subtitle">Manage bookings and process refunds</p>
      </div>

      <div className="filters-section">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="filter-select"
        >
          <option value="">All Bookings</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {error && <div className="error-state">{error}</div>}

      <div className="table-section">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Guest</th>
              <th>Property</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="loading-cell">Loading bookings...</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-cell">No bookings found</td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="booking-id-cell">
                    <code>{booking.id.substring(0, 8)}...</code>
                  </td>
                  <td>{booking.user_name}</td>
                  <td>{booking.property_name}</td>
                  <td>{new Date(booking.check_in_date).toLocaleDateString()}</td>
                  <td>{new Date(booking.check_out_date).toLocaleDateString()}</td>
                  <td>₹{booking.total_amount.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="action-btn view-btn"
                      onClick={() => setSelectedBooking(booking)}
                      title="View details"
                    >
                      View
                    </button>
                    {booking.status !== 'refunded' && booking.status !== 'cancelled' && (
                      <button
                        className="action-btn refund-btn"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setRefundReason('');
                        }}
                        title="Process refund"
                      >
                        Refund
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

      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Booking Details</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedBooking(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Booking ID:</span>
                <span className="detail-value">{selectedBooking.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Guest:</span>
                <span className="detail-value">{selectedBooking.user_name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Property:</span>
                <span className="detail-value">{selectedBooking.property_name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Check-in:</span>
                <span className="detail-value">
                  {new Date(selectedBooking.check_in_date).toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Check-out:</span>
                <span className="detail-value">
                  {new Date(selectedBooking.check_out_date).toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Amount:</span>
                <span className="detail-value">
                  ₹{selectedBooking.total_amount.toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`detail-value status-${selectedBooking.status}`}>
                  {selectedBooking.status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Created:</span>
                <span className="detail-value">
                  {new Date(selectedBooking.createdAt).toLocaleString()}
                </span>
              </div>

              {selectedBooking.status !== 'refunded' && selectedBooking.status !== 'cancelled' && (
                <div className="refund-form">
                  <label className="form-label">
                    Refund Reason:
                    <textarea
                      className="form-textarea"
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      placeholder="Enter reason for refund..."
                      rows={3}
                    />
                  </label>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn cancel-btn"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>
              {selectedBooking.status !== 'refunded' && selectedBooking.status !== 'cancelled' && (
                <button
                  className="modal-btn primary-btn"
                  onClick={handleRefund}
                  disabled={processing || !refundReason.trim()}
                >
                  {processing ? 'Processing...' : 'Process Refund'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
