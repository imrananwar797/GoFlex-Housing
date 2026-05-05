import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { adminService, DashboardMetrics } from '../../services/admin.service';
import StatCard from '../../components/dashboard/StatCard';
import '../Dashboard.css';

export default function AdminOverview() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const result = await adminService.getDashboard();
        setMetrics(result.data);
      } catch (err) {
        setError('Failed to load dashboard metrics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (!metrics && loading) {
    return (
      <section className="content-wrap">
        <div className="loading-state">Loading admin dashboard...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="content-wrap">
        <div className="error-state">{error}</div>
      </section>
    );
  }

  return (
    <section className="content-wrap dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">Platform metrics and management overview</p>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Total Users" 
          value={metrics?.users.total_users || 0}
          suffix="users"
        />
        <StatCard 
          title="Active Users" 
          value={metrics?.users.active_users || 0}
          suffix="active"
        />
        <StatCard 
          title="New Users (Month)" 
          value={metrics?.users.new_users_month || 0}
          suffix="new"
        />
        <StatCard 
          title="Total Properties" 
          value={metrics?.properties.total_properties || 0}
          suffix="properties"
        />
        <StatCard 
          title="Verified Properties" 
          value={metrics?.properties.verified_properties || 0}
          suffix="verified"
        />
        <StatCard 
          title="New Properties (Month)" 
          value={metrics?.properties.new_properties_month || 0}
          suffix="new"
        />
        <StatCard 
          title="Total Bookings" 
          value={metrics?.bookings.total_bookings || 0}
          suffix="bookings"
        />
        <StatCard 
          title="Active Bookings" 
          value={metrics?.bookings.active_bookings || 0}
          suffix="active"
        />
        <StatCard 
          title="Completed Bookings" 
          value={metrics?.bookings.completed_bookings || 0}
          suffix="completed"
        />
        <StatCard 
          title="Total Revenue" 
          value={`₹${(metrics?.revenue.total_revenue || 0).toLocaleString()}`}
        />
        <StatCard 
          title="Monthly Revenue" 
          value={`₹${(metrics?.revenue.revenue_month || 0).toLocaleString()}`}
        />
        <StatCard 
          title="Weekly Revenue" 
          value={`₹${(metrics?.revenue.revenue_week || 0).toLocaleString()}`}
        />
      </div>

      <div className="admin-nav-section">
        <h2 className="section-title">Management Sections</h2>
        <div className="management-grid">
          <NavLink to="/admin/users" className="management-card">
            <div className="card-icon">👥</div>
            <h3>User Management</h3>
            <p>Manage users, verify accounts, and manage permissions</p>
          </NavLink>
          <NavLink to="/admin/properties" className="management-card">
            <div className="card-icon">🏠</div>
            <h3>Property Verification</h3>
            <p>Review and approve properties, manage listings</p>
          </NavLink>
          <NavLink to="/admin/bookings" className="management-card">
            <div className="card-icon">📅</div>
            <h3>Booking Management</h3>
            <p>Manage bookings, process refunds, view status</p>
          </NavLink>
          <NavLink to="/admin/fraud-alerts" className="management-card">
            <div className="card-icon">⚠️</div>
            <h3>Fraud Monitoring</h3>
            <p>Monitor fraud alerts and suspicious activities</p>
          </NavLink>
        </div>
      </div>
    </section>
  );
}
