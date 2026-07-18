import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { api } from '../../services/api';
import { Search, Filter, BadgeCheck, ChevronRight, User, Shield, XCircle } from 'lucide-react';

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-rose-400/20 text-rose-400 border-rose-400/30',
  OWNER: 'bg-amber-400/20 text-amber-400 border-amber-400/30',
  RESIDENT: 'bg-emerald-400/20 text-emerald-400 border-emerald-400/30',
  STAFF: 'bg-sky-400/20 text-sky-400 border-sky-400/30',
};

const KYC_COLORS: Record<string, string> = {
  verified: 'bg-emerald-400/20 text-emerald-400',
  pending: 'bg-amber-400/20 text-amber-400',
  rejected: 'bg-rose-400/20 text-rose-400',
};

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.append('search', search);
      if (role) params.append('role', role);
      const res = await api.get(`/api/admin/users?${params}`);
      setUsers(res.data.users || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page, role]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await api.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch { alert('Failed to update role.'); }
  };

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-6">

        {/* Header + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">All Users</h2>
            <p className="text-slate-500 text-sm mt-0.5">{total} total users on the platform</p>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search name or email..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-neon-blue/50"
              />
            </div>
            <select
              value={role}
              onChange={e => { setRole(e.target.value); setPage(1); }}
              className="bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-neon-blue/50"
            >
              <option value="">All Roles</option>
              <option value="RESIDENT">Resident</option>
              <option value="OWNER">Owner</option>
              <option value="ADMIN">Admin</option>
            </select>
          </form>
        </div>

        {/* Table */}
        <div className="bg-[#080A0E]/60 border border-white/10 rounded-[24px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500 px-6 py-4">User</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 py-4">Role</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 py-4">KYC</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 py-4">GoFlex Score</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 py-4">Activity</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-6 py-4"><div className="h-4 bg-white/5 rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-slate-600 font-semibold">No users found</td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                            <User size={14} className="text-neon-blue" />
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">{user.full_name || user.username}</p>
                            <p className="text-slate-500 text-xs">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${ROLE_COLORS[user.role] || 'bg-white/10 text-white border-white/20'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {user.kyc ? (
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${KYC_COLORS[user.kyc.status] || 'bg-white/10 text-white'}`}>
                            {user.kyc.status}
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[10px] font-black uppercase tracking-wider">Not submitted</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {user.goflex_score ? (
                          <div className="flex items-center gap-2">
                            <div className="text-white font-black text-sm">{user.goflex_score.overall_score}/100</div>
                            <span className="text-[9px] text-slate-500 font-bold uppercase">{user.goflex_score.verification_badge}</span>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-[10px]">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-slate-400 text-xs">
                          <span className="font-bold text-white">{user._count?.bookings || 0}</span> bookings ·{' '}
                          <span className="font-bold text-white">{user._count?.owned_properties || 0}</span> properties
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={user.role}
                          onChange={e => handleRoleChange(user.id, e.target.value)}
                          className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-neon-blue/50"
                        >
                          <option value="RESIDENT">Resident</option>
                          <option value="OWNER">Owner</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > limit && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
              <p className="text-slate-500 text-xs">Showing {Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} of {total}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-white/5 border border-white/10 rounded-lg disabled:opacity-40 hover:bg-white/10 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * limit >= total}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-white/5 border border-white/10 rounded-lg disabled:opacity-40 hover:bg-white/10 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
