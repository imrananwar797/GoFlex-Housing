import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../../components/common/PageTransition';
import { 
  Calculator, 
  HelpCircle, 
  Coins
} from 'lucide-react';

const FAQS = [
  {
    question: "How are the monthly fees collected?",
    answer: "Our automated payment clearing house handles this. When a tenant pays rent, the convenience fee is added automatically, and the owner commission is deducted before clearing the payout to the owner."
  },
  {
    question: "When is the Lease Agreement Fee charged?",
    answer: "It is charged upfront when a new lease is signed and the security deposit is locked in the digital escrow. It is split 2.5% each between the tenant and the owner."
  },
  {
    question: "Are there any hidden listing or hosting fees?",
    answer: "No. Listing properties and viewing properties on GoFlex is 100% free. We only make money when you do, aligning our platform goals directly with our community."
  },
  {
    question: "How are early termination fees calculated?",
    answer: "If a lease is terminated early by a resident in violation of the agreement, 2% of the remaining contract rent value is deducted from the escrowed security deposit."
  }
];

export default function SubscriptionPlans() {
  const [rentInput, setRentInput] = useState<number>(20000);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Math calculations
  const tenantFee = Math.round(rentInput * 0.01);
  const ownerFee = Math.round(rentInput * 0.01);
  const totalTenantPays = rentInput + tenantFee;
  const netOwnerReceives = rentInput - ownerFee;
  const goflexMonthlyRevenue = tenantFee + ownerFee;

  const tenantOnboarding = Math.round(rentInput * 0.025);
  const ownerOnboarding = Math.round(rentInput * 0.025);
  const totalOnboardingRevenue = tenantOnboarding + ownerOnboarding;

  return (
    <PageTransition>
      <div className="min-h-screen bg-obsidian text-white pt-32 pb-20 px-4 md:px-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-eyebrow mb-6 justify-center"
          >
            Pricing & Model
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-black mb-8 tracking-tighter uppercase"
          >
            Double-Sided <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-purple-500">Marketplace</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-xl text-slate-400 max-w-3xl mx-auto"
          >
            No upfront SaaS fees. GoFlex aligns directly with platform utility—charging a nominal commission on transaction volume only when a lease is successfully created and maintained.
          </motion.p>
        </div>

        {/* Interactive Calculator Section */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24 items-stretch">
          
          {/* Slider input panel */}
          <div className="lg:col-span-5 glass-morphism rounded-[32px] p-8 border-white/5 flex flex-col justify-between bg-white/[0.01]">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-neon-blue/10 text-neon-blue rounded-xl">
                  <Calculator size={20} />
                </div>
                <h3 className="text-xl font-black">Fee Calculator</h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed mb-8">
                Enter a monthly rent estimate to see how the double-sided take-rate and onboarding commissions split automatically in real-time.
              </p>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-300">Monthly Rent (₹)</span>
                    <span className="text-xl font-black text-neon-blue">₹{rentInput.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min={5000} 
                    max={100000} 
                    step={1000} 
                    value={rentInput} 
                    onChange={(e) => setRentInput(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-neon-blue"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-bold">
                    <span>₹5,000</span>
                    <span>₹50,000</span>
                    <span>₹100,000</span>
                  </div>
                </div>

                <div className="pt-4">
                  <label className="block text-xs font-bold text-slate-400 mb-2">Or enter custom rent amount:</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                    <input 
                      type="number"
                      value={rentInput}
                      onChange={(e) => setRentInput(Math.max(0, Number(e.target.value)))}
                      className="bg-white/5 border border-white/10 rounded-xl py-3.5 pl-8 pr-4 text-sm w-full text-white outline-none focus:border-neon-blue/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 bg-neon-blue/[0.02] -mx-8 -mb-8 p-8 rounded-b-[32px] flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">GoFlex MRR Share (2%)</p>
                <p className="text-2xl font-black text-neon-blue">₹{goflexMonthlyRevenue.toLocaleString()}</p>
              </div>
              <Coins className="text-neon-blue/40" size={32} />
            </div>
          </div>

          {/* Calculator Output Display */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Tenant Breakdown */}
            <div className="bg-[#080A0E]/60 border border-white/5 rounded-[32px] p-8 flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 bg-neon-blue/10 border border-neon-blue/20 text-neon-blue rounded-full text-[9px] font-black uppercase tracking-widest">
                  Resident (Tenant)
                </span>
                <h4 className="text-2xl font-black mt-4 mb-2 text-white">Monthly Invoice</h4>
                <p className="text-slate-400 text-xs mb-8">Tenant pays a 1% convenience fee for dashboard & payment rails.</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Base rent:</span>
                  <span>₹{rentInput.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Platform fee (1%):</span>
                  <span className="text-neon-blue">+ ₹{tenantFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-white/5 pt-3 text-white">
                  <span>Total paid:</span>
                  <span className="text-lg font-black">₹{totalTenantPays.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Landlord Breakdown */}
            <div className="bg-[#080A0E]/60 border border-white/5 rounded-[32px] p-8 flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-[9px] font-black uppercase tracking-widest">
                  Owner (Landlord)
                </span>
                <h4 className="text-2xl font-black mt-4 mb-2 text-white">Monthly Payout</h4>
                <p className="text-slate-400 text-xs mb-8">Landlord pays a 1% brokerage and dashboard administration commission.</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Gross collected:</span>
                  <span>₹{rentInput.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Commission (1%):</span>
                  <span className="text-purple-400">- ₹{ownerFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-white/5 pt-3 text-white">
                  <span>Net payout:</span>
                  <span className="text-lg font-black text-purple-400">₹{netOwnerReceives.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Lease Onboarding Split */}
            <div className="sm:col-span-2 bg-[#080A0E]/60 border border-white/5 rounded-[32px] p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-[9px] font-black uppercase tracking-widest">
                    Lease Contract Onboarding
                  </span>
                </div>
                <h4 className="text-xl font-black text-white">Agreement Processing Fee</h4>
                <p className="text-slate-400 text-xs mt-2">
                  A flat 5% fee on the first month's rent split equally (2.5% each) for generating verified digital leases, escrow locking, and tenant background profiling.
                </p>
              </div>
              <div className="space-y-3 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Tenant pays (2.5%):</span>
                  <span>₹{tenantOnboarding.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Owner pays (2.5%):</span>
                  <span>₹{ownerOnboarding.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-black border-t border-white/5 pt-3 text-white">
                  <span>GoFlex agreement revenue:</span>
                  <span className="text-amber-400">₹{totalOnboardingRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Operational Cash Flow Matrix Table */}
        <div className="max-w-6xl mx-auto mb-32">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-black mb-3 uppercase tracking-tight">Operational Cash Flow Matrix</h3>
            <p className="text-slate-400 text-sm">Detailed fee breakdowns and collection triggers in the GoFlex clearing rails.</p>
          </div>

          <div className="glass-morphism rounded-[32px] border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="p-6 text-xs font-black uppercase text-slate-500">Transaction Type</th>
                    <th className="p-6 text-xs font-black uppercase text-slate-500">Resident Fee</th>
                    <th className="p-6 text-xs font-black uppercase text-slate-500">Owner Fee</th>
                    <th className="p-6 text-xs font-black uppercase text-slate-500">Frequency</th>
                    <th className="p-6 text-xs font-black uppercase text-slate-500">Collection Channel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                    <td className="p-6 font-bold text-white">Monthly Rent Payout</td>
                    <td className="p-6 text-neon-blue font-bold">1% of rent</td>
                    <td className="p-6 text-purple-400 font-bold">1% of rent</td>
                    <td className="p-6 text-slate-400">Monthly</td>
                    <td className="p-6 text-slate-500 text-xs">Clearing engine deduction during rent release</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                    <td className="p-6 font-bold text-white">New Lease Onboarding</td>
                    <td className="p-6 text-neon-blue font-bold">2.5% of 1st mo. rent</td>
                    <td className="p-6 text-purple-400 font-bold">2.5% of 1st mo. rent</td>
                    <td className="p-6 text-slate-400">One-Time</td>
                    <td className="p-6 text-slate-500 text-xs">Collected upfront during security deposit lockup</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                    <td className="p-6 font-bold text-white">Agreement Renewal</td>
                    <td className="p-6 text-neon-blue font-bold">₹500 flat</td>
                    <td className="p-6 text-purple-400 font-bold">₹500 flat</td>
                    <td className="p-6 text-slate-400">Per renewal cycle</td>
                    <td className="p-6 text-slate-500 text-xs">Automated invoice via backend lease expiration cron</td>
                  </tr>
                  <tr className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-6 font-bold text-white">Early Termination</td>
                    <td className="p-6 text-rose-400 font-bold">2% of remaining contract</td>
                    <td className="p-6 text-emerald-400 font-bold">0%</td>
                    <td className="p-6 text-slate-400">On Lease violation</td>
                    <td className="p-6 text-slate-500 text-xs">Deducted from the escrowed security deposit ledger</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-black mb-3 uppercase tracking-tight">Marketplace FAQ</h3>
            <p className="text-slate-400 text-sm">Everything you need to know about our aligned incentives framework.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="glass-morphism rounded-[24px] border-white/5 overflow-hidden transition-all duration-300 bg-white/[0.01]"
                >
                  <button 
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-6 flex justify-between items-center text-left hover:bg-white/[0.02] transition-all border-none bg-transparent"
                  >
                    <span className="font-bold text-slate-200">{faq.question}</span>
                    <HelpCircle size={18} className={`text-neon-blue transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6 text-slate-400 text-sm leading-relaxed"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
