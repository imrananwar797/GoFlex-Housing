import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Home, Plus, Users, DoorClosed, DoorOpen, X, Pencil } from 'lucide-react';
import { apiClient } from '../../services/api.client';

const ROOM_TYPES = ['single', 'double', 'triple', 'dorm', 'studio'];
const TYPE_COLORS: Record<string, string> = {
  single: 'text-neon-blue border-neon-blue/20 bg-neon-blue/5',
  double: 'text-violet-400 border-violet-400/20 bg-violet-400/5',
  triple: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
  dorm:   'text-rose-400 border-rose-400/20 bg-rose-400/5',
  studio: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
};

const MOCK_ROOMS: any[] = [
  { id: 1, name: 'Room 101', type: 'single', floor: 1, capacity: 1, rent: 8500, is_occupied: true,  property: { name: 'GoFlex Indiranagar' } },
  { id: 2, name: 'Room 102', type: 'double', floor: 1, capacity: 2, rent: 12000, is_occupied: false, property: { name: 'GoFlex Indiranagar' } },
  { id: 3, name: 'Room 201', type: 'single', floor: 2, capacity: 1, rent: 9000, is_occupied: true,  property: { name: 'GoFlex Indiranagar' } },
  { id: 4, name: 'Dorm A',   type: 'dorm',   floor: 1, capacity: 6, rent: 5500, is_occupied: true,  property: { name: 'GoFlex Koramangala' } },
  { id: 5, name: 'Studio 1', type: 'studio', floor: 3, capacity: 1, rent: 14000, is_occupied: false, property: { name: 'GoFlex HSR' } },
];

export default function OwnerRooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editRoom, setEditRoom] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', type: 'single', floor: '', capacity: '1', rent: '', property_id: '1' });
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    (async () => {
      try {
        // In production: apiClient.get('/properties/1/rooms') for each property
        setRooms(MOCK_ROOMS);
      } catch { setRooms(MOCK_ROOMS); }
      finally { setLoading(false); }
    })();
  }, []);

  const openCreate = () => { setEditRoom(null); setForm({ name: '', type: 'single', floor: '', capacity: '1', rent: '', property_id: '1' }); setShowForm(true); };
  const openEdit = (r: any) => { setEditRoom(r); setForm({ name: r.name, type: r.type, floor: String(r.floor || ''), capacity: String(r.capacity), rent: String(r.rent), property_id: '1' }); setShowForm(true); };

  const save = async () => {
    setSaving(true);
    try {
      if (editRoom) {
        await apiClient.patch(`/rooms/${editRoom.id}`, form);
        setRooms(prev => prev.map(r => r.id === editRoom.id ? { ...r, ...form, rent: Number(form.rent), capacity: Number(form.capacity), floor: Number(form.floor) } : r));
      } else {
        const res = await apiClient.post(`/properties/${form.property_id}/rooms`, form);
        setRooms(prev => [...prev, res.data.data || { id: Date.now(), ...form, is_occupied: false }]);
      }
      setShowForm(false);
    } catch {
      if (!editRoom) setRooms(prev => [...prev, { id: Date.now(), ...form, is_occupied: false, property: { name: 'GoFlex Indiranagar' } }]);
      setShowForm(false);
    } finally { setSaving(false); }
  };

  const occupied = rooms.filter(r => r.is_occupied).length;
  const vacant   = rooms.length - occupied;
  const occupancyRate = rooms.length ? Math.round((occupied / rooms.length) * 100) : 0;

  return (
    <DashboardLayout title="Room Management">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white">Room Management</h2>
            <p className="text-slate-500 text-sm mt-1">Manage all rooms across your properties.</p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-6 py-3 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-neon-blue/20 transition-all">
            <Plus size={16} /> Add Room
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Rooms', value: rooms.length, color: 'text-white' },
            { label: 'Occupied', value: occupied, color: 'text-emerald-400' },
            { label: 'Vacant', value: vacant, color: 'text-amber-400' },
            { label: 'Occupancy', value: `${occupancyRate}%`, color: 'text-neon-blue' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-[#080A0E]/60 border border-white/10 rounded-[24px] p-6">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">{s.label}</p>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Room Grid / List */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-white/5 rounded-[24px] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {rooms.map((room, i) => {
              const tc = TYPE_COLORS[room.type] || TYPE_COLORS.single;
              return (
                <motion.div key={room.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                  className="relative bg-[#080A0E]/60 border border-white/10 rounded-[24px] p-6 hover:border-white/20 transition-all group">
                  {/* Edit button */}
                  <button onClick={() => openEdit(room)}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/5 text-slate-400 hover:text-white rounded-lg">
                    <Pencil size={12} />
                  </button>

                  {/* Occupancy indicator */}
                  <div className={`flex items-center gap-2 mb-4 ${room.is_occupied ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {room.is_occupied ? <DoorClosed size={16} /> : <DoorOpen size={16} />}
                    <span className="text-[10px] font-black uppercase tracking-widest">{room.is_occupied ? 'Occupied' : 'Vacant'}</span>
                  </div>

                  <h4 className="text-white font-black text-lg mb-1">{room.name}</h4>
                  <p className="text-slate-500 text-[10px] mb-4">{room.property?.name}</p>

                  <div className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${tc} mb-4`}>
                    {room.type}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-white/5 rounded-xl">
                      <p className="text-slate-500 text-[9px] font-black uppercase">Floor</p>
                      <p className="text-white font-bold text-sm">{room.floor || '—'}</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-xl">
                      <p className="text-slate-500 text-[9px] font-black uppercase">Capacity</p>
                      <p className="text-white font-bold text-sm flex items-center justify-center gap-1"><Users size={10} />{room.capacity}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-emerald-400 font-black text-lg">₹{Number(room.rent).toLocaleString('en-IN')}<span className="text-slate-600 text-[10px] font-normal">/mo</span></p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Add / Edit Room Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
                className="w-full max-w-md bg-[#0B0E14] border border-white/10 rounded-[32px] p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-white">{editRoom ? 'Edit Room' : 'Add Room'}</h3>
                  <button onClick={() => setShowForm(false)} className="p-2 text-slate-500 hover:text-white rounded-xl hover:bg-white/5"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Room Name</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Room 301" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-blue/50 placeholder:text-slate-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Type</label>
                      <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-blue/50">
                        {ROOM_TYPES.map(t => <option key={t} value={t} className="bg-[#0B0E14] capitalize">{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Floor</label>
                      <input value={form.floor} onChange={e => setForm(f => ({ ...f, floor: e.target.value }))}
                        type="number" placeholder="1" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-blue/50 placeholder:text-slate-600" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Capacity</label>
                      <input value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))}
                        type="number" min="1" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-blue/50" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Monthly Rent (₹)</label>
                      <input value={form.rent} onChange={e => setForm(f => ({ ...f, rent: e.target.value }))}
                        type="number" placeholder="8500" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-blue/50 placeholder:text-slate-600" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-white/10 text-slate-400 rounded-2xl text-sm font-black hover:bg-white/5 transition-all">Cancel</button>
                  <button onClick={save} disabled={saving || !form.name || !form.rent}
                    className="flex-1 py-3 bg-neon-blue/20 border border-neon-blue/40 text-neon-blue rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-neon-blue/30 transition-all disabled:opacity-50">
                    {saving ? 'Saving...' : editRoom ? 'Update Room' : 'Add Room'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
