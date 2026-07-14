import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X, Mail, Phone, ShieldCheck, Github, Twitter, Linkedin, Instagram, Youtube, ChevronDown, Search } from 'lucide-react';
import Home from './pages/Home';
import Placeholder from './pages/Placeholder';
import Team from './pages/Team';
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
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Careers = React.lazy(() => import('./pages/Careers'));
const HowItWorks = React.lazy(() => import('./pages/HowItWorks'));

const OwnerDashboard = React.lazy(() => import('./pages/owner/OwnerDashboard'));
const OwnerProperties = React.lazy(() => import('./pages/owner/OwnerProperties'));
const OwnerResidents = React.lazy(() => import('./pages/owner/OwnerResidents'));
const OwnerRevenue = React.lazy(() => import('./pages/owner/OwnerRevenue'));
const OwnerPropertyDetail = React.lazy(() => import('./pages/owner/OwnerPropertyDetail'));
const OwnerPropertyBookings = React.lazy(() => import('./pages/owner/OwnerPropertyBookings'));
const OwnerPropertyRevenue = React.lazy(() => import('./pages/owner/OwnerPropertyRevenue'));
const OwnerPropertyReviews = React.lazy(() => import('./pages/owner/OwnerPropertyReviews'));
const OwnerComplaints = React.lazy(() => import('./pages/owner/OwnerComplaints'));
const OwnerRooms       = React.lazy(() => import('./pages/owner/OwnerRooms'));
const OwnerVisitors    = React.lazy(() => import('./pages/owner/OwnerVisitors'));
const OwnerUtilities   = React.lazy(() => import('./pages/owner/OwnerUtilities'));
const OwnerAgreements  = React.lazy(() => import('./pages/owner/OwnerAgreements'));

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

