import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import { Users, Gift, TrendingUp, Copy, Shield, Sparkles } from 'lucide-react';

const ReferralCenter: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/referrals/stats');
        setStats(res.data);
      } catch (err) {
        // Mock data for demo if API fails
        setStats({
          referral_code: 'GOFLEX-XP-99',
          total_referrals: 12,
          successful_referrals: 8,
          total_credits_earned: 4500,
          current_tier: 'Elite',
          next_tier: 'Legendary',
          progress_to_next: 65
        });
      }
    };
    fetchStats();
  }, []);

  const copyToClipboard = () => {
    if (stats?.referral_code) {
      navigator.clipboard.writeText(stats.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!stats) return <div className="p-8 text-white font-black uppercase tracking-widest text-xs animate-pulse">Syncing Referral Engine...</div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Tier Progress Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#080A0E]/60 backdrop-blur-2xl border border-white/5 rounded-[32px] p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/5 blur-3xl -mr-32 -mt-32" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="text-neon-blue" size={16} />
              <p className="text-[10px] font-black text-neon-blue uppercase tracking-[0.4em]">Membership Tier</p>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">{stats.current_tier} Resident</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Next Milestone: {stats.next_tier}</p>
          </div>

          <div className="w-full md:w-72 space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Growth Sync</span>
              <span className="text-[10px] font-black text-neon-blue uppercase tracking-widest">{stats.progress_to_next}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stats.progress_to_next}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-neon-blue shadow-[0_0_15px_rgba(0,209,255,0.5)]" 
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Referrals', value: stats.total_referrals, icon: Users, color: 'text-neon-blue', bg: 'bg-neon-blue/10' },
          { label: 'Network Yield', value: `${Math.round((stats.successful_referrals / stats.total_referrals) * 100) || 0}%`, icon: TrendingUp, color: 'text-neon-green', bg: 'bg-neon-green/10' },
          { label: 'GoTokens Earned', value: `₲ ${stats.total_credits_earned}`, icon: Gift, color: 'text-purple-400', bg: 'bg-purple-500/10' }
        ].map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
            className="bg-[#080A0E]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`p-4 ${item.bg} rounded-xl ${item.color}`}>
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{item.label}</p>
                <h3 className="text-2xl font-black text-white mt-1">{item.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-neon-blue/10 via-purple-500/5 to-transparent backdrop-blur-3xl border border-white/10 rounded-[40px] p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
        
        <Shield className="mx-auto text-neon-blue mb-6 animate-pulse" size={48} />
        <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">Expand the Network</h2>
        <p className="text-slate-400 mb-10 max-w-lg mx-auto font-medium">Transmit your unique residency code to prospective visionaries. Earn <span className="text-neon-blue font-bold">₲ 500 GoTokens</span> for every verified activation.</p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-xl mx-auto relative z-10">
          <div className="w-full bg-[#0B0E14] border border-neon-blue/30 rounded-2xl px-8 py-5 text-2xl font-black text-neon-blue tracking-[0.2em] uppercase shadow-[inset_0_0_20px_rgba(0,209,255,0.05)]">
            {stats.referral_code}
          </div>
          <button 
            onClick={copyToClipboard}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-neon-blue text-obsidian font-black rounded-2xl uppercase tracking-widest text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            {copied ? 'Transmitted' : <><Copy size={16} /> Copy Sync Code</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralCenter;
