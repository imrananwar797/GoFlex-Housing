import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import type { Role } from '../services/auth.service';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '', phone: '' });
  const [role, setRole] = useState<Role>('resident');
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register({ ...form, role });
      nav(role === 'admin' ? '/dashboard-admin' : '/dashboard', { replace: true });
    } catch {
      setError('Registration failed');
    }
  };

  return (
    <section className="content-wrap">
      <div className="form-container">
        <h1 className="page-title">Create account</h1>
        <p className="page-subtitle">Join GoFlex Housing</p>
        <form onSubmit={onSubmit} className="form-grid">
          <label className="form-group"><span className="form-label">Full name</span>
            <input className="input" name="full_name" value={form.full_name} onChange={onChange} required />
          </label>
          <label className="form-group"><span className="form-label">Email</span>
            <input className="input" type="email" name="email" value={form.email} onChange={onChange} required />
          </label>
          <label className="form-group"><span className="form-label">Username</span>
            <input className="input" name="username" value={form.username} onChange={onChange} required />
          </label>
          <label className="form-group"><span className="form-label">Phone</span>
            <input className="input" name="phone" value={form.phone} onChange={onChange} />
          </label>
          <label className="form-group"><span className="form-label">Password</span>
            <input className="input" type="password" name="password" value={form.password} onChange={onChange} required />
          </label>
          <label className="form-group"><span className="form-label">Register as</span>
            <select className="input" value={role} onChange={(e)=>setRole(e.target.value as Role)}>
              <option value="resident">Resident</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          {error && <div className="form-error">{error}</div>}
          <div className="form-actions">
            <button className="btn-cta" type="submit">Create account</button>
            <NavLink className="btn-ghost" to="/login">Have an account? Sign in</NavLink>
          </div>
        </form>
      </div>
    </section>
  );
}
