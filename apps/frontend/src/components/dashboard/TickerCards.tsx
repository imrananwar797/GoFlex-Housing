import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Droplets, Ticket } from 'lucide-react';

interface TickerCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: React.ElementType;
  trend?: string;
  statusColor?: 'blue' | 'green' | 'red';
}

const colorMap = {
  blue: 'text-neon-blue border-neon-blue/30 shadow-neon-blue',
  green: 'text-neon-green border-neon-green/30 shadow-neon-green',
  red: 'text-neon-red border-neon-red/30 shadow-neon-red',
};

export function TickerCard({ title, value, unit, icon: Icon, trend, statusColor = 'blue' }: TickerCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -2, scale: 1.01 }}
      className={`bg-obsidian/60 backdrop-blur-xl border border-white/5 rounded-xl p-3 flex flex-col justify-between h-28 transition-all duration-300 hover:border-white/10 ${colorMap[statusColor]}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">{title}</span>
        <div className={`p-1.5 rounded-lg bg-white/5 ${colorMap[statusColor]}`}>
          <Icon size={14} />
        </div>
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-white tracking-tighter">{value}</span>
          {unit && <span className="text-[10px] text-slate-500 font-bold">{unit}</span>}
        </div>
        {trend && (
          <div className="flex items-center gap-1 mt-0.5">
            <TrendingUp size={10} className={statusColor === 'red' ? 'text-neon-red' : 'text-neon-green'} />
            <span className={`text-[9px] font-black ${statusColor === 'red' ? 'text-neon-red' : 'text-neon-green'}`}>{trend}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function TickerGrid({ items }: { items?: TickerCardProps[] }) {
  const defaultItems: TickerCardProps[] = [
    { title: "Monthly Rent", value: "₹15,000", unit: "INR", icon: Zap, trend: "+2.4%" },
    { title: "Electricity", value: "124", unit: "Units", icon: Zap, statusColor: "blue", trend: "-12%" },
    { title: "Water", value: "1.2k", unit: "Liters", icon: Droplets, statusColor: "blue" },
    { title: "Maintenance", value: "02", icon: Ticket, statusColor: "red", trend: "Priority" },
  ];

  const displayItems = items || defaultItems;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {displayItems.map((item, i) => (
        <TickerCard key={i} {...item} />
      ))}
    </div>
  );
}
