import React, { useEffect, useState } from 'react';
import PageTransition from '../../components/common/PageTransition';
import { Coins, FileDown } from 'lucide-react';
import '../Dashboard.css';

export default function SubscriptionHistory() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Mocked transactional clearance history
  const history = [
    {
      date: 'July 1, 2026',
      txId: 'TXN-9023189',
      category: 'Lease Onboarding',
      baseAmount: 20000,
      feeType: 'Agreement Fee (2.5%)',
      feeAmount: 500,
      totalPaid: 500,
      status: 'CLEARED'
    },
    {
      date: 'July 1, 2026',
      txId: 'TXN-9023190',
      category: 'Security Deposit',
      baseAmount: 40000,
      feeType: 'Escrow Lockup',
      feeAmount: 0,
      totalPaid: 40000,
      status: 'HELD_IN_ESCROW'
    },
    {
      date: 'July 1, 2026',
      txId: 'TXN-9023195',
      category: 'Monthly Rent (July)',
      baseAmount: 20000,
      feeType: 'Convenience Fee (1%)',
      feeAmount: 200,
      totalPaid: 20200,
      status: 'CLEARED'
    }
  ];

  const handlePrint = (record: any) => {
    const printWindow = window.open('', '_blank', 'width=1100,height=750');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Rent Clearance Certificate - ${record.txId}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Outfit:wght@400;700;900&display=swap');
            @page {
              size: A4 landscape;
              margin: 10mm;
            }
            body {
              font-family: 'Inter', sans-serif;
              color: #0c0d12;
              background: #fff;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact;
            }
            .invoice-box {
              border: 3px double #1a1a24;
              border-radius: 16px;
              padding: 30px;
              max-width: 1020px;
              margin: auto;
              background: #fff;
              position: relative;
            }
            .header-layout {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px dashed #e2e8f0;
              padding-bottom: 20px;
              margin-bottom: 24px;
            }
            .brand-name {
              font-family: 'Outfit', sans-serif;
              font-size: 32px;
              font-weight: 900;
              letter-spacing: -1.5px;
              text-transform: uppercase;
              margin: 0;
              color: #0b0e14;
            }
            .brand-sub {
              color: #00D1FF;
              font-weight: 400;
            }
            .company-address {
              font-size: 11px;
              color: #718096;
              margin-top: 6px;
              line-height: 1.4;
            }
            .receipt-type {
              text-align: right;
            }
            .receipt-title {
              font-size: 18px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 2px;
              color: #0b0e14;
              margin: 0;
            }
            .receipt-sub {
              font-size: 11px;
              color: #718096;
              margin-top: 4px;
            }
            .grid-metadata {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 50px;
              margin-bottom: 30px;
              font-size: 12px;
            }
            .metadata-block h4 {
              margin: 0 0 8px;
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              color: #a0aec0;
            }
            .metadata-block p {
              margin: 0 0 4px;
              line-height: 1.5;
            }
            .item-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .item-table th {
              background: #f7fafc;
              border-top: 1.5px solid #1a1a24;
              border-bottom: 1.5px solid #1a1a24;
              padding: 12px;
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              color: #4a5568;
              letter-spacing: 1px;
            }
            .item-table td {
              padding: 14px 12px;
              border-bottom: 1px solid #edf2f7;
              font-size: 12px;
            }
            .item-table tr.total-row td {
              border-top: 1.5px solid #1a1a24;
              border-bottom: 1.5px solid #1a1a24;
              font-weight: 800;
              font-size: 14px;
              background: #f7fafc;
            }
            .legal-footer {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 40px;
              font-size: 10px;
              color: #a0aec0;
              line-height: 1.5;
            }
            .seals-container {
              display: flex;
              gap: 30px;
              align-items: center;
            }
            .stamp-seal {
              border: 3px double #00D1FF;
              padding: 10px 18px;
              border-radius: 12px;
              text-align: center;
              font-family: 'Outfit', sans-serif;
              color: #00D1FF;
              font-weight: 800;
              text-transform: uppercase;
              font-size: 10px;
              letter-spacing: 1px;
              transform: rotate(-3deg);
              background: rgba(0, 209, 255, 0.02);
            }
            .qr-svg {
              width: 75px;
              height: 75px;
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header-layout">
              <div>
                <h1 class="brand-name">GoFlex <span class="brand-sub">Housing</span></h1>
                <div class="company-address">
                  GoFlex Housing Solutions Private Limited<br/>
                  CIN: U74999KA2026PTC123456 | GSTIN: 29AAACG8720M1ZP<br/>
                  Corporate HQ: Cyberpunk Sanctuary Node, Indiranagar, Bengaluru, KA - 560038
                </div>
              </div>
              <div class="receipt-type">
                <h2 class="receipt-title">Clearance Receipt</h2>
                <div class="receipt-sub">Officially generated & digital-escrow cleared</div>
              </div>
            </div>

            <div class="grid-metadata">
              <div class="metadata-block">
                <h4>Issued To (Resident)</h4>
                <p><strong>Aarav Sharma</strong> (Resident ID: RES-7023)</p>
                <p>GoFlex Indiranagar Node, Room 204</p>
                <p>Bengaluru, Karnataka - 560038</p>
              </div>
              <div class="metadata-block" style="text-align: right;">
                <h4>Transaction Details</h4>
                <p><strong>Invoice No:</strong> GF-${record.txId}</p>
                <p><strong>Date:</strong> ${record.date}</p>
                <p><strong>Clearance Ref:</strong> ESCROW-9023190</p>
                <p><strong>Status:</strong> CLEARED & RECONCILED</p>
              </div>
            </div>

            <table class="item-table">
              <thead>
                <tr>
                  <th style="text-align: left; width: 50%;">Description / Category</th>
                  <th style="text-align: right; width: 15%;">Base Amount</th>
                  <th style="text-align: right; width: 15%;">CGST (9%)</th>
                  <th style="text-align: right; width: 15%;">SGST (9%)</th>
                  <th style="text-align: right; width: 15%;">Total Charged</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-weight: 600; color: #1a202c;">${record.category} - Rent Charge</td>
                  <td style="text-align: right;">₹${record.baseAmount.toLocaleString()}.00</td>
                  <td style="text-align: right;">—</td>
                  <td style="text-align: right;">—</td>
                  <td style="text-align: right; font-weight: 600;">₹${record.baseAmount.toLocaleString()}.00</td>
                </tr>
                <tr>
                  <td style="font-weight: 600; color: #1a202c;">Platform Convenience Fee & Escrow clearing</td>
                  <td style="text-align: right;">₹${(record.feeAmount > 0 ? Math.round(record.feeAmount * 0.84) : 0).toLocaleString()}.00</td>
                  <td style="text-align: right;">₹${(record.feeAmount > 0 ? Math.round(record.feeAmount * 0.08) : 0).toLocaleString()}.00</td>
                  <td style="text-align: right;">₹${(record.feeAmount > 0 ? Math.round(record.feeAmount * 0.08) : 0).toLocaleString()}.00</td>
                  <td style="text-align: right; font-weight: 600;">₹${record.feeAmount.toLocaleString()}.00</td>
                </tr>
                <tr class="total-row">
                  <td style="text-align: left; font-weight: 800; color: #0b0e14;">Gross Ledger Payout Clearance (INR)</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td style="text-align: right; font-weight: 900; color: #0b0e14;">₹${record.totalPaid.toLocaleString()}.00</td>
                </tr>
              </tbody>
            </table>

            <div class="legal-footer">
              <div>
                <p><em>* This receipt is a system-generated document compiled through the GoFlex Escrow protocol.</em></p>
                <p>Section 5 of the Information Technology Act, 2000 applies. Secure digital stamp has been applied on clearance.</p>
              </div>
              <div class="seals-container">
                <svg class="qr-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 5h30v10H15v20H5V5zm60 0h30v30H85V15H65V5zM5 65h10v20h20v10H5V65zm90 0v30H65v-10h20V65h10z" fill="#0b0e14"/>
                  <rect x="20" y="20" width="20" height="20" fill="#0b0e14"/>
                  <rect x="60" y="20" width="20" height="20" fill="#0b0e14"/>
                  <rect x="20" y="60" width="20" height="20" fill="#0b0e14"/>
                  <rect x="60" y="60" width="10" height="10" fill="#0b0e14"/>
                  <rect x="70" y="70" width="10" height="10" fill="#0b0e14"/>
                  <rect x="50" y="45" width="10" height="10" fill="#0b0e14"/>
                </svg>
                <div class="stamp-seal">
                  GoFlex Verified<br/>
                  <span style="font-size: 8px;">Clearing Office</span>
                </div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <PageTransition>
      <section className="content-wrap dashboard-page space-y-8">
        <div className="dashboard-header">
          <h1 className="dashboard-title uppercase font-black text-white">Transaction Ledger History</h1>
          <p className="dashboard-subtitle">A transparent ledger of rent payouts, convenience fees, and digital contract releases</p>
        </div>

        <div className="glass-morphism rounded-[32px] border-white/5 overflow-hidden bg-white/[0.01]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="p-6 text-xs font-black uppercase text-slate-500">Date</th>
                  <th className="p-6 text-xs font-black uppercase text-slate-500">TX ID</th>
                  <th className="p-6 text-xs font-black uppercase text-slate-500">Category</th>
                  <th className="p-6 text-xs font-black uppercase text-slate-500">Base Rent</th>
                  <th className="p-6 text-xs font-black uppercase text-slate-500">Fee (1% / 2.5%)</th>
                  <th className="p-6 text-xs font-black uppercase text-slate-500">Total Charged</th>
                  <th className="p-6 text-xs font-black uppercase text-slate-500">Status</th>
                  <th className="p-6 text-xs font-black uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                    <td className="p-6 text-slate-300 font-semibold">{record.date}</td>
                    <td className="p-6 text-slate-500 text-xs">{record.txId}</td>
                    <td className="p-6 font-bold text-white">{record.category}</td>
                    <td className="p-6 text-slate-400">₹{record.baseAmount.toLocaleString()}</td>
                    <td className="p-6 text-neon-blue">
                      {record.feeAmount > 0 ? `+ ₹${record.feeAmount.toLocaleString()}` : '—'}
                    </td>
                    <td className="p-6 font-bold text-slate-200">₹{record.totalPaid.toLocaleString()}</td>
                    <td className="p-6">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        record.status === 'CLEARED' 
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                          : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                      }`}>
                        {record.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-6">
                      <button 
                        onClick={() => handlePrint(record)}
                        className="px-4 py-2.5 bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue rounded-xl text-xs font-black uppercase tracking-widest border border-neon-blue/30 hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileDown size={14} /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ledger Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#080A0E]/60 border border-white/10 rounded-[24px] p-6 bg-white/[0.01]">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Paid Volume</p>
            <p className="text-2xl font-black text-white">₹{history.reduce((sum, h) => sum + h.totalPaid, 0).toLocaleString()}</p>
          </div>
          <div className="bg-[#080A0E]/60 border border-white/10 rounded-[24px] p-6 bg-white/[0.01]">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Platform Fees Paid</p>
            <p className="text-2xl font-black text-neon-blue">₹{history.reduce((sum, h) => sum + h.feeAmount, 0).toLocaleString()}</p>
          </div>
          <div className="bg-[#080A0E]/60 border border-white/10 rounded-[24px] p-6 bg-white/[0.01]">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Active Escrows</p>
            <p className="text-2xl font-black text-purple-400">1 Lease Escrow</p>
          </div>
        </div>

        <div className="bg-[#080A0E]/60 border border-white/10 rounded-[32px] p-8 space-y-4 bg-white/[0.01]">
          <h4 className="text-lg font-black text-white flex items-center gap-2">
            <Coins className="text-neon-blue" size={20} /> Transparency Guarantee
          </h4>
          <p className="text-slate-400 text-sm leading-relaxed">
            All lease security deposits are held securely in a multi-sig digital escrow account, preventing wrongful landlord retention. Release conditions are governed strictly by the signed rental agreement terms, verified via GoFlex Sentinel compliance.
          </p>
        </div>
      </section>
    </PageTransition>
  );
}
