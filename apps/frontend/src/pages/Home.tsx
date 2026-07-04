import { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import FastSearchOverlay from '../components/home/FastSearchOverlay';
import { 
  Sparkles, Globe, ArrowRight, Zap, Shield, Cpu, 
  Clock, CheckCircle, Smartphone, BarChart3, Users, DollarSign, Utensils, MessageSquare, ArrowUpRight
} from 'lucide-react';

const ECOSYSTEM_TABS = [
  { id: 'marketplace', label: '1. Marketplace', title: 'Decision-Making Marketplace', desc: 'No more generic listings. Compare properties with verified scores, safety indices, and accurate commute times.' },
  { id: 'saas', label: '2. Owner SaaS', title: 'Business HUD Operating System', desc: 'Manage your portfolio like a business. View vacancy heatmaps, MRR, satisfaction scores, and automated utility cost structures.' },
  { id: 'resident', label: '3. Resident Super App', title: 'Resident Home Companion', desc: 'A unified daily companion tracking rent payments, cafeteria meals, visitor gates, and IoT utility telemetry.' },
  { id: 'trust', label: '4. Trust & Reputation', title: 'Two-Way Reputation Protocol', desc: 'GoFlex Verified status for owners, residents, and documents. Real two-way scoring based on actual platform metrics.' },
  { id: 'services', label: '5. Service Marketplace', title: 'On-Demand Integration', desc: 'Verified partners offering cleaning, laundry, moving, and repairs directly from the resident companion app.' }
];

const AI_PROMPTS = [
  { text: "Find a quiet room under ₹8,000 within 2km of my office.", role: 'resident', reply: "🔍 Search Results: Found 2 available single rooms under ₹8,000 within 2.1 km of Bagmane Tech Park. Auto-deposit transfer via GoFlex Escrow is supported." },
  { text: "Estimate my electricity bill this month.", role: 'resident', reply: "📊 Projection: Based on your current 84 units consumed, your estimated electricity bill is ₹1,008 (calculated at ₹12/unit)." },
  { text: "Suggest a rent increase for my properties.", role: 'owner', reply: "📈 Recommendation: Strong demand in Koramangala (94% occupancy) suggests a recommended rent increase of 4.5% (approx +₹400/room) for the next cycle." },
  { text: "Identify complaints that need urgent attention.", role: 'owner', reply: "⚠️ Alert: 1 urgent complaint is pending: 'AC not cooling in Room 204' (Arjun Mehta). Repair assigned to staff." }
];

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('marketplace');
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const [aiTyping, setAiTyping] = useState(false);
  const [aiResult, setAiResult] = useState('');

  const triggerPrompt = (prompt: any) => {
    setSelectedPrompt(prompt);
    setAiTyping(true);
    setAiResult('');
    setTimeout(() => {
      setAiTyping(false);
      setAiResult(prompt.reply);
    }, 1000);
  };

  return (
    <PageTransition>
      <div className="relative bg-obsidian overflow-x-hidden noise-texture min-h-screen text-slate-300">
        
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-24 flex flex-col items-center justify-center">
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg')] bg-cover bg-center opacity-10 grayscale mix-blend-screen" />
            <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-transparent to-obsidian" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-8 w-full text-center space-y-8">
            <div className="flex items-center justify-center gap-2">
              <span className="flex items-center gap-1.5 px-3.5 py-1 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                <Globe size={12} /> GoFlex Operating System Online
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter uppercase max-w-5xl mx-auto">
              Live Where your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-purple-400 to-white italic font-normal">Ambition Meets</span> <br />
              Infrastructure.
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Ditch generic listing sites. GoFlex is the complete operating system for the rental ecosystem. We power findings, rentings, livings, payings, and operations.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
              <NavLink to="/properties">
                <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 209, 255, 0.3)" }} whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-neon-blue text-obsidian font-black rounded-2xl uppercase tracking-[0.2em] text-[10px]">
                  Explore Marketplace
                </motion.button>
              </NavLink>
              <NavLink to="/login">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all">
                  Initialize Console
                </motion.button>
              </NavLink>
            </div>
          </div>
        </section>

        {/* 5-PRODUCT ECOSYSTEM EXPLORER */}
        <section className="py-24 max-w-7xl mx-auto px-8 space-y-12">
          <div className="text-center space-y-2">
            <p className="text-neon-blue text-[10px] font-black uppercase tracking-[0.3em]">The GoFlex Architecture</p>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Five Connected Products. One Platform.</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left selector */}
            <div className="lg:col-span-4 space-y-3">
              {ECOSYSTEM_TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-6 rounded-[24px] border transition-all duration-300 ${activeTab === tab.id ? 'bg-[#080A0E]/80 border-neon-blue/30 text-white shadow-[0_0_20px_rgba(0,209,255,0.05)]' : 'bg-transparent border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'}`}>
                  <p className="font-black text-xs uppercase tracking-wider mb-1">{tab.label}</p>
                  <p className={`text-sm font-bold ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`}>{tab.title}</p>
                </button>
              ))}
            </div>

            {/* Right Simulator view */}
            <div className="lg:col-span-8 bg-[#080A0E]/60 border border-white/10 rounded-[32px] p-8 md:p-12 min-h-[400px] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-transparent pointer-events-none" />
              
              <div className="space-y-4">
                <span className="px-3.5 py-1 bg-white/5 border border-white/10 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                  Live simulator
                </span>
                <h3 className="text-2xl font-black text-white uppercase">{ECOSYSTEM_TABS.find(t => t.id === activeTab)?.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xl">{ECOSYSTEM_TABS.find(t => t.id === activeTab)?.desc}</p>
              </div>

              {/* High-fidelity mock representation based on active tab */}
              <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl font-semibold text-xs text-slate-300 space-y-4">
                
                {activeTab === 'marketplace' && (
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="text-white text-sm font-bold flex items-center gap-2">GoFlex Indiranagar Node <span className="text-[10px] bg-neon-blue/10 border border-neon-blue/30 text-neon-blue px-2 py-0.5 rounded">Verified</span></p>
                      <p className="text-slate-500 text-[10px] mt-1">₹8,500/mo · Indiranagar Metro (450m)</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-amber-400 font-bold">★ 4.9</p>
                        <p className="text-slate-500 text-[9px]">Safety score: 9.8/10</p>
                      </div>
                      <div className="w-10 h-10 bg-neon-blue/10 border border-neon-blue/20 text-neon-blue rounded-xl flex items-center justify-center font-black text-sm">
                        96
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'saas' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    {[
                      { l: 'MRR Tracker', v: '₹5,20,000' },
                      { l: 'Occupancy Index', v: '94.2%' },
                      { l: 'Complaint SLA', v: '2.4 hrs' },
                      { l: 'Vacancy Rooms', v: '2 Vacant' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-slate-500 text-[9px] font-black uppercase mb-1">{item.l}</p>
                        <p className="text-white font-bold">{item.v}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'resident' && (
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="text-amber-400 text-[10px] font-black uppercase">Today's Lunch Menu</p>
                      <p className="text-white font-bold mt-0.5">Dal Makhani, Jeera Rice, Butter Roti & Salad</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-3 rounded-xl shrink-0">
                      <Zap size={14} className="text-amber-400" />
                      <div>
                        <p className="text-slate-500 text-[9px] font-black uppercase">Electricity Meter</p>
                        <p className="text-white font-bold text-xs">84 units MTD</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'trust' && (
                  <div className="flex flex-col sm:flex-row gap-6 justify-between">
                    <div className="flex-1 p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-slate-500 text-[9px] font-black uppercase">Resident Verification (Arjun)</p>
                      <p className="text-white font-bold mt-1">Payment History: 100%</p>
                      <p className="text-slate-500 text-[9px] mt-1">Community Score: 98/100</p>
                    </div>
                    <div className="flex-1 p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-slate-500 text-[9px] font-black uppercase">Owner Verification (Rakesh)</p>
                      <p className="text-white font-bold mt-1">Maintenance SLA: <span className="text-emerald-400">96%</span></p>
                      <p className="text-slate-500 text-[9px] mt-1">Reputation Score: 96/100</p>
                    </div>
                  </div>
                )}

                {activeTab === 'services' && (
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {['🧹 Cleaning', '👕 Laundry', '🔧 Repairs'].map(srv => (
                      <div key={srv} className="p-3 bg-[#00D1FF]/5 border border-[#00D1FF]/20 text-neon-blue rounded-xl font-bold">
                        {srv}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          </div>
        </section>

        {/* TASK-ORIENTED AI CONCIERGE SANDBOX */}
        <section className="py-24 bg-gradient-to-b from-transparent via-[#080A0E]/40 to-transparent">
          <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
                <Sparkles size={12} /> Task-Oriented AI sandbox
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none">
                AI That Executes <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-purple-400 italic font-normal">Actions.</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                GoFlex AI is task-oriented. It compares properties, estimates IoT electricity usage, raises maintenance tickets, and forecasts portfolio analytics for owners.
              </p>
              <div className="space-y-2.5">
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Interactive queries: click to test</p>
                <div className="flex flex-col gap-2">
                  {AI_PROMPTS.map((pr, idx) => (
                    <button key={idx} onClick={() => triggerPrompt(pr)}
                      className={`text-left p-3.5 rounded-xl border text-xs font-bold transition-all ${selectedPrompt?.text === pr.text ? 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue' : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'}`}>
                      {pr.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated AI Terminal */}
            <div className="lg:col-span-7 bg-[#080A0E]/80 border border-white/10 rounded-[32px] overflow-hidden min-h-[350px] flex flex-col justify-between shadow-2xl relative">
              <div className="p-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">GoFlex AI Sandbox console</span>
                </div>
                <Cpu size={14} className="text-slate-500 animate-spin" />
              </div>

              <div className="flex-1 p-8 space-y-6">
                {selectedPrompt ? (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <div className="bg-neon-blue text-obsidian font-bold text-xs p-3.5 rounded-2xl rounded-tr-none max-w-[80%]">
                        {selectedPrompt.text}
                      </div>
                    </div>
                    
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/10 text-slate-200 text-xs p-4 rounded-2xl rounded-tl-none max-w-[85%] leading-relaxed">
                        {aiTyping ? (
                          <div className="flex gap-1.5 py-1">
                            <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                        ) : (
                          aiResult
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
                    <MessageSquare size={32} className="opacity-20 mb-3" />
                    <p className="text-xs font-bold">Select a task prompt on the left to see GoFlex AI execute sandbox commands.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* REPUTATION & TWO-WAY TRUST */}
        <section className="py-24 max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-6">
              <Shield size={12} /> Trust & Verification
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
              Two-Way Trust <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-emerald-400 to-white italic font-normal">Reputation Engine.</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Trust is a financial asset. GoFlex Scores evaluate both owners (for response times, maintenance SLA, transparency) and residents (for timely rent settlements and compliance).
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-[#080A0E]/60 border border-white/10 rounded-2xl">
                <p className="text-white font-bold text-sm">Owner Scorecards</p>
                <p className="text-slate-500 text-[10px] mt-1 leading-relaxed">Includes verified maintenance speed and tenant review logs.</p>
              </div>
              <div className="p-6 bg-[#080A0E]/60 border border-white/10 rounded-2xl">
                <p className="text-white font-bold text-sm">Tenant Credit Logs</p>
                <p className="text-slate-500 text-[10px] mt-1 leading-relaxed">Aggregated scores enable lower deposits and smooth relocations.</p>
              </div>
            </div>
          </div>
          
          <div className="p-8 bg-[#080A0E]/60 border border-white/10 rounded-[32px] space-y-6">
            <h4 className="text-white font-black text-sm uppercase tracking-wider">Verification Standards</h4>
            <div className="space-y-4">
              {[
                { title: 'DigiLocker Identity Verification', desc: 'Government Aadhaar eSign checks complete in minutes.' },
                { title: 'Automated Late-Fee Engine', desc: 'Ensures clear financial logs and transparent settlements.' },
                { title: 'Secure Escrow Protocol', desc: 'Security deposits are held safely and yield yields prior to refund.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-white/5 border border-white/5 rounded-xl">
                  <CheckCircle size={18} className="text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-white font-bold text-xs">{item.title}</p>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ENTERPRISE / DEVELOPER PLATFORM SECTION */}
        <section className="py-24 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
          <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-violet-500/10 border border-violet-500/30 text-violet-400 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
                <Globe size={12} /> B2B & Developer Platform
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none">
                Enterprise Scale <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-white italic font-normal">Developers API.</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Scale PG franchises, student housings, or coliving chains with regional managers, role-based controls, and bulk document generation. Developers can integrate GoFlex APIs into college portals or HR relocation suites.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Multi-Property OS', desc: 'Central pricing, regional manager logins, and unified B2B analytics.' },
                { title: 'API Integration', desc: 'Secure endpoints for college housing portals and smart lock systems.' },
                { title: 'Bulk eSignatures', desc: 'Generate and send thousands of rental agreements via automated flows.' },
                { title: 'Enterprise Audit logs', desc: 'Secure, trackable audit ledger for operations and compliance logs.' }
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-[#080A0E]/60 border border-white/10 rounded-2xl space-y-2">
                  <h4 className="text-white font-bold text-sm">{item.title}</h4>
                  <p className="text-slate-500 text-[10px] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* START YOUR JOURNEY */}
        <section className="py-40 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-purple-900/10 to-obsidian" />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-8 text-center space-y-12">
            <div className="flex flex-col items-center gap-6">
              <Shield className="text-neon-blue" size={64} />
              <h2 className="text-5xl lg:text-8xl font-black text-white tracking-tighter uppercase leading-none">Start Your <br /><span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-white to-white/10">Journey</span></h2>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <NavLink to="/register">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="px-16 py-8 bg-white text-obsidian font-black rounded-3xl shadow-2xl uppercase tracking-[0.2em] text-[10px]">
                  Initialize Onboarding
                </motion.button>
              </NavLink>
            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
}

