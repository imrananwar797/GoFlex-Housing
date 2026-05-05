import React from 'react';
import { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Home, Placeholder } from './pages';
import { AuthProvider, useAuth } from './auth/AuthContext';
import RequireAuth from './components/auth/RequireAuth';
import { AdminDashboard, UserDashboard } from './pages/Dashboards';
import LocationClock from './components/common/LocationClock';
import HeaderSearch from './components/common/HeaderSearch';
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
      <NavLink to="/login" className="nav-link btn-login">Login</NavLink>
    </div>
  );

  const dashboardLink = user.role === 'admin'
    ? '/admin/dashboard'
    : user.role === 'owner'
    ? '/owner/properties'
    : '/dashboard';

  return (
    <div className="nav-actions">
      <NavLink to={dashboardLink} className="nav-link active">Dashboard</NavLink>
      <NavLink to="/kyc/status" className="nav-link">Verification</NavLink>
      <NavLink to="/subscriptions/plans" className="nav-link">Subscriptions</NavLink>
      <NavLink to="/referrals" className="nav-link">Referrals</NavLink>
      <button className="nav-link" onClick={logout}>Logout</button>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((value) => !value);
  const nav = [
    { to: '/', label: 'Home' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/properties', label: 'Properties' },
    { to: '/locations', label: 'Locations' },
    { to: '/blog', label: 'Blog' },
    { to: '/community', label: 'Community' },
    { to: '/amenities', label: 'Amenities' },
    { to: '/team', label: 'Team' },
    { to: '/about', label: 'About' },
    { to: '/documents', label: 'Documents' },
    { to: '/terms', label: 'Terms' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <AuthProvider>
      <div className="app-shell">
        <header className="site-header">
          <nav className="nav-bar">
            <button
              type="button"
              className={menuOpen ? 'menu-trigger active' : 'menu-trigger'}
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              aria-controls="global-navigation"
            >
              <span className="menu-bar" />
              <span className="menu-bar" />
              <span className="menu-bar" />
            </button>
            <LocationClock />
            <NavLink to="/" className="brand-link" aria-label="GoFlex Housing">
              <img className="brand-logo" src="https://cdn.builder.io/api/v1/image/assets%2Fd6633193bc9341db92fc7ba045098b86%2F7a5b4b23ef0b413783eb1f928bffc680?format=webp&width=800" alt="GoFlex Housing logo" />
              <span className="brand-text">GoFlex Housing</span>
            </NavLink>
            <div className="nav-utility">
              <HeaderSearch />
              <NavAuthActions />
            </div>
          </nav>
        </header>
        <div
          className={menuOpen ? 'nav-drawer-overlay visible' : 'nav-drawer-overlay'}
          onClick={() => setMenuOpen(false)}
          role="presentation"
          aria-hidden={!menuOpen}
        />
        <aside
          id="global-navigation"
          className={menuOpen ? 'nav-drawer open' : 'nav-drawer'}
          aria-hidden={!menuOpen}
        >
          <div className="nav-drawer-inner">
            <div className="drawer-header">
              <span className="drawer-title">Navigation</span>
              <button
                type="button"
                className="drawer-close"
                onClick={toggleMenu}
                aria-label="Close navigation menu"
              >
                <span className="drawer-close-bar" />
                <span className="drawer-close-bar" />
              </button>
            </div>
            <div className="drawer-links">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) => (isActive ? 'drawer-link active' : 'drawer-link')}
                  onClick={() => setMenuOpen(false)}
                >
                  {n.label}
                </NavLink>
              ))}
            </div>
            <div className="drawer-auth">
              <NavAuthActions />
            </div>
            <div className="drawer-footer">
              <p className="drawer-note">Need something else? Contact our concierge team.</p>
              <NavLink to="/contact" className="drawer-contact-link" onClick={() => setMenuOpen(false)}>
                Contact us
              </NavLink>
            </div>
          </div>
        </aside>
        <main className="main-content">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/community" element={<Community />} />
            <Route path="/amenities" element={<Amenities />} />
            <Route path="/team" element={<Placeholder title="Team" />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/dashboard-admin" element={<RequireAuth role="admin"><AdminOverview /></RequireAuth>} />
            <Route path="/dashboard" element={<RequireAuth role="resident"><UserDashboard /></RequireAuth>} />
            <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />

            <Route path="/admin/dashboard" element={<RequireAuth role="admin"><AdminOverview /></RequireAuth>} />
            <Route path="/admin/users" element={<RequireAuth role="admin"><AdminUsers /></RequireAuth>} />
            <Route path="/admin/properties" element={<RequireAuth role="admin"><AdminProperties /></RequireAuth>} />
            <Route path="/admin/bookings" element={<RequireAuth role="admin"><AdminBookings /></RequireAuth>} />
            <Route path="/admin/fraud-alerts" element={<RequireAuth role="admin"><AdminFraudAlerts /></RequireAuth>} />

            <Route path="/owner/properties" element={<RequireAuth role="owner"><OwnerProperties /></RequireAuth>} />
            <Route path="/owner/properties/:propertyId" element={<RequireAuth role="owner"><OwnerPropertyDetail /></RequireAuth>} />
            <Route path="/owner/properties/:propertyId/bookings" element={<RequireAuth role="owner"><OwnerPropertyBookings /></RequireAuth>} />
            <Route path="/owner/properties/:propertyId/reviews" element={<RequireAuth role="owner"><OwnerPropertyReviews /></RequireAuth>} />
            <Route path="/owner/properties/:propertyId/revenue" element={<RequireAuth role="owner"><OwnerPropertyRevenue /></RequireAuth>} />

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
        <ScrollTop />
        <HelpFab />
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
      </div>
    </AuthProvider>
  );
}
