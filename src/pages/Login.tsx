import React, { useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { securityService } from '../services/security.service';
import type { Role } from '../services/auth.service';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('resident');
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();
  const location = useLocation() as any;
  const [show2FA, setShow2FA] = useState(false);
  const [otp, setOtp] = useState('');
  const [tempToken, setTempToken] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await login(username, password);
      if (response?.requires_2fa) {
        setShow2FA(true);
        setTempToken(response.temp_token);
      } else {
        nav(role === 'admin' ? '/dashboard-admin' : '/dashboard', { replace: true, state: { from: location.state?.from } });
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  const onVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await securityService.validateLogin2FA(otp, tempToken);
      // Now login again or update context
      // Note: My AuthContext.login might need update to handle this final step
      // For now, assume it's handled or we reload
      window.location.href = role === 'admin' ? '/dashboard-admin' : '/dashboard';
    } catch (err: any) {
      setError('Invalid 2FA code');
    }
  };

  return (
    <section className="content-wrap">
      <div className="form-container">
        <h1 className="page-title">{show2FA ? 'Two-Factor Auth' : 'Sign in'}</h1>
        <p className="page-subtitle">{show2FA ? 'Enter verification code' : 'Access your dashboard'}</p>
        
        {show2FA ? (
          <form onSubmit={onVerify2FA} className="form-grid">
            <label className="form-group">
              <span className="form-label">OTP Code</span>
              <input className="input" placeholder="6-digit code" value={otp} onChange={(e)=>setOtp(e.target.value)} required maxLength={6} autoFocus />
            </label>
            {error && <div className="form-error">{error}</div>}
            <div className="form-actions">
              <button className="btn-cta" type="submit">Verify & Sign in</button>
              <button className="btn-ghost" type="button" onClick={() => setShow2FA(false)}>Back</button>
            </div>
          </form>
        ) : (
          <form onSubmit={onSubmit} className="form-grid">
            <label className="form-group">
              <span className="form-label">Username or Email</span>
              <input className="input" value={username} onChange={(e)=>setUsername(e.target.value)} required />
            </label>
            <label className="form-group">
              <span className="form-label">Password</span>
              <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
            </label>
            <label className="form-group">
              <span className="form-label">Login as</span>
              <select className="input" value={role} onChange={(e)=>setRole(e.target.value as Role)}>
                <option value="resident">Resident</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            {error && <div className="form-error">{error}</div>}
            <div className="form-actions">
              <button className="btn-cta" type="submit">Sign in</button>
              <NavLink className="btn-ghost" to="/register">Create account</NavLink>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
