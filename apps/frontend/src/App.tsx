import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X, Mail, Phone, ShieldCheck, Github, Twitter, Linkedin } from 'lucide-react';
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
    <div className="nav-actions">
      <NavLink to="/login" className="btn-login">Log In</NavLink>
      <NavLink to="/register" className="btn-signup">Sign Up</NavLink>
    </div>
  );

  const dashboardLink = user.role === 'admin'
    ? '/admin/dashboard'
    : user.role === 'owner'
    ? '/owner/dashboard'
    : '/resident/dashboard';

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
            <header className="site-header w-full px-4 md:px-8">
              <nav className="nav-bar bg-[#080A0E]/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-2">
                  <NavLink to="/" className="text-white font-black text-lg tracking-tighter uppercase flex items-center gap-1.5">
                    GoFlex <span className="text-neon-blue font-light">Housing</span>
                  </NavLink>
                </div>

                {/* Desktop Nav links (Hidden on mobile and tablet) */}
                <div className="hidden lg:flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/5">
                  {mainNav.map((n) => (
                    <NavLink
                      key={n.to}
                      to={n.to}
                      className={({ isActive }) => (isActive ? 'px-4 py-2 bg-neon-blue/20 text-neon-blue rounded-full text-xs font-black uppercase tracking-wider transition-all' : 'px-4 py-2 text-slate-400 hover:text-white rounded-full text-xs font-black uppercase tracking-wider transition-all')}
                    >
                      {n.label}
                    </NavLink>
                  ))}
                  <div className="relative group">
                    <button className="px-4 py-2 text-slate-400 hover:text-white rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1">
                      More ▾
                    </button>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="bg-[#0B0E14] border border-white/10 rounded-2xl p-2 shadow-2xl min-w-[160px] backdrop-blur-xl">
                        {secondaryNav.map((n) => (
                          <NavLink
                            key={n.to}
                            to={n.to}
                            className="block px-4 py-2.5 text-[11px] font-black text-slate-400 hover:text-white hover:bg-white/5 rounded-xl uppercase tracking-wider transition-all"
                          >
                            {n.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Location Picker (Hidden on mobile) */}
                  <div className="hidden sm:block">
                    <NavLocationPicker />
                  </div>
                  
                  {/* Install App button if PWA is installable */}
                  {showInstallBtn && (
                    <button onClick={triggerInstall} className="hidden sm:block px-4 py-2 bg-neon-blue text-obsidian font-black rounded-full text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,209,255,0.2)]">
                      Install App
                    </button>
                  )}

                  {/* Search Bar (Hidden on mobile) */}
                  <div className="relative hidden md:block">
                    <input 
                      type="text" 
                      className="bg-white/5 border border-white/10 rounded-full py-2 pl-4 pr-10 text-xs text-white outline-none focus:border-neon-blue/50 focus:w-44 w-32 transition-all" 
                      placeholder="Search..." 
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Auth Actions / Dashboard links (Hidden on mobile) */}
                  <div className="hidden sm:block">
                    <NavAuthActions />
                  </div>

                  {/* Mobile Menu trigger (Visible on mobile/tablet) */}
                  <button 
                    className="lg:hidden p-2.5 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 transition-all"
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
            <footer className="bg-[#080A0E] border-t border-white/10 pt-20 pb-10 mt-auto text-slate-400 font-semibold text-xs">
              <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16">
                
                {/* Branding & Socials */}
                <div className="lg:col-span-4 space-y-6">
                  <NavLink to="/" className="text-white font-black text-xl tracking-tighter uppercase flex items-center gap-1.5">
                    GoFlex <span className="text-neon-blue font-light">Housing</span>
                  </NavLink>
                  <p className="text-slate-500 leading-relaxed max-w-sm">
                    GoFlex is the operating system for modern rental housing. Curating premium, fully-serviced sanctuaries for high-performance builders.
                  </p>
                  
                  {/* Social Icons */}
                  <div className="flex gap-4">
                    {[
                      { icon: Twitter, href: 'https://twitter.com/goflex' },
                      { icon: Linkedin, href: 'https://linkedin.com/company/goflex' },
                      { icon: Github, href: 'https://github.com/goflex' }
                    ].map((item, idx) => (
                      <a key={idx} href={item.href} target="_blank" rel="noopener noreferrer" 
                        className="p-2.5 bg-white/5 border border-white/10 hover:border-neon-blue/30 text-slate-400 hover:text-neon-blue rounded-xl transition-all">
                        <item.icon size={16} />
                      </a>
                    ))}
                  </div>

                  {/* Verification stamps */}
                  <div className="flex items-center gap-3 pt-2">
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-wider">
                      <ShieldCheck size={10} /> DigiLocker Verified
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-neon-blue/10 border border-neon-blue/20 text-neon-blue rounded-lg text-[9px] font-black uppercase tracking-wider">
                      ISO 27001 Secure
                    </span>
                  </div>
                </div>

                {/* Explore Links */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-white font-black text-[10px] uppercase tracking-widest">Explore</h4>
                  <div className="flex flex-col gap-2.5">
                    <NavLink to="/properties" className="hover:text-white transition-colors">Nodes & Properties</NavLink>
                    <NavLink to="/locations" className="hover:text-white transition-colors">Locations Matrix</NavLink>
                    <NavLink to="/amenities" className="hover:text-white transition-colors">Amenities Index</NavLink>
                    <NavLink to="/gallery" className="hover:text-white transition-colors">Visual Poetry</NavLink>
                    <NavLink to="/blog" className="hover:text-white transition-colors">Community Blog</NavLink>
                  </div>
                </div>

                {/* Portals / Ecosystem */}
                <div className="lg:col-span-3 space-y-4">
                  <h4 className="text-white font-black text-[10px] uppercase tracking-widest">Ecosystem Portals</h4>
                  <div className="flex flex-col gap-2.5">
                    <NavLink to="/login" className="hover:text-white transition-colors">Resident Companion Portal</NavLink>
                    <NavLink to="/login" className="hover:text-white transition-colors">Owner SaaS Console</NavLink>
                    <NavLink to="/register" className="hover:text-white transition-colors">B2B Partner Program</NavLink>
                    <NavLink to="/about" className="hover:text-white transition-colors">Developer Platform APIs</NavLink>
                  </div>
                </div>

                {/* Support & Contact */}
                <div className="lg:col-span-3 space-y-4">
                  <h4 className="text-white font-black text-[10px] uppercase tracking-widest">Support & Trust</h4>
                  <div className="flex flex-col gap-2.5">
                    <span className="flex items-center gap-2 hover:text-white transition-all">
                      <Mail size={14} className="text-neon-blue shrink-0" /> support@goflex.co
                    </span>
                    <span className="flex items-center gap-2 hover:text-white transition-all">
                      <Phone size={14} className="text-neon-blue shrink-0" /> +91 (80) 4920-4011
                    </span>
                    <NavLink to="/contact" className="hover:text-white transition-colors">Open Helpdesk Ticket</NavLink>
                    <NavLink to="/team" className="hover:text-white transition-colors">Core Engineering Team</NavLink>
                  </div>
                </div>

              </div>

              {/* Bottom Metadata bar */}
              <div className="max-w-7xl mx-auto px-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
                <p className="text-slate-600 text-[10px] font-bold">
                  © {new Date().getFullYear()} GoFlex Housing Technologies. All payments processed via secure bank-grade escrows.
                </p>
                <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-wider">
                  <NavLink to="/terms" className="hover:text-white transition-colors">Terms of Service</NavLink>
                  <span>·</span>
                  <NavLink to="/about" className="hover:text-white transition-colors">Privacy Protocol</NavLink>
                </div>
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
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}
