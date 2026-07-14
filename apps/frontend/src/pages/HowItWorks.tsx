import React from 'react';
import PageTransition from '../components/common/PageTransition';
import { Search, ShieldCheck, Lock, Key, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const steps = [
  {
    step: "01",
    title: "Discover Premium Nodes",
    desc: "Browse our curated network of modern, fully-serviced co-living spaces. Compare features, pricing, and live room availability instantly.",
    icon: <Search className="text-neon-blue" size={32} />
  },
  {
    step: "02",
    title: "Instant KYC & Digital Lease",
    desc: "Verify your profile via Aadhaar and DigiLocker integrations. Customize and execute legally-binding rental agreements in under 5 minutes.",
    icon: <ShieldCheck className="text-purple-500" size={32} />
  },
  {
    step: "03",
    title: "Escrow Deposit Lock",
    desc: "Deposit security funds directly into secure, bank-grade escrow accounts. Your deposit is legally protected under strict smart lease conditions.",
    icon: <Lock className="text-amber-400" size={32} />
  },
  {
    step: "04",
    title: "Seamless Biometric Onboarding",
    desc: "Sync your digital keys, complete IoT face-recognition enrollment, and settle into your premium space with absolute ease.",
    icon: <Key className="text-emerald-400" size={32} />
  }
];

export default function HowItWorks() {
  return (
    <PageTransition>
      <section className="content-wrap min-h-screen bg-obsidian text-slate-200 py-24 px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-neon-blue/10 border border-neon-blue/20 text-neon-blue rounded-full text-[10px] font-black uppercase tracking-widest w-fit mx-auto">
            Our Flow
          </span>
          <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tight">How GoFlex Works</h1>
          <p className="text-slate-400 text-lg">
            A frictionless, technology-first rental lifecycle designed for landlords and residents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, idx) => (
            <div key={idx} className="glass-morphism p-8 rounded-[32px] border-white/5 space-y-6 flex flex-col justify-between hover:border-neon-blue/30 transition-all duration-300 relative group">
              <div className="absolute top-6 right-6 text-3xl font-black text-white/5 group-hover:text-neon-blue/10 transition-colors">
                {item.step}
              </div>
              <div className="space-y-4">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight leading-snug">{item.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-morphism rounded-[40px] p-12 border-white/5 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Ready to experience the future?</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Whether you are a tenant looking for a smart co-living sanctuary or a property owner wanting to automate your operations, GoFlex provides a unified system.
            </p>
            <div className="flex gap-4 pt-4">
              <NavLink to="/properties" className="px-6 py-4 bg-neon-blue text-obsidian font-black rounded-xl uppercase tracking-widest text-[10px] hover:scale-105 transition-all">
                Explore Spaces
              </NavLink>
              <NavLink to="/register" className="px-6 py-4 border border-white/10 text-white font-black rounded-xl uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all">
                Create Account
              </NavLink>
            </div>
          </div>
          <div className="border border-white/5 rounded-3xl p-8 bg-[#080A0E]/50 space-y-4">
            <h4 className="text-xs font-black uppercase text-neon-blue tracking-widest">Platform Integrity Stats</h4>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-2xl font-black text-white">4.8 min</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Average e-Sign Lease Time</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Direct Landlord Verification</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">0%</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Brokerage Fees Paid</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">₹0</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Lease Settlement Disputes</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
