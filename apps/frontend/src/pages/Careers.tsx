import React from 'react';
import PageTransition from '../components/common/PageTransition';
import { Briefcase, MapPin, Code, Cpu, PhoneCall, Shield } from 'lucide-react';

const openRoles = [
  {
    title: "Lead IoT Telemetry Engineer",
    department: "Engineering",
    location: "Bengaluru, India (Hybrid)",
    icon: <Cpu size={24} className="text-neon-blue" />,
    desc: "Build the pipeline integration for our smart electricity, water sub-meters, and facial recognition gate hardware."
  },
  {
    title: "Senior Full-Stack Developer",
    department: "Engineering",
    location: "Remote / Bengaluru",
    icon: <Code size={24} className="text-purple-500" />,
    desc: "Scale the React, Next.js, Node/Express codebase, and optimize digital escrow clearance routes."
  },
  {
    title: "Resident Experience Lead",
    department: "Operations",
    location: "Mumbai, India",
    icon: <PhoneCall size={24} className="text-amber-400" />,
    desc: "Manage the local GoFlex Nodes, coordinate premium resident events, and resolve maintenance SLAs."
  },
  {
    title: "Security & Compliance Officer",
    department: "Legal / Ops",
    location: "Bengaluru, India",
    icon: <Shield size={24} className="text-emerald-400" />,
    desc: "Manage government Aadhaar e-sign and DigiLocker SDK integrations, and audit financial escrows."
  }
];

export default function Careers() {
  return (
    <PageTransition>
      <section className="content-wrap min-h-screen bg-obsidian text-slate-200 py-24 px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-neon-blue/10 border border-neon-blue/20 text-neon-blue rounded-full text-[10px] font-black uppercase tracking-widest w-fit mx-auto">
            Join Our Mission
          </span>
          <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tight">Shape Urban Living</h1>
          <p className="text-slate-400 text-lg">
            Build the next generation of tech-enabled housing communities for builders, creators, and professionals.
          </p>
        </div>

        <div className="glass-morphism rounded-[40px] p-10 border-white/5 grid md:grid-cols-3 gap-8 text-center">
          {[
            { title: "High-Performance Culture", desc: "Work with ambitious teams focused on building world-class technology infrastructure." },
            { title: "Premium Workspaces", desc: "Enjoy flexible hybrid work schedules with free access to GoFlex Nodes." },
            { title: "Industry-Leading Pay", desc: "Top compensation packages with equity pools and comprehensive healthcare." }
          ].map((item, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">{item.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <Briefcase className="text-neon-blue" size={24} />
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Open Opportunities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {openRoles.map((role, idx) => (
              <div key={idx} className="glass-morphism p-8 rounded-[32px] border-white/5 hover:border-neon-blue/30 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                      {role.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white uppercase tracking-tight">{role.title}</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{role.department}</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{role.desc}</p>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {role.location}</span>
                  <button className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-neon-blue hover:text-obsidian hover:border-neon-blue transition-all duration-300">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
