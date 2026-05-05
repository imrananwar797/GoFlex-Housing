import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ownerService, OwnerProperty } from '../../services/owner.service';
import '../Dashboard.css';

export default function OwnerProperties() {
  const [properties, setProperties] = useState<OwnerProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const result = await ownerService.getProperties();
      setProperties(result.data);
    } catch (err) {
      setError('Failed to load properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && properties.length === 0) {
    return (
      <section className="content-wrap dashboard-page">
        <div className="dashboard-header">
          <h1 className="dashboard-title">My Properties</h1>
          <p className="dashboard-subtitle">Manage your property listings</p>
        </div>
        <div className="empty-state">
          <p>You don't have any properties yet.</p>
          <NavLink to="/properties" className="btn-cta">Create Property</NavLink>
        </div>
      </section>
    );
  }

  return (
    <section className="content-wrap dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Properties</h1>
        <p className="dashboard-subtitle">Manage your property listings and bookings</p>
      </div>

      {error && <div className="error-state">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading your properties...</div>
      ) : (
        <div className="properties-grid">
          {properties.map((property) => (
            <div key={property.id} className="property-card">
              <img
                src={property.featured_image || 'https://via.placeholder.com/300x200'}
                alt={property.name}
                className="property-image"
              />
              <div className="property-content">
                <h3 className="property-title">{property.name}</h3>
                <p className="property-location">
                  {property.city}, {property.state}
                </p>
                <div className="property-details">
                  <span>💰 ₹{property.monthly_price.toLocaleString()}/month</span>
                  <span>🛏️ {property.beds} bed{property.beds !== 1 ? 's' : ''}</span>
                  <span>🚿 {property.baths} bath{property.baths !== 1 ? 's' : ''}</span>
                </div>
                <div className="property-stats">
                  <div className="stat">
                    <span className="stat-label">Rating</span>
                    <span className="stat-value">⭐ {property.avgRating?.toFixed(1) || 'N/A'}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Reviews</span>
                    <span className="stat-value">{property.totalReviews}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Occupancy</span>
                    <span className="stat-value">{property.occupancyRate?.toFixed(0)}%</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Views</span>
                    <span className="stat-value">{property.totalViews}</span>
                  </div>
                </div>
                <div className="property-actions">
                  <NavLink
                    to={`/owner/properties/${property.id}`}
                    className="btn-ghost"
                  >
                    View Details
                  </NavLink>
                  <NavLink
                    to={`/owner/properties/${property.id}/bookings`}
                    className="btn-ghost"
                  >
                    Bookings
                  </NavLink>
                  <NavLink
                    to={`/owner/properties/${property.id}/reviews`}
                    className="btn-ghost"
                  >
                    Reviews
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
