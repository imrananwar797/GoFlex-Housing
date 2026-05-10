import React, { useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Home, Placeholder, Team } from './pages';
import { AuthProvider, useAuth } from './auth/AuthContext';
import RequireAuth from './components/auth/RequireAuth';
import ErrorBoundary from './components/common/ErrorBoundary';
import AIConcierge from './components/ai/AIConcierge';
import { UserDashboard } from './pages/Dashboards';
import ScrollTop from './components/common/ScrollTop';
import HelpFab from './components/common/HelpFab';
import './index.css';

// Lazy loaded components
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const Properties = React.lazy(() => import('./pages/Properties'));
const PropertyDetail = React.lazy(() => import('./pages/PropertyDetail'));
const Blog = React.lazy(() => import('./pages/Blog'));
const About = React.lazy(() => import('./pages/About'));
const Community = React.lazy(() => import('./pages/Community'));
const Amenities = React.lazy(() => import('./pages/Amenities'));
const Locations = React.lazy(() => import('./pages/Locations'));
const Contact = React.lazy(() => import('./pages/Contact'));

const OwnerDashboard = React.lazy(() => import('./pages/owner/OwnerDashboard'));
const OwnerProperties = React.lazy(() => import('./pages/owner/OwnerProperties'));
const OwnerResidents = React.lazy(() => import('./pages/owner/OwnerResidents'));
const OwnerRevenue = React.lazy(() => import('./pages/owner/OwnerRevenue'));
const OwnerPropertyDetail = React.lazy(() => import('./pages/owner/OwnerPropertyDetail'));
const OwnerPropertyBookings = React.lazy(() => import('./pages/owner/OwnerPropertyBookings'));
const OwnerPropertyRevenue = React.lazy(() => import('./pages/owner/OwnerPropertyRevenue'));
const OwnerPropertyReviews = React.lazy(() => import('./pages/owner/OwnerPropertyReviews'));

const AdminOverview = React.lazy(() => import('./pages/admin/AdminOverview'));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'));
const AdminProperties = React.lazy(() => import('./pages/admin/AdminProperties'));
const AdminBookings = React.lazy(() => import('./pages/admin/AdminBookings'));
const AdminFraudAlerts = React.lazy(() => import('./pages/admin/AdminFraudAlerts'));

const KYCStatus = React.lazy(() => import('./pages/kyc/KYCStatus'));
const KYCUpload = React.lazy(() => import('./pages/kyc/KYCUpload'));
const KYCVerify = React.lazy(() => import('./pages/kyc/KYCVerify'));

const SubscriptionPlans = React.lazy(() => import('./pages/subscriptions/SubscriptionPlans'));
const SubscriptionCurrent = React.lazy(() => import('./pages/subscriptions/SubscriptionCurrent'));
const SubscriptionHistory = React.lazy(() => import('./pages/subscriptions/SubscriptionHistory'));

