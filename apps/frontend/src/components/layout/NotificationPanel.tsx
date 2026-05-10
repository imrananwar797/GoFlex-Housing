import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Info, AlertCircle, ShoppingBag } from 'lucide-react';

const notifications = [
  {
    id: 1,
    title: 'New Property Alert',
    message: 'A new suite in Bengaluru is now available for booking.',
    time: '2 mins ago',
    type: 'info',
    icon: Info,
    color: 'text-blue-500'
  },
  {
    id: 2,
    title: 'Payment Successful',
    message: 'Your monthly rent for Jaipur Heritage has been processed.',
    time: '1 hour ago',
    type: 'success',
    icon: Check,
    color: 'text-green-500'
  },
  {
    id: 3,
    title: 'Verification Required',
    message: 'Please complete your KYC to unlock all features.',
    time: '5 hours ago',
    type: 'warning',
    icon: AlertCircle,
    color: 'text-yellow-500'
  }
];

export default function NotificationPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute top-full right-0 mt-4 w-80 sm:w-96 bg-[#0B0E14] border border-white/10 rounded-[24px] shadow-2xl z-[100] overflow-hidden backdrop-blur-xl"
    >
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
          <Bell size={16} className="text-neon-blue" /> Notifications
        </h3>
        <span className="px-2 py-0.5 bg-neon-red/10 text-neon-red text-[10px] font-black rounded-full uppercase tracking-tighter">
          3 New
        </span>
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {notifications.map((n) => (
          <div 
            key={n.id}
            className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
          >
            <div className="flex gap-4">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-white/20 transition-all ${n.color}`}>
                <n.icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-xs font-bold text-white truncate">{n.title}</p>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">{n.time}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {n.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white/5 text-center">
        <button className="text-[10px] font-black text-neon-blue uppercase tracking-widest hover:text-white transition-colors">
          View All Activity
        </button>
      </div>
    </motion.div>
  );
}
