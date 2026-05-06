import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import TickerGrid from '../../components/dashboard/TickerCards';
import ConsumptionChart from '../../components/dashboard/ConsumptionChart';
import GlassTable from '../../components/dashboard/GlassTable';
import { api } from '../../services/api';
import { TrendingUp, Users, Wallet, Calendar } from 'lucide-react';

export default function OwnerPropertyRevenue() {
  const { propertyId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/analytics/owner/property/${propertyId}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [propertyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neon-blue/20 border-t-neon-blue rounded-full animate-spin shadow-neon-blue" />
      </div>
    );
  }

  const tickerItems = [
    { title: "Total Revenue", value: `₹${data?.stats?.total_revenue?.toLocaleString() || '0'}`, icon: Wallet, statusColor: "green" as const },
    { title: "Active Residents", value: data?.stats?.active_residents?.toString() || '0', icon: Users },
    { title: "Occupancy", value: `${data?.stats?.occupancy_rate?.toFixed(1) || '0'}%`, icon: TrendingUp },
    { title: "Property Status", value: data?.property?.active ? "Active" : "Inactive", icon: Calendar, statusColor: data?.property?.active ? "blue" as const : "red" as const },
  ];

  const chartData = data?.revenue_trend?.map((r: any) => ({
    name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][r.month - 1],
    revenue: r.amount
  })) || [];

  return (
    <DashboardLayout title={`Revenue: ${data?.property?.name || 'Loading...'}`}>
      <div className="space-y-8 relative z-10">
        {/* Revenue Stats */}
        <TickerGrid items={tickerItems} />

        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* Revenue Chart */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-[#080A0E]/60 backdrop-blur-xl border border-neon-blue/20 rounded-3xl p-4 sm:p-8 h-full">
              <ConsumptionChart 
                title="Revenue History" 
                subtitle="Last 6 months performance" 
                dataKey="revenue" 
                chartData={chartData.length > 0 ? chartData : [
                    {name: 'Jan', revenue: 0}, {name: 'Feb', revenue: 0}, {name: 'Mar', revenue: 0}
                ]}
                color="#39FF14"
              />
            </div>
          </div>

          {/* Revenue Breakdown / Quick Stats */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-neon-green/10 border border-neon-green/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl h-full flex flex-col justify-center">
              <p className="text-neon-green text-[10px] font-black uppercase tracking-[0.3em] mb-4">Net Asset Performance</p>
              <h4 className="text-white text-4xl font-black mb-2">₹{data?.stats?.total_revenue?.toLocaleString() || '0'}</h4>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Cumulative earnings for this property</p>
              
              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Target Occupancy</span>
                    <span className="text-white font-bold">100%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-neon-green shadow-neon-green" style={{width: `${data?.stats?.occupancy_rate || 0}%`}} />
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="col-span-12">
            <GlassTable 
                title="Recent Transactions"
                subtitle="Latest payments for this property"
                items={data?.recent_transactions?.map((t: any) => ({
                    id: t.id,
                    user: `Resident #${t.user_id}`,
                    amount: `₹${t.amount.toLocaleString()}`,
                    status: t.status,
                    date: new Date(t.created_at).toLocaleDateString()
                })) || []}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
