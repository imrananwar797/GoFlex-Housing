import React, { useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Home, Placeholder } from './pages';
import { AuthProvider, useAuth } from './auth/AuthContext';
import RequireAuth from './components/auth/RequireAuth';
import { UserDashboard } from './pages/Dashboards';
import ScrollTop from './components/common/ScrollTop';
import HelpFab from './components/common/HelpFab';
import Login from './pages/Login';
import Register from './pages/Register';
import Gallery from './pages/Gallery';
import Properties from './pages/Properties';
import Locations from './pages/Locations';
import Community from './pages/Community';
import Amenities from './pages/Amenities';
import Contact from './pages/Contact';
import Documents from './pages/Documents';
import About from './pages/About';
import Terms from './pages/Terms';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AdminOverview from './pages/admin/AdminOverview';
import Settings from './pages/Settings';
import PropertyDetail from './pages/PropertyDetail';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProperties from './pages/admin/AdminProperties';
import AdminBookings from './pages/admin/AdminBookings';
import AdminFraudAlerts from './pages/admin/AdminFraudAlerts';
import OwnerProperties from './pages/owner/OwnerProperties';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerResidents from './pages/owner/OwnerResidents';
import OwnerRevenue from './pages/owner/OwnerRevenue';
import OwnerPropertyDetail from './pages/owner/OwnerPropertyDetail';
import OwnerPropertyBookings from './pages/owner/OwnerPropertyBookings';
import OwnerPropertyReviews from './pages/owner/OwnerPropertyReviews';
import OwnerPropertyRevenue from './pages/owner/OwnerPropertyRevenue';
import KYCStatus from './pages/kyc/KYCStatus';
import KYCUpload from './pages/kyc/KYCUpload';
import KYCVerify from './pages/kyc/KYCVerify';
import SubscriptionPlans from './pages/subscriptions/SubscriptionPlans';
import SubscriptionCurrent from './pages/subscriptions/SubscriptionCurrent';
import SubscriptionHistory from './pages/subscriptions/SubscriptionHistory';
import Referrals from './pages/Referrals';
import './index.css';

function NotFound() {
  return (
    <section className="content-wrap">
      <h1 className="page-title">Page not found</h1>
      <p className="card-text">Please use the navigation to continue.</p>
    </section>
  );
}

function NavAuthActions() {
  const { user, logout } = useAuth();
  if (!user) return (
    <div className="nav-actions">
      <NavLink to="/login" className="btn-login">Log In</NavLink>
      <NavLink to="/register" className="btn-signup">Sign Up</NavLink>
    </div>
  );

  const dashboardLink = user.role === 'admin'
    ? '/admin/dashboard'
    : user.role === 'owner'
    ? '/owner/dashboard'
    : '/dashboard';

  return (
    <div className="nav-actions">
      <NavLink to={dashboardLink} className="nav-link active">Dashboard</NavLink>
      <button className="nav-link" onClick={logout}>Logout</button>
    </div>
  );
}

