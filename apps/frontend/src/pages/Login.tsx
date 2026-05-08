import React, { useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';
import { securityService } from '../services/security.service';
import type { Role } from '../services/auth.service';
import PageTransition from '../components/common/PageTransition';
import { LogIn, ShieldCheck, User, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('resident');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const location = useLocation() as any;
  const [show2FA, setShow2FA] = useState(false);
  const [otp, setOtp] = useState('');
  const [tempToken, setTempToken] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await login(username, password);
      if (response?.requires_2fa) {
        setShow2FA(true);
        setTempToken(response.temp_token);
      } else {
        const redirectPath = role === 'admin' ? '/admin/dashboard' : role === 'owner' ? '/owner/dashboard' : '/dashboard';
        nav(redirectPath, { replace: true, state: { from: location.state?.from } });
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const onVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await securityService.validateLogin2FA(otp, tempToken);
      const redirectPath = role === 'admin' ? '/admin/dashboard' : role === 'owner' ? '/owner/dashboard' : '/dashboard';
      window.location.href = redirectPath;
    } catch (err: any) {
      setError('Invalid 2FA code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-obsidian flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass-morphism rounded-[32px] p-10 border-white/10 shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-neon-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-neon-blue/20">
                {show2FA ? <ShieldCheck className="text-neon-blue" size={32} /> : <LogIn className="text-neon-blue" size={32} />}
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                {show2FA ? 'Identity Verification' : 'Welcome Back'}
              </h1>
              <p className="text-slate-400 text-sm">
                {show2FA ? 'Enter the 6-digit code from your app' : 'Enter your credentials to access GoFlex'}
              </p>
            </div>

            {show2FA ? (
              <form onSubmit={onVerify2FA} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">OTP Code</label>
                  <div className="relative">
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20 transition-all text-center tracking-[1em] text-xl font-bold"
                      placeholder="000000"
                      value={otp} 
                      onChange={(e)=>setOtp(e.target.value)} 
                      required 
                      maxLength={6} 
                      autoFocus 
                    />
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

                <button 
                  className={`w-full py-4 bg-neon-blue text-obsidian font-black rounded-xl shadow-neon-blue uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify Identity'}
                  {!loading && <ArrowRight size={16} />}
                </button>
                
                <button 
                  className="w-full py-4 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors"
                  type="button" 
                  onClick={() => setShow2FA(false)}
                >
                  Back to login
                </button>
              </form>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Username or Email</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20 transition-all"
                      placeholder="name@goflex.com"
                      value={username} 
                      onChange={(e)=>setUsername(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20 transition-all"
                      type="password" 
                      placeholder="••••••••"
                      value={password} 
                      onChange={(e)=>setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Login as</label>
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

                <div className="pt-2">
                  <button 
                    className={`w-full py-4 bg-neon-blue text-obsidian font-black rounded-xl shadow-neon-blue uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Authenticating...' : 'Sign In'}
                    {!loading && <ArrowRight size={16} />}
                  </button>
                </div>

                <div className="text-center pt-4">
                  <p className="text-slate-500 text-xs">
                    Don't have an account?{' '}
                    <NavLink to="/register" className="text-neon-blue font-black hover:underline underline-offset-4">
                      Create account
                    </NavLink>
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Footer Meta */}
          <div className="text-center mt-8">
            <p className="text-slate-600 text-[10px] uppercase tracking-[0.2em]">
              Secured by GoFlex Sentinel • 256-bit Encryption
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
