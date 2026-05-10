import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, LogOut, Camera, Save, X } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

export default function UserProfilePanel({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '+91 98765 43210'
  });

  const handleSave = () => {
    // In a real app, this would call an API
    setIsEditing(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute top-full right-0 mt-4 w-80 sm:w-96 bg-[#0B0E14] border border-white/10 rounded-[32px] shadow-2xl z-[100] overflow-hidden backdrop-blur-xl"
    >
      <div className="relative h-24 bg-gradient-to-r from-neon-blue/20 to-purple-500/20">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-all"
        >
          <X size={14} />
        </button>
      </div>

      <div className="px-6 pb-6">
        <div className="relative -mt-10 mb-6 inline-block">
          <div className="w-20 h-20 rounded-[28px] bg-gradient-to-tr from-neon-blue via-purple-500 to-neon-red p-[2px] shadow-2xl">
            <div className="w-full h-full rounded-[26px] bg-[#0B0E14] flex items-center justify-center font-black text-2xl text-white">
              {user?.username?.[0].toUpperCase()}
            </div>
          </div>
          <button className="absolute bottom-0 right-0 p-1.5 bg-neon-blue text-obsidian rounded-xl shadow-lg hover:scale-110 transition-transform">
            <Camera size={14} />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-black text-white tracking-tighter">
            {user?.full_name || user?.username}
          </h3>
          <p className="text-xs text-neon-blue font-black uppercase tracking-widest flex items-center gap-2 mt-1">
            <Shield size={12} /> {user?.role || 'Verified Resident'}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input 
                type="text"
                disabled={!isEditing}
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold text-white focus:border-neon-blue/50 focus:bg-white/10 transition-all outline-none disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input 
                type="email"
                disabled={!isEditing}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold text-white focus:border-neon-blue/50 focus:bg-white/10 transition-all outline-none disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="col-span-2 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="py-4 bg-white/5 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="py-4 bg-neon-blue text-obsidian font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-neon-blue/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Save size={14} /> Save
              </button>
            </>
          )}
          
          <button 
            onClick={() => logout()}
            className="col-span-2 mt-2 py-4 text-neon-red font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-neon-red/10 transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={14} /> Sign Out of Account
          </button>
        </div>
      </div>
    </motion.div>
  );
}
