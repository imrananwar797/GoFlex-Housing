import React from 'react';
import { motion } from 'framer-motion';

interface Transaction {
  id: string;
  type: 'Electricity' | 'Water' | 'Rent';
  amount: number;
  date: string;
  status: 'Paid' | 'Overdue' | 'Pending';
}

const transactions: Transaction[] = [
  { id: '#TX-8821', type: 'Rent', amount: 15000, date: '01 May 2024', status: 'Paid' },
  { id: '#TX-8822', type: 'Electricity', amount: 840, date: '03 May 2024', status: 'Paid' },
  { id: '#TX-8823', type: 'Water', amount: 120, date: '04 May 2024', status: 'Pending' },
  { id: '#TX-8824', type: 'Electricity', amount: 450, date: '15 Apr 2024', status: 'Overdue' },
];

const statusStyles = {
  Paid: 'bg-neon-green/10 text-neon-green border-neon-green/30 shadow-neon-green',
  Pending: 'bg-neon-blue/10 text-neon-blue border-neon-blue/30 shadow-neon-blue',
  Overdue: 'bg-neon-red/10 text-neon-red border-neon-red/30 shadow-neon-red',
};

export default function GlassTable({ 
  items = transactions,
  emptyMessage = "No transactions recorded yet."
}: {
  items?: Transaction[];
  emptyMessage?: string;
}) {
  return (
    <div className="bg-[#080A0E]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 w-full shadow-2xl relative overflow-hidden transform-gpu">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Transaction Ledger</h3>
        <div className="flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-blue/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-1.5">
          <thead>
            <tr className="text-slate-600 text-[9px] uppercase tracking-[0.2em]">
              <th className="px-4 py-2 font-black">Ref ID</th>
              <th className="px-4 py-2 font-black">Category</th>
              <th className="px-4 py-2 font-black">Amount</th>
              <th className="px-4 py-2 font-black">Date</th>
              <th className="px-4 py-2 font-black text-right pr-8">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((tx, i) => (
              <motion.tr 
                key={tx.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className="bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200 group cursor-pointer will-change-transform"
              >
                <td className="px-4 py-3 first:rounded-l-lg border-y border-l border-white/5 font-mono text-[10px] text-slate-500 group-hover:text-neon-blue transition-colors">
                  {tx.id}
                </td>
                <td className="px-4 py-3 border-y border-white/5">
                  <span className="text-[11px] font-bold text-white tracking-tight">{tx.type}</span>
                </td>
                <td className="px-4 py-3 border-y border-white/5">
                  <span className="text-[11px] font-black text-white">₹{tx.amount.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3 border-y border-white/5 text-[10px] text-slate-600 font-medium">{tx.date}</td>
                <td className="px-4 py-3 last:rounded-r-lg border-y border-r border-white/5 text-right pr-6">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${tx.status === 'Paid' ? 'bg-neon-green shadow-[0_0_8px_rgba(57,255,20,0.5)]' : tx.status === 'Pending' ? 'bg-neon-blue shadow-[0_0_8px_rgba(0,209,255,0.5)]' : 'bg-neon-red shadow-[0_0_8px_rgba(255,49,49,0.5)]'}`} />
                  <span className={`text-[9px] font-black uppercase tracking-widest ${tx.status === 'Paid' ? 'text-neon-green' : tx.status === 'Pending' ? 'text-neon-blue' : 'text-neon-red'}`}>
                    {tx.status}
                  </span>
                </td>
              </motion.tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500 text-[10px] font-black uppercase tracking-widest italic opacity-50">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
