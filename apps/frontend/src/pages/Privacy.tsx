import React from 'react';
import PageTransition from '../components/common/PageTransition';

export default function Privacy() {
  return (
    <PageTransition>
      <section className="content-wrap min-h-screen bg-obsidian text-slate-200 py-24 px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-neon-blue/10 border border-neon-blue/20 text-neon-blue rounded-full text-[10px] font-black uppercase tracking-widest w-fit mx-auto">
            Trust & Security
          </span>
          <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tight">Privacy Protocol</h1>
          <p className="text-slate-400 text-lg">
            We are committed to absolute data transparency, bank-grade security, and government-verified compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Identity & KYC Verification",
              desc: "All resident and landlord verifications are completed directly via integration with Aadhaar and DigiLocker systems. We do not store raw identity passwords; only official cryptographically-hashed validation credentials.",
              scope: "DigiLocker API & Aadhaar Ledger"
            },
            {
              title: "Digital Escrow Transactions",
              desc: "Security deposits and lease settlements are routed through authorized bank-grade multi-signature digital escrow containers. Payment details are fully encrypted under PCI-DSS compliance protocols.",
              scope: "Escrow Banking & Stripe Clearing"
            },
            {
              title: "Smart IoT Telemetry",
              desc: "Properties equipped with IoT sub-meters for electricity, water, and security access logs report consumption real-time. This log data is restricted to billing calculations and is automatically archived after 6 months.",
              scope: "IoT Meter Nodes & Log Archiving"
            }
          ].map((item, idx) => (
            <div key={idx} className="glass-morphism p-8 rounded-[32px] border-white/5 space-y-4 hover:border-neon-blue/30 transition-all duration-300">
              <span className="text-[10px] text-neon-blue font-black uppercase tracking-widest">{item.scope}</span>
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">{item.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass-morphism rounded-[40px] p-10 border-white/5 space-y-8">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Data Policy Framework</h2>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-bold text-sm mb-2">1. Information Collection</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                We collect personal information necessary to deliver housing services, including contact information, tenant history, smart utility logs, and financial transaction records.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-2">2. Information Sharing & Disclosure</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                GoFlex never sells your data to advertisers. We share verification parameters with government nodes for legal identity confirmation and escrow banks for financial settlement clearing.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-2">3. Cryptographic Security</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                All telemetry data and communication channels are encrypted using 256-bit AES at rest and TLS 1.3 in transit. System activity logs are stored on an immutable tamper-evident ledger.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