// Resident Dashboard Pages
const ResidentDashboard = React.lazy(() => import('./pages/resident/ResidentDashboard'));
const ResidentPayments  = React.lazy(() => import('./pages/resident/ResidentPayments'));
const ResidentComplaints = React.lazy(() => import('./pages/resident/ResidentComplaints'));
const ResidentCommunity  = React.lazy(() => import('./pages/resident/ResidentCommunity'));
const ResidentServices   = React.lazy(() => import('./pages/resident/ResidentServices'));
const ResidentAgreement  = React.lazy(() => import('./pages/resident/ResidentAgreement'));

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
    <div className="flex items-center gap-2">
      <NavLink
        to="/login"
        className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-200"
      >
        Login
      </NavLink>
      <NavLink
        to="/properties"
        className="text-[11px] font-bold uppercase tracking-widest text-white border border-white/15 hover:border-white/30 px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-200"
      >
        Find Home
      </NavLink>
      <NavLink
        to="/owner/properties"
        className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest bg-[#00D1FF] hover:bg-[#00BFEA] text-[#080A0E] px-4 py-2 rounded-lg transition-all duration-200 shadow-[0_0_18px_rgba(0,209,255,0.25)] hover:shadow-[0_0_24px_rgba(0,209,255,0.4)] hover:-translate-y-0.5"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span>List Property</span>
      </NavLink>
    </div>
  );

  const dashboardLink = user.role === 'admin'
    ? '/admin/dashboard'
    : user.role === 'owner'
    ? '/owner/dashboard'
    : '/resident/dashboard';

  return (
    <div className="flex items-center gap-2">
      <NavLink
        to={dashboardLink}
        className="text-[11px] font-bold uppercase tracking-widest text-white border border-white/15 hover:border-white/30 px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-200"
      >
        Dashboard
      </NavLink>
      <button
        onClick={logout}
        className="text-[11px] font-bold uppercase tracking-widest bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 px-3 py-2 rounded-lg transition-all duration-200"
      >
        Logout
      </button>
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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const triggerInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    }
  };

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
                      location.pathname.startsWith('/resident') ||
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
            <header className="site-header w-full px-2 md:px-4">
              <nav className="nav-bar relative flex items-center justify-between">

                {/* ── LEFT: Logo ── */}
                <NavLink to="/" className="flex items-center gap-2.5 flex-shrink-0 group/logo">
                  <img src="/logo.png" alt="GoFlex Logo" className="h-8 w-auto object-contain group-hover/logo:scale-110 transition-transform duration-300" />
                  <div className="flex flex-col leading-none">
                    <span className="font-black tracking-[0.15em] text-white text-[13px]">GOFLEX</span>
                    <span className="font-bold tracking-[0.2em] text-[#00D1FF] text-[8px]">HOUSING</span>
                  </div>
                </NavLink>

                {/* ── CENTER: Desktop Mega Nav ── */}
                <div className="hidden xl:flex items-center gap-1 bg-white/[0.04] px-2 py-1.5 rounded-2xl border border-white/[0.07] relative">

                  {/* Mega Menu Group (triggers only on Marketplace, Services, Cities, Enterprise) */}
                  <div className="flex items-center gap-1 group/mega">
                    {/* Nav Buttons */}
                    {[
                      { label: 'Marketplace' },
                      { label: 'Services' },
                      { label: 'Cities' },
                      { label: 'Enterprise' },
                    ].map((item) => (
                      <button
                        key={item.label}
                        className="nav-pill"
                      >
                        {item.label} <ChevronDown size={9} className="opacity-60" />
                      </button>
                    ))}

                    {/* ── Unified Mega-Menu Panel ── */}
                    <div className="mega-menu-panel">
                      <div className="mega-menu-inner">
                        {/* Marketplace */}
                        <div className="mega-col">
                          <h5 className="mega-col-title"><span className="mega-dot" /> Marketplace</h5>
                          <NavLink to="/properties?type=buy" className="mega-link">Buy Property</NavLink>
                          <NavLink to="/properties?type=rent" className="mega-link">Rent Property</NavLink>
                          <NavLink to="/properties?category=coliving" className="mega-link">PG &amp; Co-Living</NavLink>
                          <NavLink to="/properties?category=commercial" className="mega-link">Commercial</NavLink>
                          <NavLink to="/properties?category=student" className="mega-link">Student Housing</NavLink>
                          <NavLink to="/properties?category=luxury" className="mega-link">Luxury Homes</NavLink>
                          <NavLink to="/properties" className="mega-link-cta">View all →</NavLink>
                        </div>
                        {/* Services */}
                        <div className="mega-col">
                          <h5 className="mega-col-title"><span className="mega-dot" /> Services</h5>
                          <NavLink to="/properties" className="mega-link flex items-center gap-1.5">
                            AI Property Match <span className="badge-ai">AI</span>
                          </NavLink>
                          <NavLink to="/how-it-works" className="mega-link">Housing Management</NavLink>
                          <NavLink to="/resident/agreement" className="mega-link">Rent Agreement</NavLink>
                          <NavLink to="/kyc/status" className="mega-link">Digital KYC</NavLink>
                          <NavLink to="/resident/payments" className="mega-link">Online Payments</NavLink>
                          <NavLink to="/resident/services" className="mega-link">Maintenance</NavLink>
                          <NavLink to="/properties" className="mega-link-cta">View all →</NavLink>
                        </div>
                        {/* Cities */}
                        <div className="mega-col">
                          <h5 className="mega-col-title"><span className="mega-dot" /> Top Cities</h5>
                          {['Kolkata','Bangalore','Hyderabad','Mumbai','Delhi','Pune','Chennai'].map((city) => (
                            <NavLink key={city} to={`/locations?city=${city.toLowerCase()}`} className="mega-link">{city}</NavLink>
                          ))}
                          <NavLink to="/locations" className="mega-link-cta">View all →</NavLink>
                        </div>
                        {/* Enterprise */}
                        <div className="mega-col">
                          <h5 className="mega-col-title"><span className="mega-dot" /> Enterprise</h5>
                          <NavLink to="/owner/properties" className="mega-link">For Owners</NavLink>
                          <NavLink to="/about" className="mega-link">For Builders</NavLink>
                          <NavLink to="/about" className="mega-link">For Property Managers</NavLink>
                          <NavLink to="/about" className="mega-link">For PG Operators</NavLink>
                          <NavLink to="/about" className="mega-link">Corporate Housing</NavLink>
                          <NavLink to="/about" className="mega-link">Universities</NavLink>
                          <NavLink to="/about" className="mega-link-cta">Explore →</NavLink>
                        </div>
                      </div>
                    </div>
                  </div>

                  <NavLink to="/subscriptions/plans" className="nav-pill">Pricing</NavLink>

                  {/* About dropdown */}
                  <div className="relative group/about">
                    <button className="nav-pill">
                      About <ChevronDown size={9} className="opacity-60" />
                    </button>
                    <div className="about-dropdown">
                      <div className="about-dropdown-panel">
                        {[
                          { to: '/about', label: 'Company' },
                          { to: '/careers', label: 'Careers' },
                          { to: '/about', label: 'Press' },
                          { to: '/blog', label: 'Blog' },
                          { to: '/contact', label: 'Contact' },
                        ].map((n) => (
                          <NavLink key={n.label} to={n.to} className="dropdown-link">{n.label}</NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── RIGHT: Actions ── */}
                <div className="flex items-center gap-2 flex-shrink-0">

                  {/* Search icon button */}
                  <button className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200">
                    <Search size={13} />
                  </button>

                  {/* Auth actions */}
                  <div className="hidden sm:block">
                    <NavAuthActions />
                  </div>

                  {/* Mobile hamburger */}
                  <button
                    className="xl:hidden p-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all"
                    onClick={() => setIsMobileMenuOpen(true)}

                  >
                    <Menu size={18} />
                  </button>
                </div>
              </nav>
            </header>
          )}

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[2000] flex justify-end"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="w-full max-w-sm h-full bg-[#0B0E14] border-l border-white/10 p-8 flex flex-col justify-between shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-8">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-black text-lg tracking-tighter uppercase">
                        GoFlex <span className="text-neon-blue font-light">Menu</span>
                      </span>
                      <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 text-slate-500 hover:text-white rounded-xl hover:bg-white/5 transition-all"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="flex flex-col gap-1">
                      {[...mainNav, ...secondaryNav].map((n) => (
                        <NavLink
                          key={n.to}
                          to={n.to}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={({ isActive }) => isActive 
                            ? "px-4 py-3 bg-neon-blue/10 text-neon-blue rounded-xl text-sm font-black uppercase tracking-wider transition-all" 
                            : "px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl text-sm font-black uppercase tracking-wider transition-all"}
                        >
                          {n.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <div className="sm:hidden block">
                      <NavLocationPicker />
                    </div>
                    {showInstallBtn && (
                      <button onClick={() => { triggerInstall(); setIsMobileMenuOpen(false); }} className="w-full py-3.5 bg-neon-blue text-obsidian font-black rounded-xl text-xs uppercase tracking-widest hover:scale-105 transition-all">
                        Install PWA App
                      </button>
                    )}
                    <NavAuthActions />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <main className={isDashboard ? "main-content-dash" : "main-content"}>
            <React.Suspense fallback={
              <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <img src="/logo.png" alt="GoFlex Logo" className="h-16 w-auto object-contain animate-pulse" />
                <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading GoFlex...</div>
              </div>
            }>
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
                  <Route path="/owner/complaints"  element={<RequireAuth role="owner"><OwnerComplaints /></RequireAuth>} />
                  <Route path="/owner/rooms"        element={<RequireAuth role="owner"><OwnerRooms /></RequireAuth>} />
                  <Route path="/owner/visitors"     element={<RequireAuth role="owner"><OwnerVisitors /></RequireAuth>} />
                  <Route path="/owner/utilities"    element={<RequireAuth role="owner"><OwnerUtilities /></RequireAuth>} />
                  <Route path="/owner/agreements"   element={<RequireAuth role="owner"><OwnerAgreements /></RequireAuth>} />

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
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />

                  {/* Resident/KYC/Subscription Routes */}
                  <Route path="/dashboard" element={<RequireAuth role="resident"><UserDashboard /></RequireAuth>} />
                  <Route path="/resident/dashboard" element={<RequireAuth role="resident"><ResidentDashboard /></RequireAuth>} />
                  <Route path="/resident/payments"  element={<RequireAuth role="resident"><ResidentPayments /></RequireAuth>} />
                  <Route path="/resident/complaints" element={<RequireAuth role="resident"><ResidentComplaints /></RequireAuth>} />
                  <Route path="/resident/community"  element={<RequireAuth role="resident"><ResidentCommunity /></RequireAuth>} />
                  <Route path="/resident/services"   element={<RequireAuth role="resident"><ResidentServices /></RequireAuth>} />
                  <Route path="/resident/agreement"  element={<RequireAuth role="resident"><ResidentAgreement /></RequireAuth>} />
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
            <footer className="bg-[#080A0E] border-t border-white/10 pt-20 pb-10 mt-auto text-slate-400 font-semibold text-[11px] relative overflow-hidden">
              {/* Background watermark */}
              <div className="absolute right-0 bottom-0 w-[300px] h-[300px] bg-[url('/logo.png')] bg-contain bg-no-repeat opacity-[0.02] pointer-events-none translate-x-12 translate-y-12" />

              <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 relative z-10">
                {/* Branding & Socials */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="GoFlex Logo" className="h-12 w-auto object-contain" />
                    <div className="flex flex-col">
                      <span className="text-white font-black text-lg tracking-widest leading-none">GOFLEX</span>
                      <span className="text-neon-blue font-bold text-xs tracking-[0.2em] mt-1">HOUSING</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-500 leading-relaxed max-w-sm text-xs font-medium">
                    Flexible co-living spaces curated for modern professionals across thriving cities.
                  </p>

                  {/* PWA Install Button */}
                  {showInstallBtn && (
                    <div className="pt-1">
                      <button
                        onClick={triggerInstall}
                        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white/5 border border-white/10 hover:border-neon-blue/40 hover:bg-neon-blue/5 text-slate-300 hover:text-neon-blue rounded-lg transition-all duration-200"
                      >
                        ↓ Install Web App
                      </button>
                    </div>
                  )}
                  
                  {/* Social Icons */}
                  <div className="flex gap-3">
                    {[
                      { icon: Linkedin, href: 'https://linkedin.com' },
                      { icon: Instagram, href: 'https://instagram.com' },
                      { icon: Twitter, href: 'https://twitter.com' },
                      { icon: Youtube, href: 'https://youtube.com' }
                    ].map((item, idx) => (
                      <a key={idx} href={item.href} target="_blank" rel="noopener noreferrer" 
                        className="w-9 h-9 flex items-center justify-center bg-[#0C1017] border border-white/5 hover:border-neon-blue/30 text-slate-400 hover:text-white rounded-full transition-all duration-300">
                        <item.icon size={14} />
                      </a>
                    ))}
                  </div>
                </div>

                {/* 6 columns layout */}
                <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                  {/* Column 1: Marketplace */}
                  <div className="space-y-4">
                    <h4 className="text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-neon-blue" /> Marketplace
                    </h4>
                    <div className="flex flex-col gap-2.5 font-medium">
                      <NavLink to="/properties?type=buy" className="hover:text-white transition-colors">Buy Property</NavLink>
                      <NavLink to="/properties?type=rent" className="hover:text-white transition-colors">Rent Property</NavLink>
                      <NavLink to="/properties?category=coliving" className="hover:text-white transition-colors">PG & Co-Living</NavLink>
                      <NavLink to="/properties?category=commercial" className="hover:text-white transition-colors">Commercial</NavLink>
                      <NavLink to="/properties?category=student" className="hover:text-white transition-colors">Student Housing</NavLink>
                      <NavLink to="/properties?category=luxury" className="hover:text-white transition-colors">Luxury Homes</NavLink>
                    </div>
                  </div>

                  {/* Column 2: Services */}
                  <div className="space-y-4">
                    <h4 className="text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-neon-blue" /> Services
                    </h4>
                    <div className="flex flex-col gap-2.5 font-medium">
                      <NavLink to="/properties" className="hover:text-white transition-colors">AI Property Match</NavLink>
                      <NavLink to="/how-it-works" className="hover:text-white transition-colors">Housing Management</NavLink>
                      <NavLink to="/resident/agreement" className="hover:text-white transition-colors">Rent Agreement</NavLink>
                      <NavLink to="/kyc/status" className="hover:text-white transition-colors">Digital KYC</NavLink>
                      <NavLink to="/resident/payments" className="hover:text-white transition-colors">Online Payments</NavLink>
                      <NavLink to="/resident/services" className="hover:text-white transition-colors">Maintenance</NavLink>
                      <NavLink to="/resident/complaints" className="hover:text-white transition-colors">Complaint System</NavLink>
                      <NavLink to="/resident/services" className="hover:text-white transition-colors">Moving Services</NavLink>
                    </div>
                  </div>

                  {/* Column 3: Cities */}
                  <div className="space-y-4">
                    <h4 className="text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-neon-blue" /> Cities
                    </h4>
                    <div className="flex flex-col gap-2.5 font-medium">
                      <NavLink to="/locations?city=kolkata" className="hover:text-white transition-colors">Kolkata</NavLink>
                      <NavLink to="/locations?city=bangalore" className="hover:text-white transition-colors">Bangalore</NavLink>
                      <NavLink to="/locations?city=hyderabad" className="hover:text-white transition-colors">Hyderabad</NavLink>
                      <NavLink to="/locations?city=mumbai" className="hover:text-white transition-colors">Mumbai</NavLink>
                      <NavLink to="/locations?city=delhi" className="hover:text-white transition-colors">Delhi</NavLink>
                      <NavLink to="/locations?city=pune" className="hover:text-white transition-colors">Pune</NavLink>
                      <NavLink to="/locations?city=chennai" className="hover:text-white transition-colors">Chennai</NavLink>
                    </div>
                  </div>

                  {/* Column 4: Enterprise */}
                  <div className="space-y-4">
                    <h4 className="text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-neon-blue" /> Enterprise
                    </h4>
                    <div className="flex flex-col gap-2.5 font-medium">
                      <NavLink to="/owner/properties" className="hover:text-white transition-colors">For Owners</NavLink>
                      <NavLink to="/about" className="hover:text-white transition-colors">For Builders</NavLink>
                      <NavLink to="/about" className="hover:text-white transition-colors">For Property Managers</NavLink>
                      <NavLink to="/about" className="hover:text-white transition-colors">For PG Operators</NavLink>
                      <NavLink to="/about" className="hover:text-white transition-colors">Corporate Housing</NavLink>
                      <NavLink to="/about" className="hover:text-white transition-colors">Universities</NavLink>
                    </div>
                  </div>

                  {/* Column 5: Pricing */}
                  <div className="space-y-4">
                    <h4 className="text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-neon-blue" /> Pricing
                    </h4>
                    <div className="flex flex-col gap-2.5 font-medium">
                      <NavLink to="/subscriptions/plans?role=tenant" className="hover:text-white transition-colors">Tenant Plans</NavLink>
                      <NavLink to="/subscriptions/plans?role=owner" className="hover:text-white transition-colors">Owner Plans</NavLink>
                      <NavLink to="/subscriptions/plans?role=enterprise" className="hover:text-white transition-colors">Enterprise Plans</NavLink>
                    </div>
                  </div>

                  {/* Column 6: About */}
                  <div className="space-y-4">
                    <h4 className="text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-neon-blue" /> About
                    </h4>
                    <div className="flex flex-col gap-2.5 font-medium">
                      <NavLink to="/about" className="hover:text-white transition-colors">Company</NavLink>
                      <NavLink to="/careers" className="hover:text-white transition-colors">Careers</NavLink>
                      <NavLink to="/about" className="hover:text-white transition-colors">Press</NavLink>
                      <NavLink to="/blog" className="hover:text-white transition-colors">Blog</NavLink>
                      <NavLink to="/contact" className="hover:text-white transition-colors">Contact</NavLink>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Metadata bar */}
              <div className="max-w-7xl mx-auto px-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-center relative z-10">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                  <span className="w-5 h-5 flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">✓</span>
                  <span>Built for the <span className="text-neon-blue font-black">Future</span> of <span className="text-neon-blue font-black">Urban Living</span>.</span>
                </div>
                <p className="text-slate-600 text-[10px] font-bold">
                  © {new Date().getFullYear()} GoFlex Technologies Pvt. Ltd. All rights reserved.
                </p>
              </div>
            </footer>
          )}

          {/* Global Floating PWA Install Notification */}
          {showInstallBtn && !dismissed && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-6 left-6 z-[2000] max-w-sm bg-[#0B0E14] border border-white/10 p-5 rounded-3xl flex items-center justify-between gap-4 shadow-2xl backdrop-blur-xl">
              <div className="space-y-1">
                <p className="text-white font-bold text-xs">Install GoFlex Web App</p>
                <p className="text-slate-500 text-[10px] leading-relaxed">Add to home screen for real-time menu alerts & gate entries.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                 <button onClick={triggerInstall} className="px-4 py-2 bg-neon-blue text-obsidian font-black rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                  Install
                </button>
                <button onClick={() => setDismissed(true)} className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          )}
          <OAuthRedirectHandler />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

function OAuthRedirectHandler() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is visiting / or /login with an access token in URL
    if (user && (location.pathname === '/login' || location.pathname === '/' || window.location.hash.includes('access_token'))) {
      const redirectPath = user.role === 'owner' 
        ? '/owner/dashboard' 
        : user.role === 'admin' 
        ? '/admin/dashboard' 
        : '/resident/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [user, location.pathname, navigate]);

  return null;
}
