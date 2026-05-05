import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import { FiCopy, FiGift, FiUsers, FiTrendingUp } from 'react-icons/fi';

const ReferralCenter: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/referrals/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch referral stats');
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

  if (!stats) return <div className="p-8 text-white">Loading Referral Engine...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
              <FiUsers size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Referrals</p>
              <h3 className="text-2xl font-bold text-white">{stats.total_referrals}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
              <FiTrendingUp size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Success Rate</p>
              <h3 className="text-2xl font-bold text-white">
                {stats.total_referrals > 0 ? Math.round((stats.successful_referrals / stats.total_referrals) * 100) : 0}%
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
              <FiGift size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Earned</p>
              <h3 className="text-2xl font-bold text-white">₹{stats.total_credits_earned}</h3>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Share the GoFlex Experience</h2>
        <p className="text-gray-400 mb-8">Get ₹500 in rental credits for every friend who completes their KYC and moves in.</p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <div className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-xl font-mono text-indigo-400 tracking-widest uppercase">
            {stats.referral_code}
          </div>
          <button 
            onClick={copyToClipboard}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all"
          >
            {copied ? 'Copied!' : <><FiCopy /> Copy Code</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralCenter;
