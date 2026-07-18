import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { api } from '../../services/api';
import { Building2, Plus, MapPin, Users, Home, BadgeCheck, ChevronRight, Edit3 } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function OwnerProperties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddRoom, setShowAddRoom] = useState<number | null>(null);
  const [roomForm, setRoomForm] = useState({ name: '', type: 'single', floor: '', capacity: '1', rent: '' });
  const [addingRoom, setAddingRoom] = useState(false);

  useEffect(() => {
    api.get('/api/owner/properties')
      .then(r => setProperties(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAddRoom = async (propertyId: number) => {
    if (!roomForm.name || !roomForm.rent) return;
    setAddingRoom(true);
    try {
      const res = await api.post('/api/rooms', {
        property_id: propertyId,
        name: roomForm.name,
        type: roomForm.type,
        floor: roomForm.floor ? Number(roomForm.floor) : undefined,
        capacity: Number(roomForm.capacity),
        rent: Number(roomForm.rent),
      });
      setProperties(prev => prev.map(p =>
        p.id === propertyId ? { ...p, rooms: [...(p.rooms || []), res.data] } : p
      ));
      setShowAddRoom(null);
      setRoomForm({ name: '', type: 'single', floor: '', capacity: '1', rent: '' });
    } catch { alert('Failed to add room.'); }
    finally { setAddingRoom(false); }
  };

  const toggleRoomOccupancy = async (roomId: number, currentState: boolean, propertyId: number) => {
    try {
      const res = await api.patch(`/api/rooms/${roomId}`, { is_occupied: !currentState });
      setProperties(prev => prev.map(p =>
        p.id === propertyId
          ? { ...p, rooms: p.rooms.map((r: any) => r.id === roomId ? { ...r, is_occupied: !currentState } : r) }
          : p
      ));
    } catch { alert('Failed to update room status.'); }
  };

  return (
    <DashboardLayout title="My Properties">
      <div className="space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-white">My Properties</h2>
            <p className="text-slate-500 text-sm mt-0.5">{properties.length} properties in your portfolio</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-white/5 rounded-[24px] animate-pulse" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <Building2 size={40} className="text-slate-600" />
            <p className="text-white font-bold text-lg">No properties yet</p>
            <p className="text-slate-500 text-sm text-center max-w-sm">Contact GoFlex Admin to add properties to your portfolio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {properties.map(prop => {
              const occupied = prop.rooms?.filter((r: any) => r.is_occupied).length || 0;
              const total = prop.rooms?.length || 0;
              const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;

              return (
                <div key={prop.id} className="bg-[#080A0E]/60 border border-white/10 rounded-[24px] overflow-hidden">
                  {/* Property Header */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={prop.featured_image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600'}
                      alt={prop.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div>
                        <h3 className="text-white font-black text-lg leading-tight">{prop.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <MapPin size={10} className="text-slate-400" />
                          <span className="text-slate-400 text-xs">{prop.city}, {prop.state}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {prop.verified && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-400/20 border border-emerald-400/30 rounded-lg text-[9px] font-black text-emerald-400 uppercase">
                            <BadgeCheck size={10} /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 border-b border-white/5">
                    <div className="p-4 text-center border-r border-white/5">
                      <p className="text-neon-blue font-black text-xl">{occupied}/{total}</p>
                      <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-0.5">Occupied</p>
                    </div>
                    <div className="p-4 text-center border-r border-white/5">
                      <p className="text-amber-400 font-black text-xl">{occupancyRate}%</p>
                      <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-0.5">Occupancy</p>
                    </div>
                    <div className="p-4 text-center">
                      <p className="text-emerald-400 font-black text-xl">₹{(prop.rent / 1000).toFixed(0)}k</p>
                      <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-0.5">Base Rent</p>
                    </div>
                  </div>

                  {/* Rooms */}
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Rooms</p>
                      <button
                        onClick={() => setShowAddRoom(showAddRoom === prop.id ? null : prop.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-neon-blue/10 border border-neon-blue/20 text-neon-blue rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neon-blue/20 transition-colors"
                      >
                        <Plus size={10} /> Add Room
                      </button>
                    </div>

                    {/* Add Room Form */}
                    {showAddRoom === prop.id && (
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 mb-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            placeholder="Room name (e.g. Room 301)"
                            value={roomForm.name}
                            onChange={e => setRoomForm(f => ({ ...f, name: e.target.value }))}
                            className="col-span-2 bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2 placeholder:text-slate-600 focus:outline-none focus:border-neon-blue/50"
                          />
                          <select
                            value={roomForm.type}
                            onChange={e => setRoomForm(f => ({ ...f, type: e.target.value }))}
                            className="bg-white/5 border border-white/10 text-white text-xs rounded-xl px-3 py-2"
                          >
                            <option value="single">Single</option>
                            <option value="double">Double</option>
                            <option value="triple">Triple</option>
                          </select>
                          <input
                            placeholder="Floor (optional)"
                            type="number"
                            value={roomForm.floor}
                            onChange={e => setRoomForm(f => ({ ...f, floor: e.target.value }))}
                            className="bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2 placeholder:text-slate-600 focus:outline-none"
                          />
                          <input
                            placeholder="Rent (₹/month)"
                            type="number"
                            value={roomForm.rent}
                            onChange={e => setRoomForm(f => ({ ...f, rent: e.target.value }))}
                            className="col-span-2 bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2 placeholder:text-slate-600 focus:outline-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowAddRoom(null)}
                            className="flex-1 py-2 border border-white/10 text-slate-400 rounded-xl text-xs font-bold"
                          >Cancel</button>
                          <button
                            onClick={() => handleAddRoom(prop.id)}
                            disabled={addingRoom}
                            className="flex-1 py-2 bg-neon-blue text-[#0b0e14] rounded-xl text-xs font-black disabled:opacity-50"
                          >{addingRoom ? 'Adding...' : 'Add Room'}</button>
                        </div>
                      </div>
                    )}

                    {/* Room List */}
                    {(prop.rooms || []).slice(0, 5).map((room: any) => (
                      <div key={room.id} className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                        <div>
                          <p className="text-white text-sm font-bold">{room.name}</p>
                          <p className="text-slate-500 text-[10px]">{room.type} · ₹{room.rent?.toLocaleString('en-IN')}/mo</p>
                        </div>
                        <button
                          onClick={() => toggleRoomOccupancy(room.id, room.is_occupied, prop.id)}
                          className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-colors cursor-pointer ${
                            room.is_occupied
                              ? 'bg-rose-400/20 text-rose-400 border-rose-400/30 hover:bg-rose-400/30'
                              : 'bg-emerald-400/20 text-emerald-400 border-emerald-400/30 hover:bg-emerald-400/30'
                          }`}
                        >
                          {room.is_occupied ? 'Occupied' : 'Available'}
                        </button>
                      </div>
                    ))}
                    {prop.rooms?.length > 5 && (
                      <p className="text-slate-600 text-[10px] text-center py-1">+{prop.rooms.length - 5} more rooms</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
