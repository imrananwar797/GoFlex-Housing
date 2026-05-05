import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { api } from '../services/api';

interface DashboardStats {
  totalBookings: number;
  completedStays: number;
  avgRating: number;
  totalSpent: number;
  loyaltyPoints: number;
  upcomingStays: number;
  reviewsGiven: number;
}

interface Booking {
  id: string;
  property_id: string;
  check_in_date: string;
  check_out_date: string;
  status: string;
  total_amount: number;
  name: string;
  city: string;
  state: string;
  featured_image: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get('/api/users/dashboard/stats'),
          api.get('/api/bookings/user/my-bookings'),
        ]);

        setStats(statsRes.data.data);
        setBookings(bookingsRes.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (!user) {
    return (
      <section className="content-wrap">
        <h1 className="page-title">Please login to access your dashboard</h1>
        <NavLink to="/login" className="btn-cta">Login</NavLink>
      </section>
    );
  }

  return (
    <section className="content-wrap dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome back, {user.username}!</h1>
        <p className="dashboard-subtitle">Here's your GoFlex Housing overview</p>
      </div>

      {loading ? (
        <div className="loading-state">Loading your dashboard...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <span className="stat-label">Total Bookings</span>
                <span className="stat-value">{stats?.totalBookings || 0}</span>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon">✓</div>
              <div className="stat-content">
                <span className="stat-label">Completed Stays</span>
                <span className="stat-value">{stats?.completedStays || 0}</span>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <span className="stat-label">Average Rating</span>
                <span className="stat-value">{stats?.avgRating?.toFixed(1) || '0'}</span>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <span className="stat-label">Total Spent</span>
                <span className="stat-value">₹{(stats?.totalSpent || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon">🎁</div>
              <div className="stat-content">
                <span className="stat-label">Loyalty Points</span>
                <span className="stat-value">{stats?.loyaltyPoints || 0}</span>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <span className="stat-label">Upcoming Stays</span>
                <span className="stat-value">{stats?.upcomingStays || 0}</span>
              </div>
            </div>
          </div>

          <div className="bookings-section">
            <div className="section-header">
              <h2 className="section-title">Your Bookings</h2>
              <NavLink to="/properties" className="btn-ghost">Book New</NavLink>
            </div>

            {bookings.length === 0 ? (
              <div className="empty-state">
                <p>No bookings yet. Start exploring properties!</p>
                <NavLink to="/properties" className="btn-cta">Browse Properties</NavLink>
              </div>
            ) : (
              <div className="bookings-grid">
                {bookings.map((booking) => (
                  <div key={booking.id} className="booking-card">
                    <img
                      src={booking.featured_image || 'https://via.placeholder.com/300x200'}
                      alt={booking.name}
                      className="booking-image"
                    />
                    <div className="booking-content">
                      <h3>{booking.name}</h3>
                      <p className="booking-location">{booking.city}, {booking.state}</p>
                      <div className="booking-dates">
                        <span>Check-in: {new Date(booking.check_in_date).toLocaleDateString()}</span>
                        <span>Check-out: {new Date(booking.check_out_date).toLocaleDateString()}</span>
                      </div>
                      <div className="booking-footer">
                        <span className={`booking-status status-${booking.status}`}>{booking.status}</span>
                        <span className="booking-amount">₹{booking.total_amount.toLocaleString()}</span>
                      </div>
                      <NavLink to={`/properties/${booking.property_id}`} className="btn-ghost">View Property</NavLink>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
