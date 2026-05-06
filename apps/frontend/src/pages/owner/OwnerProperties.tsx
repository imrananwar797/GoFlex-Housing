import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ownerService, OwnerProperty } from '../../services/owner.service';

export default function OwnerProperties() {
  const [properties, setProperties] = useState<OwnerProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const result = await ownerService.getProperties();
      setProperties(result.data);
    } catch (err) {
      setError('Failed to load properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="My Portfolio">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <h4 className="text-white text-xl font-black mb-1">Property Assets</h4>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Real-time performance of your listed inventory</p>
            </div>
            <button className="px-6 py-3 bg-neon-blue text-[#0B0E14] font-black rounded-xl text-[10px] uppercase tracking-widest hover:scale-[1.05] transition-all">
                + Add New Property
            </button>
        </div>

        {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold">{error}</div>}

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-2 border-neon-blue/20 border-t-neon-blue rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property.id} className="bg-[#080A0E]/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden group hover:border-neon-blue/30 transition-all duration-500">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={property.featured_image || property.cover_image_url || 'https://via.placeholder.com/600x400'}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-[#0B0E14]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <span className="text-neon-blue text-[9px] font-black uppercase">₹{property.monthly_price?.toLocaleString()}/mo</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-white text-lg font-black mb-1">{property.name}</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-6">{property.city}, {property.state}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                        <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest mb-1">Occupancy</p>
                        <p className="text-white text-sm font-black">{property.occupancyRate || property.occupancy || 0}%</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                        <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest mb-1">Revenue (MoM)</p>
                        <p className="text-emerald-400 text-sm font-black">₹{(property.monthly_price * 0.9).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <NavLink to={`/owner/properties/${property.id}`} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-xl text-center transition-all">
                        Analytics
                    </NavLink>
                    <NavLink to={`/owner/properties/${property.id}/bookings`} className="flex-1 py-3 border border-neon-blue/30 text-neon-blue hover:bg-neon-blue hover:text-[#0B0E14] text-[9px] font-black uppercase tracking-widest rounded-xl text-center transition-all">
                        Leases
                    </NavLink>
                  </div>
                </div>
              </div>
            ))}
            
            {properties.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m0 10V4m-4 6h4"/></svg>
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No properties in your portfolio yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
