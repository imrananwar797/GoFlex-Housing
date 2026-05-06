import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Receipt, 
  Users, 
  Menu, 
  X,
  Bell,
  LogOut,
  Settings
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

export default function DashboardLayout({ 
  title, 
  children,
  nav: customNav
}: { 
  title: string; 
  children: React.ReactNode;
  nav?: { to: string; label: string }[] 
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const defaultNav = user?.role?.toLowerCase() === 'owner' ? [
    { to: '/owner/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/owner/properties', label: 'My Properties', icon: ShieldCheck },
    { to: '/owner/residents', label: 'Residents', icon: Users },
    { to: '/owner/revenue', label: 'Revenue', icon: Receipt },
  ] : [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/kyc/status', label: 'AI Verify', icon: ShieldCheck },
    { to: '/subscriptions/plans', label: 'Billing', icon: Receipt },
    { to: '/community', label: 'Community', icon: Users },
  ];

  const navItems = customNav ? customNav.map(n => ({ ...n, icon: LayoutDashboard })) : defaultNav;

  return (
    <div className="min-h-screen bg-obsidian text-slate-200 font-sans selection:bg-neon-blue/30 overflow-x-hidden">
      {/* Background radial glow */}
      <div className="fixed inset-0 bg-obsidian-radial pointer-events-none z-0" />
      
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-[#080A0E]/95 backdrop-blur-xl border-r border-white/5 transition-all duration-300 z-[70] 
          ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'} 
          ${isSidebarOpen ? 'lg:w-64' : 'lg:w-20'}`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-10 px-2 mt-4">
            <div className="flex items-center gap-2">
               <span className="text-xl font-black text-neon-blue lg:hidden">G</span>
               {(isSidebarOpen || isMobileMenuOpen) && (
                 <span className="text-xl font-black tracking-tighter text-white">
                   GOFLEX<span className="text-neon-blue">.</span>
                 </span>
               )}
            </div>
            <button 
              onClick={() => isMobileMenuOpen ? setIsMobileMenuOpen(false) : setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-500 hover:text-white"
            >
              {isMobileMenuOpen || isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item: any) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20 shadow-[0_0_20px_rgba(0,209,255,0.05)]' 
                    : 'text-slate-500 hover:bg-white/5 hover:text-white'}
                `}
              >
                <item.icon size={20} className="shrink-0" />
                {(isSidebarOpen || isMobileMenuOpen) && (
                  <span className="font-bold text-xs uppercase tracking-wider whitespace-nowrap">
                    {item.label}
                  </span>
                )}
                {(!isSidebarOpen && !isMobileMenuOpen) && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-obsidian border border-white/10 rounded text-[10px] invisible group-hover:visible whitespace-nowrap z-50 uppercase tracking-widest font-black">
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-1 pt-4 border-t border-white/5">
            <button onClick={() => logout()} className="flex items-center gap-4 px-3 py-3 w-full rounded-xl text-slate-500 hover:bg-neon-red/10 hover:text-neon-red transition-all duration-200 group">
              <LogOut size={20} />
              {(isSidebarOpen || isMobileMenuOpen) && <span className="font-bold text-xs uppercase tracking-wider">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className={`relative transition-all duration-300 z-10 transform-gpu min-h-screen
          ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'} pl-0`}
      >
        {/* Topbar */}
        <header className="h-20 flex items-center justify-between px-4 lg:px-8 bg-[#0B0E14]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 bg-white/5 rounded-xl text-white"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] lg:tracking-[0.5em] truncate max-w-[150px] lg:max-w-none">{title}</h1>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            <button className="relative p-2 text-slate-500 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-neon-red rounded-full shadow-[0_0_8px_#FF3131]" />
            </button>
            
            <div className="flex items-center gap-3 pl-2 lg:pl-4 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-white uppercase tracking-tight truncate max-w-[100px]">{user?.full_name || user?.username}</p>
                <p className="text-[9px] text-neon-green font-black uppercase tracking-widest leading-none mt-1">
                  {user?.role || 'Resident'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neon-blue via-purple-500 to-neon-red p-[1px] shrink-0">
                <div className="w-full h-full rounded-[11px] bg-[#0B0E14] flex items-center justify-center font-black text-xs text-white">
                  {user?.username?.[0].toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
