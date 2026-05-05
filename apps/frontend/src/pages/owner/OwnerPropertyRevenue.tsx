import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ownerService, PropertyRevenue } from '../../services/owner.service';
import '../Dashboard.css';

export default function OwnerPropertyRevenue() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const [revenue, setRevenue] = useState<PropertyRevenue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) return;
    fetchRevenue();
  }, [propertyId]);

  const fetchRevenue = async () => {
    if (!propertyId) return;
    try {
      setLoading(true);
      const result = await ownerService.getPropertyRevenue(propertyId);
      setRevenue(result.data);
    } catch (err) {
      setError('Failed to load revenue data');
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

  if (loading) {
    return (
      <section className="content-wrap">
        <div className="loading-state">Loading revenue data...</div>
      </section>
    );
  }

  if (!revenue) {
    return (
      <section className="content-wrap">
        <div className="error-state">{error || 'Revenue data not available'}</div>
      </section>
    );
  }

  return (
    <section className="content-wrap dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Property Revenue</h1>
        <p className="dashboard-subtitle">Revenue analytics and financial overview</p>
      </div>

      {error && <div className="error-state">{error}</div>}

      <div className="revenue-cards">
        <div className="revenue-card main-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <span className="card-label">Total Revenue</span>
            <span className="card-value">
              ₹{(revenue.total_revenue ?? 0).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="revenue-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <span className="card-label">Monthly Revenue</span>
            <span className="card-value">
              ₹{(revenue.revenue_month ?? 0).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="revenue-card">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <span className="card-label">Weekly Revenue</span>
            <span className="card-value">
              ₹{(revenue.revenue_week ?? 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="metrics-section">
        <h2>Booking Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-label">Total Bookings</span>
            <span className="metric-value">{revenue.total_bookings}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Completed Bookings</span>
            <span className="metric-value">{revenue.completed_bookings}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Average Booking Value</span>
            <span className="metric-value">
              ₹{(revenue.avgBookingValue ?? 0).toLocaleString()}
            </span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Occupancy Rate</span>
            <span className="metric-value">{(revenue.occupancyRate ?? 0).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <div className="financial-summary">
        <h2>Financial Summary</h2>
        <div className="summary-content">
          <div className="summary-row">
            <span className="summary-label">Average Monthly Earnings:</span>
            <span className="summary-value">
              ₹{((revenue.total_revenue ?? 0) / 12).toLocaleString()}
            </span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Completed vs Total Bookings:</span>
            <span className="summary-value">
              {revenue.completed_bookings ?? 0} / {revenue.total_bookings ?? 0} (
              {(revenue.total_bookings ?? 0) > 0
                ? (((revenue.completed_bookings ?? 0) / (revenue.total_bookings ?? 0)) * 100).toFixed(0)
                : 0}
              %)
            </span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Current Occupancy Status:</span>
            <span className={`summary-value occupancy-${(revenue.occupancyRate ?? 0) > 70 ? 'high' : (revenue.occupancyRate ?? 0) > 40 ? 'medium' : 'low'}`}>
              {(revenue.occupancyRate ?? 0).toFixed(0)}% Occupied
            </span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>Revenue Information</h3>
        <p>
          Your property has generated a total revenue of <strong>₹{(revenue.total_revenue ?? 0).toLocaleString()}</strong> with
          an occupancy rate of <strong>{(revenue.occupancyRate ?? 0).toFixed(0)}%</strong>.
          Continue managing your bookings and maintaining excellent guest experiences to increase your earnings.
        </p>
      </div>
    </section>
  );
}