const Referrals = React.lazy(() => import('./pages/Referrals'));
const Settings = React.lazy(() => import('./pages/Settings'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

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

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <ErrorBoundary>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-neon-blue origin-left z-[100]"
        style={{ scaleX }}
      />
      <AuthProvider>
        <div className={isDashboard ? "app-shell is-dash" : "app-shell"}>
          {!isDashboard && (
            <header className="site-header">
              <nav className="nav-bar">
                <div className="nav-section-left">
                  <NavLink to="/" className="brand-link">
                    GoFlex <span className="text-neon-blue ml-2">Housing</span>
                  </NavLink>
                </div>

                <div className="nav-section-center hidden-mobile">
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
                  <div className="hidden-mobile flex items-center gap-4">
                    <NavLocationPicker />
                  </div>
                  <div className="nav-actions">
                    <div className="relative group hidden-mobile">
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
                    
                    <div className="hidden-mobile">
                      <NavAuthActions />
                    </div>

                    <button 
                      className="only-mobile p-2 text-white hover:bg-white/5 rounded-full"
                      onClick={() => setIsMobileMenuOpen(true)}
                    >
                      <Menu size={24} />
                    </button>
                  </div>
                </div>
              </nav>
            </header>
          )}

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                className="mobile-menu-overlay"
              >
                <div className="flex justify-between items-center">
                  <span className="brand-link p-0">
                    GoFlex <span className="text-neon-blue ml-2">Housing</span>
                  </span>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-white"
                  >
                    <X size={32} />
                  </button>
                </div>

                <div className="mobile-menu-content">
                  {[...mainNav, ...secondaryNav].map((n) => (
                    <NavLink
                      key={n.to}
                      to={n.to}
                      className={({ isActive }) => isActive ? "mobile-nav-link active" : "mobile-nav-link"}
                    >
                      {n.label}
                    </NavLink>
                  ))}
                  <div className="pt-8 border-t border-white/10 mt-8">
                     <NavAuthActions />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <main className={isDashboard ? "main-content-dash" : "main-content"}>
            <React.Suspense fallback={<div className="loading-state">Loading GoFlex...</div>}>
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Owner Routes */}
                  <Route path="/owner/dashboard" element={<RequireAuth role="owner"><OwnerDashboard /></RequireAuth>} />
                  <Route path="/owner/properties" element={<RequireAuth role="owner"><OwnerProperties /></RequireAuth>} />
                  <Route path="/owner/residents" element={<RequireAuth role="owner"><OwnerResidents /></RequireAuth>} />
                  <Route path="/owner/revenue" element={<RequireAuth role="owner"><OwnerRevenue /></RequireAuth>} />
                  <Route path="/owner/properties/:id" element={<RequireAuth role="owner"><OwnerPropertyDetail /></RequireAuth>} />
                  <Route path="/owner/properties/:id/bookings" element={<RequireAuth role="owner"><OwnerPropertyBookings /></RequireAuth>} />
                  <Route path="/owner/properties/:id/revenue" element={<RequireAuth role="owner"><OwnerPropertyRevenue /></RequireAuth>} />
                  <Route path="/owner/properties/:id/reviews" element={<RequireAuth role="owner"><OwnerPropertyReviews /></RequireAuth>} />

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
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/team" element={<Team />} />

                  {/* Resident/KYC/Subscription Routes */}
                  <Route path="/dashboard" element={<RequireAuth role="resident"><UserDashboard /></RequireAuth>} />
                  <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
                  <Route path="/referrals" element={<RequireAuth role="resident"><Referrals /></RequireAuth>} />
                  
                  <Route path="/kyc/status" element={<RequireAuth role="resident"><KYCStatus /></RequireAuth>} />
                  <Route path="/kyc/upload" element={<RequireAuth role="resident"><KYCUpload /></RequireAuth>} />
                  <Route path="/kyc/verify" element={<RequireAuth role="resident"><KYCVerify /></RequireAuth>} />

                  <Route path="/subscriptions/plans" element={<RequireAuth role="resident"><SubscriptionPlans /></RequireAuth>} />
                  <Route path="/subscriptions/current" element={<RequireAuth role="resident"><SubscriptionCurrent /></RequireAuth>} />
                  <Route path="/subscriptions/history" element={<RequireAuth role="resident"><SubscriptionHistory /></RequireAuth>} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={<RequireAuth role="admin"><AdminOverview /></RequireAuth>} />
                  <Route path="/admin/users" element={<RequireAuth role="admin"><AdminUsers /></RequireAuth>} />
                  <Route path="/admin/properties" element={<RequireAuth role="admin"><AdminProperties /></RequireAuth>} />
                  <Route path="/admin/bookings" element={<RequireAuth role="admin"><AdminBookings /></RequireAuth>} />
                  <Route path="/admin/fraud" element={<RequireAuth role="admin"><AdminFraudAlerts /></RequireAuth>} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </React.Suspense>
          </main>
          {!isDashboard && <ScrollTop />}
          {!isDashboard && <HelpFab />}
          <AIConcierge />
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
    </ErrorBoundary>
  );
}
