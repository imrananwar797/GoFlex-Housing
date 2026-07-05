import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';
import type { Role } from '../services/auth.service';
import PageTransition from '../components/common/PageTransition';
import { UserPlus, User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '', phone: '' });
  const [role, setRole] = useState<Role>('resident');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ ...form, role });
      const redirectPath = role === 'admin' ? '/admin/dashboard' : role === 'owner' ? '/owner/dashboard' : '/resident/dashboard';
      nav(redirectPath, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-obsidian flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-2xl relative z-10"
        >
          <div className="glass-morphism rounded-[32px] p-10 border-white/10 shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-600/20">
                <UserPlus className="text-purple-500" size={32} />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight mb-2">Create Account</h1>
              <p className="text-slate-400 text-sm">Join the future of high-performance urban living</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20 transition-all"
                      name="full_name"
                      placeholder="John Doe"
                      value={form.full_name} 
                      onChange={onChange} 
                      required 
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20 transition-all"
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={form.email} 
                      onChange={onChange} 
                      required 
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20 transition-all"
                      name="username"
                      placeholder="johndoe88"
                      value={form.username} 
                      onChange={onChange} 
                      required 
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20 transition-all"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      value={form.phone} 
                      onChange={onChange} 
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20 transition-all"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={form.password} 
                      onChange={onChange} 
                      required 
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Register as</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-neon-blue/50 transition-all appearance-none cursor-pointer"
                    value={role} 
                    onChange={(e)=>setRole(e.target.value as Role)}
                  >
                    <option value="resident" className="bg-obsidian">Resident</option>
                    <option value="owner" className="bg-obsidian">Owner</option>
                    <option value="admin" className="bg-obsidian">Admin</option>
                  </select>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-pulse-glow" />
                  {error}
                </motion.div>
              )}

              <div className="pt-4">
                <button 
                  className={`w-full py-4 bg-purple-600 text-white font-black rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Get Started'}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </div>

              <div className="text-center pt-4">
                <p className="text-slate-500 text-xs">
                  Already have an account?{' '}
                  <NavLink to="/login" className="text-purple-500 font-black hover:underline underline-offset-4">
                    Sign in here
                  </NavLink>
                </p>
              </div>
            </form>
          </div>

          {/* Footer Meta */}
          <div className="text-center mt-8">
            <p className="text-slate-600 text-[10px] uppercase tracking-[0.2em]">
              Join 10,000+ modern professionals worldwide
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