function NavLocationPicker() {
  const [selectedLocation, setSelectedLocation] = useState('Kolkata');
  const [isOpen, setIsOpen] = useState(false);
  const locations = ['Mumbai', 'New Delhi', 'Jaipur', 'Kolkata', 'Chennai', 'Bengaluru', 'Hyderabad', 'Goa', 'Pune'];

  return (
    <div className="nav-location-container">
      <button className="nav-location-pill" onClick={() => setIsOpen(!isOpen)}>
        <span className="location-icon">📍</span>
        <span className="location-text">{selectedLocation}</span>
        <span className="chevron">▾</span>
      </button>
      
      {isOpen && (
        <div className="location-dropdown bg-glass-heavy">
          {locations.map(loc => (
            <button 
              key={loc} 
              className={`location-item ${selectedLocation === loc ? 'active' : ''}`}
              onClick={() => {
                setSelectedLocation(loc);
                setIsOpen(false);
              }}
            >
              {loc}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const mainNav = [
    { to: '/', label: 'Home' },
    { to: '/properties', label: 'Properties' },
    { to: '/locations', label: 'Locations' },
    { to: '/community', label: 'Community' },
  ];

  const secondaryNav = [
    { to: '/gallery', label: 'Gallery' },
    { to: '/blog', label: 'Blog' },
    { to: '/amenities', label: 'Amenities' },
    { to: '/about', label: 'About' }
  ];

  const isDashboard = location.pathname.startsWith('/dashboard') || 
                      location.pathname.startsWith('/admin') || 
                      location.pathname.startsWith('/owner') ||
                      location.pathname.startsWith('/kyc') ||
                      location.pathname.startsWith('/subscriptions') ||
                      location.pathname.startsWith('/referrals') ||
                      location.pathname.startsWith('/settings');

  return (
    <AuthProvider>
      <div className={isDashboard ? "app-shell is-dash" : "app-shell"}>
        {!isDashboard && (
          <header className="site-header">
            <nav className="nav-bar">
              <div className="nav-section-left">
                <NavLink to="/" className="brand-link">
                  GOFLEX<span className="text-neon-blue">.</span>
                </NavLink>
              </div>

              <div className="nav-section-center">
                <div className="nav-links">
                  {mainNav.map((n) => (
                    <NavLink
                      key={n.to}
                      to={n.to}
                      className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                    >
                      {n.label}
                    </NavLink>
                  ))}
                  <div className="nav-dropdown-trigger group relative">
                    <button className="nav-link flex items-center gap-1">
                      More
                      <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <div className="bg-[#0B0E14] border border-white/10 rounded-2xl p-2 shadow-2xl min-w-[160px] backdrop-blur-xl">
                        {secondaryNav.map((n) => (
                          <NavLink
                            key={n.to}
                            to={n.to}
                            className="block px-4 py-2 text-[12px] font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                          >
                            {n.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="nav-section-right">
                <NavLocationPicker />
                <div className="nav-actions">
                  <div className="relative group">
                    <input 
                      type="text" 
                      className="nav-search-pill" 
                      placeholder="Search..." 
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-focus-within:text-neon-blue transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <NavAuthActions />
                </div>
              </div>
            </nav>
          </header>
        )}

        <main className={isDashboard ? "main-content-dash" : "main-content"}>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Owner Routes (Priority) */}
              <Route path="/owner/dashboard" element={<RequireAuth role="owner"><OwnerDashboard /></RequireAuth>} />
              <Route path="/owner/residents" element={<RequireAuth role="owner"><OwnerResidents /></RequireAuth>} />
              <Route path="/owner/revenue" element={<RequireAuth role="owner"><OwnerRevenue /></RequireAuth>} />
              <Route path="/owner/properties" element={<RequireAuth role="owner"><OwnerProperties /></RequireAuth>} />
              <Route path="/owner/properties/:propertyId" element={<RequireAuth role="owner"><OwnerPropertyDetail /></RequireAuth>} />
              <Route path="/owner/properties/:propertyId/bookings" element={<RequireAuth role="owner"><OwnerPropertyBookings /></RequireAuth>} />
              <Route path="/owner/properties/:propertyId/reviews" element={<RequireAuth role="owner"><OwnerPropertyReviews /></RequireAuth>} />
              <Route path="/owner/properties/:propertyId/revenue" element={<RequireAuth role="owner"><OwnerPropertyRevenue /></RequireAuth>} />

              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/community" element={<Community />} />
              <Route path="/amenities" element={<Amenities />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />

              {/* Resident Routes */}
              <Route path="/dashboard" element={<RequireAuth role="resident"><UserDashboard /></RequireAuth>} />
              <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<RequireAuth role="admin"><AdminOverview /></RequireAuth>} />
              <Route path="/admin/users" element={<RequireAuth role="admin"><AdminUsers /></RequireAuth>} />
              <Route path="/admin/properties" element={<RequireAuth role="admin"><AdminProperties /></RequireAuth>} />
              <Route path="/admin/bookings" element={<RequireAuth role="admin"><AdminBookings /></RequireAuth>} />
              <Route path="/admin/fraud-alerts" element={<RequireAuth role="admin"><AdminFraudAlerts /></RequireAuth>} />

              <Route path="/kyc/status" element={<RequireAuth><KYCStatus /></RequireAuth>} />
              <Route path="/kyc/upload" element={<RequireAuth><KYCUpload /></RequireAuth>} />
              <Route path="/kyc/verify" element={<RequireAuth><KYCVerify /></RequireAuth>} />

              <Route path="/subscriptions/plans" element={<RequireAuth><SubscriptionPlans /></RequireAuth>} />
              <Route path="/subscriptions/current" element={<RequireAuth><SubscriptionCurrent /></RequireAuth>} />
              <Route path="/subscriptions/history" element={<RequireAuth><SubscriptionHistory /></RequireAuth>} />
              <Route path="/referrals" element={<RequireAuth><Referrals /></RequireAuth>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
        {!isDashboard && <ScrollTop />}
        {!isDashboard && <HelpFab />}
        {!isDashboard && (
          <footer className="site-footer">
            <div className="footer-inner">
              <div className="footer-branding">
                <NavLink to="/" className="footer-brand-link" aria-label="GoFlex Housing home">
                  <img className="footer-brand-logo" src="https://cdn.builder.io/api/v1/image/assets%2Fd6633193bc9341db92fc7ba045098b86%2F7a5b4b23ef0b413783eb1f928bffc680?format=webp&width=800" alt="GoFlex Housing logo" />
                  <span className="footer-brand-text">GoFlex Housing</span>
                </NavLink>
                <p className="footer-summary">Flexible co-living spaces curated for modern professionals across thriving cities.</p>
              </div>
              <div className="footer-column">
                <h3 className="footer-heading">Explore</h3>
                <NavLink to="/properties" className="footer-link">Properties</NavLink>
                <NavLink to="/gallery" className="footer-link">Gallery</NavLink>
                <NavLink to="/locations" className="footer-link">Locations</NavLink>
                <NavLink to="/blog" className="footer-link">Blog</NavLink>
                <NavLink to="/amenities" className="footer-link">Amenities</NavLink>
              </div>
              <div className="footer-column">
                <h3 className="footer-heading">Company</h3>
                <NavLink to="/about" className="footer-link">About</NavLink>
                <NavLink to="/community" className="footer-link">Community</NavLink>
                <NavLink to="/documents" className="footer-link">Documents</NavLink>
                <NavLink to="/terms" className="footer-link">Terms</NavLink>
              </div>
              <div className="footer-column">
                <h3 className="footer-heading">Support</h3>
                <NavLink to="/contact" className="footer-link">Contact</NavLink>
                <NavLink to="/team" className="footer-link">Our Team</NavLink>
                <NavLink to="/login" className="footer-link">Resident Portal</NavLink>
                <NavLink to="/register" className="footer-link">Join GoFlex</NavLink>
              </div>
            </div>
            <div className="footer-meta">
              <span className="footer-copy">© {new Date().getFullYear()} GoFlex Housing. All rights reserved.</span>
            </div>
          </footer>
        )}
      </div>
    </AuthProvider>
  );
}
