import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { ownerService, OwnerProperty } from '../../services/owner.service';
import '../Dashboard.css';

export default function OwnerPropertyDetail() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const [property, setProperty] = useState<OwnerProperty & { analytics: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<OwnerProperty>>({});

  useEffect(() => {
    if (!propertyId) return;
    fetchPropertyDetails();
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    if (!propertyId) return;
    try {
      setLoading(true);
      const result = await ownerService.getPropertyDetails(propertyId);
      setProperty(result.data);
      setFormData(result.data);
    } catch (err) {
      setError('Failed to load property details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!propertyId) return;
    try {
      setSaving(true);
      await ownerService.updateProperty(propertyId, formData);
      setEditing(false);
      fetchPropertyDetails();
    } catch (err) {
      setError('Failed to save property changes');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!propertyId) {
    return (
      <section className="content-wrap">
        <div className="error-state">Property ID not found</div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="content-wrap">
        <div className="loading-state">Loading property details...</div>
      </section>
    );
  }

  if (!property) {
    return (
      <section className="content-wrap">
        <div className="error-state">{error || 'Property not found'}</div>
      </section>
    );
  }

  return (
    <section className="content-wrap dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">{property.name}</h1>
        <p className="dashboard-subtitle">Property details and management</p>
      </div>

      {error && <div className="error-state">{error}</div>}

      <div className="property-detail-section">
        <div className="detail-header">
          <h2>Property Information</h2>
          <button
            className={editing ? 'btn-ghost' : 'btn-cta'}
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="detail-content">
          <div className="detail-row">
            <span className="detail-label">Property Name:</span>
            {editing ? (
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="form-input"
              />
            ) : (
              <span className="detail-value">{property.name}</span>
            )}
          </div>

          <div className="detail-row">
            <span className="detail-label">Location:</span>
            <span className="detail-value">
              {property.city}, {property.state}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Monthly Price:</span>
            {editing ? (
              <input
                type="number"
                value={formData.monthly_price || 0}
                onChange={(e) => handleInputChange('monthly_price', parseFloat(e.target.value))}
                className="form-input"
              />
            ) : (
              <span className="detail-value">₹{property.monthly_price.toLocaleString()}</span>
            )}
          </div>

          <div className="detail-row">
            <span className="detail-label">Bedrooms:</span>
            {editing ? (
              <input
                type="number"
                value={formData.beds || 0}
                onChange={(e) => handleInputChange('beds', parseInt(e.target.value))}
                className="form-input"
              />
            ) : (
              <span className="detail-value">{property.beds}</span>
            )}
          </div>

          <div className="detail-row">
            <span className="detail-label">Bathrooms:</span>
            {editing ? (
              <input
                type="number"
                value={formData.baths || 0}
                onChange={(e) => handleInputChange('baths', parseInt(e.target.value))}
                className="form-input"
              />
            ) : (
              <span className="detail-value">{property.baths}</span>
            )}
          </div>

          <div className="detail-row full-width">
            <span className="detail-label">Description:</span>
            {editing ? (
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="form-textarea"
                rows={4}
              />
            ) : (
              <span className="detail-value">{property.description}</span>
            )}
          </div>

          <div className="detail-row full-width">
            <span className="detail-label">Amenities:</span>
            {editing ? (
              <input
                type="text"
                value={(formData.amenities || []).join(', ')}
                onChange={(e) => handleInputChange('amenities', e.target.value.split(',').map(a => a.trim()))}
                className="form-input"
                placeholder="WiFi, Gym, Kitchen, etc."
              />
            ) : (
              <span className="detail-value">
                {property.amenities?.join(', ') || 'N/A'}
              </span>
            )}
          </div>

          {editing && (
            <div className="action-buttons">
              <button className="btn-ghost" onClick={() => setEditing(false)}>
                Cancel
              </button>
              <button
                className="btn-cta"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="stats-section">
        <h2>Performance Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-label">Total Views</span>
            <span className="metric-value">{property.totalViews}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Total Bookings</span>
            <span className="metric-value">{property.totalBookings}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Average Rating</span>
            <span className="metric-value">⭐ {property.avgRating?.toFixed(2) || 'N/A'}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Total Reviews</span>
            <span className="metric-value">{property.totalReviews}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Occupancy Rate</span>
            <span className="metric-value">{property.occupancyRate?.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <div className="property-actions-section">
        <h2>Quick Actions</h2>
        <div className="action-links">
          <NavLink
            to={`/owner/properties/${propertyId}/bookings`}
            className="action-link"
          >
            📅 View Bookings
          </NavLink>
          <NavLink
            to={`/owner/properties/${propertyId}/reviews`}
            className="action-link"
          >
            ⭐ View Reviews
          </NavLink>
          <NavLink
            to={`/owner/properties/${propertyId}/revenue`}
            className="action-link"
          >
            💰 Revenue Dashboard
          </NavLink>
        </div>
      </div>
    </section>
  );
}
