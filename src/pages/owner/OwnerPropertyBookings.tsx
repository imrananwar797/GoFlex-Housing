import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ownerService, OwnerBooking } from '../../services/owner.service';
import '../Dashboard.css';

export default function OwnerPropertyBookings() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const [bookings, setBookings] = useState<OwnerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<OwnerBooking | null>(null);

  useEffect(() => {
    if (!propertyId) return;
    fetchBookings();
  }, [propertyId, status]);

  const fetchBookings = async () => {
    if (!propertyId) return;
    try {
      setLoading(true);
      const result = await ownerService.getPropertyBookings(propertyId, {
        status: status || undefined,
      });
      setBookings(result.data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!propertyId) {
    return (
      <section className="content-wrap">
        <div className="error-state">Property ID not found</div>
      </section>
    );
  }

  return (
    <section className="content-wrap dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Property Bookings</h1>
        <p className="dashboard-subtitle">Manage bookings for your property</p>
      </div>

      <div className="filters-section">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="filter-select"
        >
          <option value="">All Bookings</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {error && <div className="error-state">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <p>No bookings found for this property.</p>
        </div>
      ) : (
        <div className="table-section">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Email</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.user_name}</td>
                  <td>{booking.user_email}</td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
                <span className="detail-label">Guest Name:</span>
                <span className="detail-value">{selectedBooking.user_name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedBooking.user_email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Check-in Date:</span>
                <span className="detail-value">
                  {new Date(selectedBooking.check_in_date).toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Check-out Date:</span>
                <span className="detail-value">
                  {new Date(selectedBooking.check_out_date).toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total Amount:</span>
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
                <span className="detail-label">Booking Date:</span>
                <span className="detail-value">
                  {new Date(selectedBooking.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn cancel-btn"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
