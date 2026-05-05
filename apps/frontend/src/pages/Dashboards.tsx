import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import { AreaWidget, PieWidget, BarWidget } from '../components/dashboard/Charts';
import { getAdminOverview, getResidentOverview } from '../services/mock.dashboard';

import { api } from '../services/api';

export function UserDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/analytics/resident')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <DashboardLayout
      title={`My Dashboard • ${user?.username ?? ''}`}
      nav={[
        { to: '/dashboard', label: 'Home' },
        { to: '/kyc/status', label: 'Identity' },
        { to: '/subscriptions/plans', label: 'Plans' }
      ]}
    >
      <div className="grid-2" style={{ marginBottom: 12 }}>
        <StatCard title="Total Spent" value={`₹${data?.stats?.total_spent?.toLocaleString()}`} />
        <StatCard title="Booking Status" value={data?.active_booking ? 'Active' : 'No Active Booking'} />
      </div>

      <div className="grid-1">
        <div className="card">
          <h2 className="card-title mb-4">Recent Payments</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-2 border-b">ID</th>
                  <th className="p-2 border-b">Amount</th>
                  <th className="p-2 border-b">Status</th>
                  <th className="p-2 border-b">Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.recent_payments?.map((p: any) => (
                  <tr key={p.id}>
                    <td className="p-2 border-b">#{p.id}</td>
                    <td className="p-2 border-b">₹{p.amount}</td>
                    <td className="p-2 border-b"><span className={`badge ${p.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>{p.status}</span></td>
                    <td className="p-2 border-b">{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
