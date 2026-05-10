import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';
import ResidentLifeHUD from '../components/dashboard/ResidentLifeHUD';
import NeighborhoodPulse from '../components/dashboard/NeighborhoodPulse';
import CarbonTrace from '../components/dashboard/CarbonTrace';
import InteractiveFloorplan from '../components/dashboard/InteractiveFloorplan';
import PageTransition from '../components/common/PageTransition';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'billing'>('overview');

  if (!user) return null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-obsidian p-6 lg:p-12 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-white text-5xl font-black tracking-tight"
            >
              Welcome to your Sanctuary, {user.username}
            </motion.h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-2">Node Sync Level: High • Status: Optimized</p>
          </div>
          <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-2xl">
            {(['overview', 'billing'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-neon-blue text-obsidian shadow-neon-blue' : 'text-slate-500 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {activeTab === 'overview' ? (
              <div className="space-y-8">
                {/* Life Telemetry HUD */}
                <ResidentLifeHUD />

                {/* Secondary Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-4">
                    <NeighborhoodPulse />
                  </div>
                  <div className="lg:col-span-5">
                    <InteractiveFloorplan />
                  </div>
                  <div className="lg:col-span-3">
                    <CarbonTrace />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-[40px] p-12 text-center">
                <p className="text-slate-500 font-bold uppercase tracking-[0.4em]">Settlement Ledger</p>
                <h3 className="text-white text-3xl font-black mt-4">No outstanding balances.</h3>
                <p className="text-neon-blue text-sm mt-2">Your next sync settlement is in 12 days.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
