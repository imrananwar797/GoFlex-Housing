import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { api } from '../services/api';
import { useAuth } from '../auth/AuthContext';
import { User, Lock, Shield, Bell, ChevronRight, Save, Eye, EyeOff, BadgeCheck } from 'lucide-react';

export default function Settings() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications'>('profile');
  const [profile, setProfile] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({ full_name: user.full_name || '', phone: user.phone || '' });
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await api.patch('/api/auth/profile', profile);
      if (setUser && user) setUser({ ...user, ...res.data });
      setSaveMsg('✓ Profile updated successfully.');
    } catch { setSaveMsg('✗ Failed to update profile.'); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPwdMsg('✗ Passwords do not match.');
      return;
    }
    if (passwordForm.new_password.length < 8) {
      setPwdMsg('✗ Password must be at least 8 characters.');
      return;
    }
    setPwdLoading(true);
    setPwdMsg('');
    try {
      await api.post('/api/auth/change-password', {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      setPwdMsg('✓ Password changed successfully.');
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err: any) {
      setPwdMsg(`✗ ${err?.response?.data?.detail || 'Failed to change password.'}`);
    }
    finally { setPwdLoading(false); }
  };

  const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
  ] as const;

  const goFlexScore = user?.goflex_score?.overall_score;
  const badge = user?.goflex_score?.verification_badge || 'bronze';
  const BADGE_COLORS: Record<string, string> = {
    platinum: 'text-violet-400 border-violet-400/30 bg-violet-400/10',
    gold: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
    silver: 'text-slate-300 border-slate-400/30 bg-slate-400/10',
    bronze: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
  };

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6 max-w-2xl">

        <div>
          <h2 className="text-2xl font-black text-white">Account Settings</h2>
          <p className="text-slate-500 text-sm mt-0.5">Manage your profile, security, and preferences</p>
        </div>

        {/* Identity Card */}
        <div className="bg-[#080A0E]/60 border border-white/10 rounded-[24px] p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
            <User size={28} className="text-neon-blue" />
          </div>
          <div className="flex-1">
            <p className="text-white font-black text-lg">{user?.full_name || user?.username}</p>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-[9px] font-black uppercase tracking-widest rounded-lg">
                {user?.role}
              </span>
              {goFlexScore && (
                <span className={`px-2.5 py-0.5 border text-[9px] font-black uppercase tracking-widest rounded-lg ${BADGE_COLORS[badge]}`}>
                  {badge} · {goFlexScore}/100
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id ? 'bg-neon-blue text-[#0b0e14]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="bg-[#080A0E]/60 border border-white/10 rounded-[24px] p-6 space-y-5">
            <h3 className="text-white font-black text-sm">Personal Information</h3>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Full Name</label>
              <input
                type="text"
                value={profile.full_name}
                onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                placeholder="Enter your full name"
                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 placeholder:text-slate-600 focus:outline-none focus:border-neon-blue/50"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Phone Number</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                placeholder="+91 98765 43210"
                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 placeholder:text-slate-600 focus:outline-none focus:border-neon-blue/50"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-white/[0.02] border border-white/5 text-slate-600 text-sm rounded-xl px-4 py-3 cursor-not-allowed"
              />
              <p className="text-slate-600 text-[10px] mt-1">Email cannot be changed. Contact support for assistance.</p>
            </div>

            {saveMsg && (
              <p className={`text-sm font-bold ${saveMsg.startsWith('✓') ? 'text-emerald-400' : 'text-rose-400'}`}>{saveMsg}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-neon-blue text-[#0b0e14] font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword} className="bg-[#080A0E]/60 border border-white/10 rounded-[24px] p-6 space-y-5">
            <h3 className="text-white font-black text-sm">Change Password</h3>

            {['current_password', 'new_password', 'confirm_password'].map((field, idx) => (
              <div key={field}>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">
                  {idx === 0 ? 'Current Password' : idx === 1 ? 'New Password' : 'Confirm New Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={(passwordForm as any)[field]}
                    onChange={e => setPasswordForm(f => ({ ...f, [field]: e.target.value }))}
                    placeholder={idx === 0 ? '••••••••' : idx === 1 ? 'Min. 8 characters' : 'Re-enter new password'}
                    className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 pr-10 placeholder:text-slate-600 focus:outline-none focus:border-neon-blue/50"
                  />
                  {idx === 1 && (
                    <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                      {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {pwdMsg && (
              <p className={`text-sm font-bold ${pwdMsg.startsWith('✓') ? 'text-emerald-400' : 'text-rose-400'}`}>{pwdMsg}</p>
            )}

            <button
              type="submit"
              disabled={pwdLoading}
              className="flex items-center gap-2 px-6 py-3 bg-neon-blue text-[#0b0e14] font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              <Lock size={14} /> {pwdLoading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        )}

      </div>
    </DashboardLayout>
  );
}
