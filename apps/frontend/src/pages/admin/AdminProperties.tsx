import React, { useEffect, useState } from 'react';
import { adminService, AdminProperty } from '../../services/admin.service';
import '../Dashboard.css';

export default function AdminProperties() {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [verifiedFilter, setVerifiedFilter] = useState<string>('');
  const [limit] = useState(20);
  const [selectedProperty, setSelectedProperty] = useState<AdminProperty | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [page, verifiedFilter]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const result = await adminService.getProperties({
        page,
        limit,
        verified: verifiedFilter === '' ? undefined : verifiedFilter === 'true',
      });
      setProperties(result.data);
      setTotal(result.total);
    } catch (err) {
      setError('Failed to load properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyProperty = async (propertyId: string) => {
    try {
      setUpdating(true);
      await adminService.verifyProperty(propertyId);
      fetchProperties();
      setSelectedProperty(null);
    } catch (err) {
      setError('Failed to verify property');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <section className="content-wrap dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Property Management</h1>
        <p className="dashboard-subtitle">Review and approve property listings</p>
      </div>

      <div className="filters-section">
        <select
          value={verifiedFilter}
          onChange={(e) => {
            setVerifiedFilter(e.target.value);
            setPage(1);
          }}
          className="filter-select"
        >
          <option value="">All Properties</option>
          <option value="false">Pending Verification</option>
          <option value="true">Verified</option>
        </select>
      </div>

      {error && <div className="error-state">{error}</div>}

      <div className="table-section">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Property Name</th>
              <th>Owner</th>
              <th>Location</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Reviews</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="loading-cell">Loading properties...</td>
              </tr>
            ) : properties.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-cell">No properties found</td>
              </tr>
            ) : (
              properties.map((property) => (
                <tr key={property.id}>
                  <td className="property-name-cell">
                    <strong>{property.name}</strong>
                  </td>
                  <td>{property.owner_name}</td>
                  <td>{property.city}, {property.state}</td>
                  <td>₹{property.monthly_price.toLocaleString()}</td>
                  <td>
                    <span className="rating-badge">
                      ⭐ {property.avgRating?.toFixed(1) || 'N/A'}
                    </span>
                  </td>
                  <td>{property.totalReviews}</td>
                  <td>
                    <span className={`status-badge ${property.isVerified ? 'verified' : 'pending'}`}>
                      {property.isVerified ? '✓ Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="action-btn view-btn"
                      onClick={() => setSelectedProperty(property)}
                      title="View details"
                    >
                      View
                    </button>
                    {!property.isVerified && (
                      <button
                        className="action-btn verify-btn"
                        onClick={() => handleVerifyProperty(property.id)}
                        title="Verify property"
                      >
                        Verify
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

      {selectedProperty && (
        <div className="modal-overlay" onClick={() => setSelectedProperty(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Property: {selectedProperty.name}</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedProperty(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Property Name:</span>
                <span className="detail-value">{selectedProperty.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Owner:</span>
                <span className="detail-value">{selectedProperty.owner_name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Location:</span>
                <span className="detail-value">
                  {selectedProperty.city}, {selectedProperty.state}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Monthly Price:</span>
                <span className="detail-value">
                  ₹{selectedProperty.monthly_price.toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Average Rating:</span>
                <span className="detail-value">
                  ⭐ {selectedProperty.avgRating?.toFixed(2) || 'N/A'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total Reviews:</span>
                <span className="detail-value">{selectedProperty.totalReviews}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className="detail-value">
                  {selectedProperty.isVerified ? '✓ Verified' : 'Pending Verification'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Created:</span>
                <span className="detail-value">
                  {new Date(selectedProperty.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn cancel-btn"
                onClick={() => setSelectedProperty(null)}
              >
                Close
              </button>
              {!selectedProperty.isVerified && (
                <button
                  className="modal-btn primary-btn"
                  onClick={() => handleVerifyProperty(selectedProperty.id)}
                  disabled={updating}
                >
                  {updating ? 'Verifying...' : 'Verify Property'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
